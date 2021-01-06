import pathlib
import pickle
from math import sqrt
import plotly.graph_objs as go
import pandas as pd
import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output, State
from flask import make_response, render_template_string
from sklearn import linear_model, tree, neighbors
from sklearn.metrics import mean_absolute_error, mean_squared_error
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
from app.plotly.train_models import models_SARIMA, validating_Forecasts_plot, \
    forecasts_steps_plot, training_dataset

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
                        dbc.Button("SET PARAMETER", outline=True, color="primary", id="open",
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
                                                dbc.Label("Auto-regressive (p)"),
                                                dbc.Input(
                                                    id='p',
                                                    placeholder="p...", bs_size="md",
                                                    className="mb-3",
                                                    min=0,
                                                    value=1,
                                                    type='number'

                                                ),
                                                dbc.Label("Integrated  (d)"),
                                                dbc.Input(
                                                    id='d',
                                                    placeholder="d...", bs_size="md",
                                                    className="mb-3",
                                                    min=0,
                                                    value=1,
                                                    type='number'
                                                ),
                                                dbc.Label("Moving Average  (q)"),
                                                dbc.Input(placeholder="q...", bs_size="md",
                                                          value=1,
                                                          id='q',
                                                          type='number', min=0),
                                                # p
                                                html.Br(),
                                                dbc.Label("(P)"),
                                                dbc.Input(placeholder="P...", bs_size="md",
                                                          value=1, id='P',
                                                          type='number', min=0),
                                                # d
                                                html.Br(),
                                                dbc.Label("(D)"),
                                                dbc.Input(placeholder="D...", bs_size="md",
                                                          value=1, id='D',
                                                          type='number', min=0),
                                                # q
                                                html.Br(),
                                                dbc.Label("(Q)"),
                                                dbc.Input(placeholder="Q...", bs_size="md",
                                                          value=1, id='Q',
                                                          type='number', min=0),
                                                # s
                                                html.Br(),
                                                dbc.Label("(S)"),
                                                dbc.Input(placeholder="S...", bs_size="md",
                                                          value=12, id='S',
                                                          type='number', min=0),
                                            ]
                                        ),
                                    ]
                                ),
                                dbc.ModalFooter(
                                    [
                                        dbc.Button("Save", color="primary", className="mr-1", id='save'),
                                        dbc.Button("Cancel", color="secondary", className="mr-1", id='cancel'),
                                    ]
                                ),
                            ],
                            id="modal",
                        ),
                    ]),

                    html.Br(), html.Br(),
                    html.Div(
                        [
                            # summary data
                            html.Div(id='title_pred', style={'color': 'orange'}),
                            html.Div(id='summary_data'),
                            # summary models
                            html.Div(id='summary_models'),
                            html.Hr(),
                            # visual training datasets
                            html.Div([dcc.Graph(id='visual_training')], className='visual_training'),
                            # validating predict + actual
                            html.Div([
                                dcc.Graph(id='visual_fitting')
                            ], className='visual_fitting'),
                            # The Mean Squared Error of our forecasts
                            html.H4('Accuracy Models'),
                            html.B(id='mse'),
                            # visual data
                            html.Div(id='example'),
                            # forecasting in the feature
                            html.Hr(),
                            html.Br(),
                            # slice
                            dbc.Row([
                                dbc.Col(
                                    html.Div([
                                        html.H4('Producing and Visualizing Forecasts'),
                                        html.Div(id='slider-output-container'),
                                        dcc.Slider(
                                            id='my-slider',
                                            min=1,
                                            max=500,
                                            step=1,
                                            value=1,
                                        ),
                                    ]),
                                )

                            ]),
                            html.Div([
                                dcc.Graph(id='Forecasts')
                            ], className='Forecasts'),
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
# visual training model
@app.callback(
    Output('visual_training', 'figure'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('my-range-slider-year', 'value'),
)
def visual_training(code, disease, range_year):
    y = query.read_csv_disease(code)
    y = y[(y.index.year >= int(range_year[0])) & (y.index.year <= int(range_year[1]))]
    y = y[str(disease)].resample('MS').mean()
    fig = training_dataset(y, disease)
    return fig


# summary models sarima
@app.callback(
    Output('summary_data', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
)
def summary_models(code, disease):
    y = query.read_csv_disease(code)

    return html.P([
        "Disease to forecasts: {}".format(str(disease)), html.Br(),
        "Datasets Shape:                  {}".format(y[str(disease)].shape), html.Br(),
        "Count:              {}".format(round(y[str(disease)].count()), html.Br(),
                                        "Mean:              {}".format(round(y[str(disease)].mean(), 4)), html.Br(),
                                        "STD: {}".format(y[str(disease)].std())), html.Br(),
        "Min:                {}".format(y[str(disease)].min()), html.Br(),
        'Max:                {}'.format(y[str(disease)].max()), html.Br()
    ])

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
    result = models_SARIMA(y, pdq, seasonal_order)
    return result


# visualize data
@app.callback(
    Output('visual_fitting', 'figure'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('slice-date', 'date'),
    Input('my-range-slider-year', 'value'),
)
def validating_Forecasts(code, disease, date_pre, values):
    # get data
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    # end data
    start_year = values[0]
    end_year = values[1]
    pred = results.get_prediction(start=pd.to_datetime(date_pre), dynamic=False)
    pred_ci = pred.conf_int()
    fig = validating_Forecasts_plot(y, pred, pred_ci, code, disease, date_pre, start_year, end_year)
    return fig


# The Mean Squared Error of our forecasts
@app.callback(
    Output('mse', 'children'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('slice-date', 'date'),
    Input('my-range-slider-year', 'value'),
)
def accurancy(code, disease, date_pre, values):
    # get data
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    # end data
    pred = results.get_prediction(start=pd.to_datetime(date_pre), dynamic=False)
    y_forecasted = pred.predicted_mean
    y_truth = y[str(date_pre):]

    # Compute the mean square error
    # mse = ((y_forecasted - y_truth) ** 2).mean()
    mse = mean_squared_error(y_truth, y_forecasted)
    mae = mean_absolute_error(y_truth, y_forecasted)
    rmse = np.sqrt(mse)
    # return 'Mean Squared Error: {}'.format(round(mse, 2))
    return html.Div([
        html.Br(), "Mean squared error:       {}".format(round(mse, 2)), html.Br(),
        "Mean absolute error:              {}".format(round(mae, 2)), html.Br(),
        "Root mean squared error:              {}".format(round(rmse, 2)),
    ])


# forcast in the feature
@app.callback(
    Output('Forecasts', 'figure'),
    Input('province_dropdown', 'value'),
    Input('disease_dropdown', 'value'),
    Input('slice-date', 'date'),
    Input('my-range-slider-year', 'value'),
    Input('my-slider', 'value'),
)
def forecasts_steps(code, disease, date_pre, values, time_step):
    # get data
    df = query.read_csv_disease(code)
    y = df[str(disease)].resample('MS').mean()
    y = y.fillna(y.bfill())
    # end get data
    pred_uc = results.get_forecast(steps=int(time_step))
    start_year = values[0]
    end_year = values[1]
    # end year
    pred_ci = pred_uc.conf_int()
    fig = forecasts_steps_plot(y[str(start_year):str(end_year)], pred_uc, pred_ci, code, disease, date_pre)
    return fig


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
    [Input("open", "n_clicks"), Input("cancel", "n_clicks")],
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
    return 'You selected time step: "{}" month'.format(value)


# year slice
@app.callback(
    dash.dependencies.Output('output-year', 'children'),
    [dash.dependencies.Input('year-slider', 'value')])
def update_output(value):
    return 'You have selected "{}"'.format(value)


# year range slice
# range-slider-year
@app.callback(
    Output('range-slider-year', 'children'),
    Input('my-range-slider-year', 'value'))
def update_output(value):
    return 'You have selected "{}"'.format(value)


# input model
@app.callback(
    Output('title_pred', 'children'),
    [Input('year-slider', 'value')])
def update_output(value):
    return 'Datasets of Viet Nam From "{}"'.format(value)
