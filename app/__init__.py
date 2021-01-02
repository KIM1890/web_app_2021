# import dash
# import dash_bootstrap_components as dbc
from flask import Flask

# dash
app = Flask(__name__)

from app import routes
