import dash_bootstrap_components as dbc
import dash_html_components as html
from dash.dependencies import Input, Output, State

PLOTLY_LOGO = "/assets/img/logo.png"


def header_html():
    navbar = dbc.Navbar(
        [
            html.Div(
                [html.Div(
                    [

                        html.Div([
                            html.Ul([
                                # logo
                                html.Li(
                                    [html.Img(src=PLOTLY_LOGO, width='60px')]
                                ),

                                # summary
                                html.Li(
                                    [
                                        dbc.NavItem(
                                            dbc.NavLink("Summary Data", href="/home"
                                                        )),
                                        # code in here
                                    ]
                                ),
                                # expore
                                html.Li(
                                    [
                                        dbc.DropdownMenu(
                                            [dbc.DropdownMenuItem('Explore Province',
                                                                  href="/explore"),
                                             dbc.DropdownMenuItem("Explore Disease",
                                                                  href="/factor")],
                                            label="Explore Data",
                                            # style={'color': 'white'},
                                            nav=True,
                                        ),
                                    ]
                                ),
                                # compare
                                html.Li(
                                    [
                                        dbc.NavItem(
                                            dbc.NavLink("Compare Province", href="/compare"
                                                        )),
                                    ]
                                ),
                                # predict
                                html.Li(
                                    [
                                        dbc.NavItem(
                                            dbc.NavLink("Predict Disease", href="/"
                                                        )),
                                    ]
                                ),
                            ], className="nav navbar-nav head_menu")
                        ],
                            className='collapse navbar-collapse', id="myNavbar"
                        )],
                    className="navbar-header"
                )],
                className="container-fluid")
        ],
        className="navbar navbar-default "
    )
    return navbar
