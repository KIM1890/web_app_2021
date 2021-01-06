import pathlib
import pickle
from math import sqrt
import plotly.graph_objs as go
import pandas as pd
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from sklearn import linear_model, tree, neighbors
from sklearn.metrics import mean_absolute_error
import dash_bootstrap_components as dbc
from app import app
from app.dash_template import menu
from app.plotly import train_models
from app.database.models import GetData
from IPython.display import HTML
# get path file
import numpy as np
import io
import base64
import matplotlib.pyplot as plt
from app.plotly.train_models import visual_disease_pre, \
    numOfDays, \
    train_dataset, models, \
    visual_corr, X_, \
    plotting_data, fitting_data, models_SARIMA

PATH = pathlib.Path(__file__).parent
TEMPLATE_PATH = PATH.joinpath("../dash_template").resolve()
results = pickle.load(open(TEMPLATE_PATH.joinpath('models.pkl'), 'rb'))

query = GetData()

layout = html.Div(
    [
        html.Div(
            [html.Div(
                [
                    # menu
                    menu.select_html(),
                    # result in here
                    html.Br(), html.Br(),
                    html.Div([
                        dbc.Button("ADD PARAMETER", outline=True, color="primary", id="open",
                                   className="mr-1"),
                        dbc.Modal(
                            [
                                dbc.ModalHeader("Models Sarima"),
                                dbc.ModalBody(
                                    [
                                        # input modal
                                        html.Div(
                                            [

                                                html.Br(),
                                                dbc.Input(
                                                    id='p',
                                                    placeholder="p...", bs_size="md",
                                                    className="mb-3",
                                                    min=0,
                                                    value=1,
                                                    type='number'

                                                ),
                                                dbc.Input(
                                                    id='d',
                                                    placeholder="d...", bs_size="md",
                                                    className="mb-3",
                                                    min=0,
                                                    value=1,
                                                    type='number'
                                                ),
                                                dbc.Input(placeholder="q...", bs_size="md",
                                                          value=1,
                                                          id='q',
                                                          type='number', min=0),
                                                # p
                                                html.Br(),
                                                dbc.Input(placeholder="P...", bs_size="md",
                                                          value=1, id='P',
                                                          type='number', min=0),
                                                # d
                                                html.Br(),
                                                dbc.Input(placeholder="D...", bs_size="md",
                                                          value=1, id='D',
                                                          type='number', min=0),
                                                # q
                                                html.Br(),
                                                dbc.Input(placeholder="Q...", bs_size="md",
                                                          value=1, id='Q',
                                                          type='number', min=0),
                                                # s
                                                html.Br(),
                                                dbc.Input(placeholder="S...", bs_size="md",
                                                          value=12, id='S',
                                                          type='number', min=0),
                                            ]
                                        ),
                                    ]
                                ),
                                dbc.ModalFooter(
                                    [dbc.Button("Save", id="save", className="ml-auto"),
                                     dbc.Button("Close", id="close", className="ml-auto")]
                                ),
                            ],
                            id="modal",
                        ),
                    ]),

                    html.Br(), html.Br(),
                    html.Div(
                        [
                            # summary data
                            html.Div(id='summary_data'),
                            html.Br(),
                            # summary table
                            html.Div(id='summary_models'),
                            html.Br(),
                            # fitting predict + actual
                            html.Div([
                                dcc.Graph(id='visual_fitting')
                            ], className='visual_fitting'),
                            # visual data
                            html.Div(id='example'),
                            # forcasting in the feature
                            html.Div(id='Forecasts'),
                        ],
                        className="col-sm-6 text-left"
                    ),

                ],
                className='row content'
            )],
            className="container-fluid text-center",

        ),
    ],

    className="body")


# testing in training and testing datasets with sarima
# summary models sarima
@app.callback(
    Output('summary_data', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
)
def summary_models(code, disease):
    df = query.read_csv_disease(code)
    return list(df[[str(disease)]].describe())


# training models
@app.callback(
    Output('summary_models', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('p', 'value'),
    Input('d', 'value'),
    Input('q', 'value'),
    Input('P', 'value'),
    Input('D', 'value'),
    Input('Q', 'value'),
    Input('S', 'value'),

)
def training_models(code, disease, p, d, q, P, D, Q, S):
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    pdq = (p, d, q)
    seasonal_order = (P, D, Q, S)
    results = models_SARIMA(y, pdq, seasonal_order)
    return list(results.summary().tables[1])


# visualize data
@app.callback(
    Output('example', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('slice-date', 'date'),
    Input('year-slider', 'value'),
)
def validating_Forecasts(code, disease, date_pre, year):
    # get data
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    # end data
    pred = results.get_prediction(start=pd.to_datetime(date_pre), dynamic=False)
    pred_ci = pred.conf_int()
    fig = validating_Forecasts(y, pred, pred_ci, code, disease, date_pre, year)
    return fig


# forcast in the feature
@app.callback(
    Output('Forecasts', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('slice-date', 'date'),
    Input('year-slider', 'value'),
    Input('my-slider', 'value'),
)
def forecasts_steps(code, disease, date_pre, year, time_step):
    # get data
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    # end get data
    pred_uc = results.get_forecast(steps=int(time_step))

    pred_ci = pred_uc.conf_int()
    forecasts_steps(y, pred_uc, pred_ci, code, disease, date_pre, year)
    return 'success'


#########################################################
# bootstrap button
@app.callback(
    Output("collapse", "is_open"),
    [Input("collapse-button", "n_clicks")],
    [State("collapse", "is_open")],
)
def toggle_collapse(n, is_open):
    if n:
        return not is_open
    return is_open


# modal
@app.callback(
    Output("modal", "is_open"),
    [Input("open", "n_clicks"), Input("close", "n_clicks")],
    [State("modal", "is_open")],
)
def toggle_modal(n1, n2, is_open):
    if n1 or n2:
        return not is_open
    return is_open


# year training dataset
@app.callback(
    Output('output-container-range-slider', 'children'),
    [Input('year_slider', 'value')])
def update_year_slider(value):
    return 'Datasets disease Viet Nam: "{}"'.format(value)


# slice range step data in the feature
@app.callback(
    dash.dependencies.Output('slider-output-container', 'children'),
    [dash.dependencies.Input('my-slider', 'value')])
def update_output_step(value):
    return 'You selected time step: "{}"'.format(value)


# year slice
@app.callback(
    dash.dependencies.Output('output-year', 'children'),
    [dash.dependencies.Input('year-slider', 'value')])
def update_output(value):
    return 'You have selected "{}"'.format(value)
