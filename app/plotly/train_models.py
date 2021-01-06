import pathlib
import pickle
# Visualization
import plotly
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import pandas as pd
from datetime import datetime
import datetime
import numpy as np
from sklearn import preprocessing
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from statsmodels.tsa.arima_model import ARIMA
import warnings
import itertools
import statsmodels.api as sm

warnings.filterwarnings("ignore")
# file path
PATH = pathlib.Path(__file__).parent
FILE_MODEL = PATH.joinpath("../dash_template").resolve()

# training model arima
p = d = q = range(0, 2)

# Generate all different combinations of p, q and q triplets
pdq = list(itertools.product(p, d, q))


# pqd
def pdq():
    p = d = q = range(0, 2)
    pdq = list(itertools.product(p, d, q))
    return pdq


# seasonal_pdq
def seasonal_pdq():
    p = d = q = range(0, 2)
    seasonal_pdq = [(x[0], x[1], x[2], 12) for x in list(itertools.product(p, d, q))]
    return seasonal_pdq


# param and param seasonal_pdq()
def AIC_SARIMA(y, pdq, seasonal_pdq):
    for param in pdq:
        for param_seasonal in seasonal_pdq:
            try:
                mod = sm.tsa.statespace.SARIMAX(y,
                                                order=param,
                                                seasonal_order=param_seasonal,
                                                enforce_stationarity=False,
                                                enforce_invertibility=False)

                results = mod.fit()
                pickle.dump(results, open(FILE_MODEL.joinpath('models.pkl'), 'wb'))

            except:
                print('Testing models')
    return 'success file'


# model training
# dat them tham so pdq,...
def models_SARIMA(y, pdq, seasonal_pdq):
    mod = sm.tsa.statespace.SARIMAX(y,
                                    order=pdq,
                                    seasonal_order=seasonal_pdq,
                                    enforce_stationarity=False,
                                    enforce_invertibility=False)

    results = mod.fit()
    pickle.dump(results, open(FILE_MODEL.joinpath('models.pkl'), 'wb'))
    return results


# validating_Forecasts
def validating_Forecasts(y, pred, pred_ci, code, disease, date_pre, year):
    ax = y[str(year):].plot(label='observed')
    pred.predicted_mean.plot(ax=ax, label='One-step ahead Forecast', alpha=.7)

    ax.fill_between(pred_ci.index,
                    pred_ci.iloc[:, 0],
                    pred_ci.iloc[:, 1], color='k', alpha=.2)

    ax.set_xlabel('Date')
    ax.set_ylabel(str(disease))
    plt.legend()

    return plt.show()


# forecasts_steps
def forecasts_steps(y, pred_uc, pred_ci, code, disease, date_pre, year):
    ax = y.plot(label='observed', figsize=(20, 15))
    pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
    ax.fill_between(pred_ci.index,
                    pred_ci.iloc[:, 0],
                    pred_ci.iloc[:, 1], color='k', alpha=.25)
    ax.set_xlabel('Date')
    ax.set_ylabel(str(disease))

    plt.legend()
    return plt.show()


# end training mo

##########################################################################
def listToString(s):
    str1 = " "
    for ele in s:
        str1 += ele
    return str1


# replace ky tu

def replaceList(a):
    arr = []
    for elemt in a:
        arr.append(elemt.replace('_', ' '))
    return arr  # between two days


def numOfDays(start_date, end_date):
    start = pd.to_datetime(start_date).date()
    end = pd.to_datetime(end_date).date()
    return abs(start - end).days


# visualization heatmap
def visual_corr(df):
    df = df.drop(columns=['province_code', 'year', 'month'])
    fig = go.Figure(data=go.Heatmap(
        z=df.corr(),
        x=replaceList(df.columns.values),
        y=replaceList(df.columns.values),
        hoverongaps=False))
    fig.update_layout(title='Correlation data ....',
                      height=500, width=700,
                      )
    return fig


# example about prediction and forecasting
def select_datasets(df, disease, number_days):
    df = df.drop(columns=['province_code', 'raining_day'])
    forcast_col = str(disease)
    forcast_out = int(number_days)
    df['label'] = df[forcast_col].shift(-forcast_out)
    return df


# training dataset
def train_dataset(data, disease, number_days, test):
    df = select_datasets(data, disease, number_days)
    X = np.array(df.drop(['label'], 1))
    X = preprocessing.scale(X)
    X = X[:-number_days]
    y = np.array(df['label'])
    y = y[:-number_days]
    train = train_test_split(X, y, test_size=(int(test) / 100))
    return train


# fit model
def models(data, disease, test_size, number_day, model_name):
    X_train, X_test, y_train, y_test = train_dataset(data, disease, number_day, int(test_size))
    model = model_name
    model.fit(X_train, y_train)
    pickle.dump(model, open(FILE_MODEL.joinpath('predict.pkl'), 'wb'))
    return 'success full'


# x to forecasting
def X_(data, disease, number_days):
    df = select_datasets(data, disease, number_days)
    X = np.array(df.drop(['label'], 1))
    X = preprocessing.scale(X)
    X_forecast_out = X[-number_days:]
    return X_forecast_out


# visualization forcasting
def plotting_data(df, disease, forecast_prediction):
    df['forecast'] = np.nan
    last_date = df.iloc[-1].name
    last_unix = last_date.timestamp()
    one_day = 86400
    next_unix = last_unix + one_day
    for i in forecast_prediction:
        next_date = datetime.datetime.fromtimestamp(next_unix)
        next_unix += 86400
        df.loc[next_date] = [np.nan for _ in range(len(df.columns) - 1)] + [i]

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df.index, y=df[str(disease)],
                             mode='lines',
                             line=dict(color='rgb(31, 119, 180)'),
                             name='Training data'))
    fig.add_trace(go.Scatter(x=df.index, y=df['forecast'],
                             mode='lines',
                             line_color='orange',
                             name='Testing data'))
    fig.update_layout(title='Visualize predicted',
                      xaxis_title='Date',
                      height=500, width=700,
                      yaxis_title=str(disease) + ' number case')

    return fig


# fitting data
def fitting_data(df, disease, y_pred, y_test):
    index = [i for i in range(0, len(y_pred))]
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=index, y=y_test,
                             # fig.add_trace(go.Scatter(x=index, y=y_test[-1997:],
                             mode='lines',
                             line=dict(color='rgb(31, 119, 180)'),
                             name='real values'))
    fig.add_trace(go.Scatter(x=index, y=y_pred,
                             mode='lines',
                             line_color='orange',
                             name='prediction'))
    fig.update_layout(title='Fitting datasets',
                      xaxis_title='Date',
                      height=500, width=700,
                      yaxis_title=str(disease).replace('_', ' ') + ' number case')

    return fig


# visualization training data
def visual_disease_pre(df, disease):
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=df.index, y=df[str(disease)],
                             mode='markers',
                             line=dict(color='rgb(31, 119, 180)'),
                             name='real values'))

    fig.update_layout(title='Training datasets',
                      xaxis_title='Date',
                      height=500, width=700,
                      yaxis_title=str(disease).replace('_', ' ') + ' number case')

    return fig