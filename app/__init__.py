import dash
import dash_bootstrap_components as dbc
from flask import Flask
from flask_assets import Bundle, Environment

# dash
# app = Flask(__name__)
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
server = app.server

bundles = {
    # js
    'main_js': Bundle('js/myjs/home.js',
                      'js/myjs/myscript.js',
                      'js/myjs/explore.js',
                      'js/myjs/compare.js',
                      'js/myjs/factor.js',
                      'js/myjs/predict.js',
                      output='js/myjs/gen/main.js'),
    'lib_js': Bundle(
        'js/myjs/lib/jquery.min.js',
        'js/myjs/lib/plotly-latest.min.js',
        'js/myjs/lib/popper.js',
        output='js/lib/gen/lib.js'),
    # css
    'main_css': Bundle('css/mycss/summary.css',
                       'css/mycss/explore.css',
                       'css/mycss/map.css',
                       'css/mycss/compare.css',
                       'css/mycss/mycss.css',
                       'css/mycss/predict.css',
                       output='css/mycss/gen/my_main.css'),
    'lib_css': Bundle('css/mycss/lib/bootstrap.min.css',

                      output='css/lib/gen/lib.css'),

}
assets = Environment(server)
assets.register(bundles)
from app import routes
