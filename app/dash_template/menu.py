import pathlib

import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_core_components as dcc
from app.database.models import GetData
from sklearn.model_selection import train_test_split
from sklearn import linear_model, tree, neighbors
from datetime import date
import datetime
import pandas as pd

query = GetData()
PLOTLY_LOGO = "assets/img/logo.png"
# column menu
province_name = query.get_province_name()
province = query.get_province_code()
columns = query.get_to_disease()
col_climate = query.get_to_climate()


# end columns
def select_html():
    nav = html.Div(
        [
            # row 1 processing data
            html.B(""
                   "Predicted Target", style={'color': 'blue'}),
            html.Br(),
            html.Hr(),
            dbc.Row(
                [

                    dbc.Col(html.Div(
                        [
                            # disease
                            html.B('Selected Disease:'),
                            html.Br(),
                            dcc.Dropdown(
                                id='disease_dropdown',
                                options=[
                                    {'label': name.replace('_', ' '), 'value': name}
                                    for name in columns.drop(['year', 'month', 'fips',
                                                              'province_name'], axis=1)
                                ],
                                value='influenza',
                            ),

                        ]
                    )),

                ]
            ),
            # province code
            html.Br(),
            dbc.Row([
                dbc.Col(html.Div(
                    # province
                    [html.B('Selected Province:'),
                     dcc.Dropdown(
                         id='province_dropdown',
                         options=[
                             {'label': name, 'value': code}
                             for name, code in zip(province_name, province)
                         ],
                         value=15
                     ), ],

                )),
            ]),
            # end province code

            # climate
            html.Br(),
            dbc.Row([
                # climate
                dbc.Col(html.Div(
                    # province
                    [
                        html.B('Selected Attribute:'),
                        html.Br(),
                        dcc.Dropdown(
                            options=[
                                {'label': name.replace('_', ' '), 'value': name}
                                for name in col_climate
                            ],
                            value='evaporation',
                            disabled=True
                        ),

                    ],

                )),
            ]),
            # range between
            html.Br(),
            dbc.Row([
                dbc.Col(html.Div(
                    [
                        html.Div([
                            html.B('Datasets from 1997 to 2019:'),
                            html.Div(id='range-slider-year'),
                            dcc.RangeSlider(
                                id='my-range-slider-year',
                                min=1997,
                                max=2019,
                                step=1,
                                value=[1997, 2019]
                            ),
                        ])
                    ]
                ))
            ]),
            # end range year
            # # range year
            # html.Br(),
            # dbc.Row([
            #     dbc.Col([
            #         html.B('Datasets from 1997 to 2019:'),
            #         html.Br(),
            #         html.Div(id='output-year'),
            #         html.Br(),
            #         dcc.Slider(
            #             id='year-slider',
            #             min=1997,
            #             max=2019,
            #             step=1,
            #             value=1997,
            #         ),
            #     ]),
            # ]),
            # date range
            dbc.Row([
                dbc.Col([
                    dcc.DatePickerSingle(
                        id='slice-date',
                        month_format='MMMM Y',
                        placeholder='MMMM Y',
                        date=datetime.date(2010, 1, 1)
                    ),
                ]),
            ]),

            # row parameter to predict
            # models
            html.Hr(),
            html.B('Models Predicted:'),
            html.Br(),
            dbc.Row([
                dbc.Col([
                    # dbc.Button("SARIMA", color="primary", id="collapse-button",
                    #
                    #  className="mr-1"),
                    html.Div([
                        dcc.Dropdown(
                            id='models-dropdown',
                            options=[
                                {'label': 'SARIMA', 'value': 'SARIMA'},
                                {'label': 'ARIMA', 'value': 'ARIMA'},
                                {'label': 'Multi Regression', 'value': 'LinearRegression'}
                            ],
                            value='SARIMA'
                        ),
                    ]),

                ]),

            ])
        ],

        className="col-sm-3 sidenav"
    )
    return nav
