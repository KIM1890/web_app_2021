from flask import Flask, render_template, request, jsonify
from app.database import models
from flask_assets import Bundle, Environment
from app.plotly import visual_plotly as vp
import dash_html_components as html
from app import app
from app import server

# connect database
query = models.GetData()
visual = vp.Visual()
# get data viet nam
vn_json = query.read_json_vn()

app.layout = html.Div(id='dash-container')
##################################################
def listToString(s):
    str1 = " "
    for ele in s:
        str1 += ele
    return str1


@server.route('/home')
def home():
    columns = query.get_columns()
    # get columns disease
    col_disease = columns['disease']
    # get columns climate
    col_climate = columns['climate1'].append(columns['climate2'].dropna())
    # get data
    data = query.get_to_disease_mean()
    # visual default
    barJson = visual.bar_chart_disease(data)
    barJsonDeath = visual.bar_chart_disease_death(data)
    return render_template('home.html',
                           col_disease=col_disease,
                           col_climate=col_climate,
                           barJson=barJson,
                           barJsonDeath=barJsonDeath,
                           )


# response data home


@server.route("/summary_response", methods=['GET', 'POST'])
def home_response():
    feature_selected = query.get_disease_response()

    return jsonify({'data': render_template('response_home.html',
                                            feature_selected=feature_selected)})


# data date1 home


@server.route('/date1_home_disease', methods=['GET', 'POST'])
def date1_home_disease():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']

    data = query.get_to_disease()
    line = visual.line_date1_exp(data, disease, begin, end)
    return line


# data disease date1 home region


@server.route('/region_date1_disease_home', methods=['GET', 'POST'])
def region_date1_disease_home():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_disease_region(region)
    line = visual.region_date1_exp(data, disease, begin, end)
    return line


# data date1 climate home


@server.route('/date1_home_climate', methods=['GET', 'POST'])
def date1_home_climate():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']

    data = query.get_to_climate()
    line = visual.line_date1_climate_exp(data, climate, begin, end)
    return line


# region date1 climate


@server.route('/region_date1_climate_home', methods=['GET', 'POST'])
def region_date1_climate_home():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_climate_region(region)
    line = visual.region_date1_climate_exp(data, climate, begin, end)
    return line


# disease ca nuoc heatmap VN


@server.route('/heatmap_vn', methods=['GET', 'POST'])
def heatmap_vn():
    df = query.get_to_disease()

    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']

    VNJson = visual.heatmap_vn(df, vn_json, disease, begin, end)
    return VNJson


# line chart disease ca nuoc


@server.route('/line_chart_disease', methods=['GET', 'POST'])
def line_chart_disease():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    mean = query.get_to_disease_mean()
    max_ = query.get_to_disease_max()
    min_ = query.get_to_disease_min()
    LineJson = visual.stat_disease_year(mean, max_, min_, disease, begin, end)

    return LineJson


# population ca nuoc


@server.route('/heatmap_population', methods=['GET', 'POST'])
def heatmap_population():
    data = query.get_to_population()

    begin = request.args['begin']
    end = request.args['end']

    VNJson = visual.heatmap_population(data, vn_json, begin, end)

    return VNJson


# line chart population


@server.route('/line_chart_population', methods=['GET', 'POST'])
def line_chart_population():
    data = query.get_to_population()

    begin = request.args['begin']
    end = request.args['end']

    line = visual.line_chart_population(data, begin, end)

    return line


# chart region population


@server.route('/chart_region_population', methods=['GET', 'POST'])
def chart_region_population():
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']
    data = query.get_to_population_region(region)
    line = visual.chart_region_population(data, begin, end)

    return line


# ratio disease/population ca nuoc


@server.route('/heatmap_ratio', methods=['GET', 'POST'])
def heatmap_ratio():
    data = query.get_to_disease_population()

    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']

    VNJson = visual.heatmap_ratio(data, vn_json, disease, begin, end)
    return VNJson


# line chart ratio


@server.route('/line_chart_ratio', methods=['GET', 'POST'])
def line_chart_ratio():
    data = query.get_to_disease_population()

    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']

    line = visual.line_chart_ratio(data, disease, begin, end)
    return line


# line chart ratio region


@server.route('/chart_region_ratio', methods=['GET', 'POST'])
def chart_region_ratio():
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']
    disease = request.args['disease']
    data = query.get_to_disease_population()
    line = visual.chart_region_ratio(data, disease, begin, end)

    return line


# climate ca nuoc


@server.route('/heatmap_climate', methods=['GET', 'POST'])
def heatmap_climate():
    data = query.get_to_climate()

    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']

    VNJson = visual.heatmap_climate(data, vn_json, climate, begin, end)
    return VNJson


# line chart climate ca nuoc


@server.route('/line_chart_climate', methods=['GET', 'POST'])
def line_chart_climate():
    data = query.get_to_climate()

    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']

    LineJson = visual.box_chart_feature(data, climate, begin, end)

    return LineJson


##########################################################

# line chart disease region tung vung mien


@server.route('/line_chart_region_disease', methods=['GET', 'POST'])
def line_chart_region_disease():
    disease = request.args['disease']
    region = request.args['region']
    begin = request.args['begin']
    end = request.args['end']

    mean = query.get_to_disease_region_mean(region)
    max_ = query.get_to_disease_region_max(region)
    min_ = query.get_to_disease_region_min(region)

    LineJson = visual.stat_disease_year(mean, max_, min_, disease, begin, end)

    return LineJson


# line chart climate region tung vung mien


@server.route('/line_chart_region_climate', methods=['GET', 'POST'])
def line_chart_region_climate():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_climate_region(region)

    LineJson = visual.box_chart_feature(data, climate, begin, end)

    return LineJson


# heatmap climate region tung vung mien


@server.route('/heatmap_climate_region', methods=['GET', 'POST'])
def heatmap_climate_region():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_climate_region(region)

    VNJson = visual.heatmap_climate(data, vn_json, climate, begin, end)
    return VNJson


# heatmap disease viet nam


@server.route('/heatmap_vn_region', methods=['GET', 'POST'])
def heatmap_vn_region():
    disease = request.args['disease']
    region = request.args['region']
    begin = request.args['begin']
    end = request.args['end']

    data = query.get_to_disease_region(region)

    LineJson = visual.heatmap_vn_region(data, vn_json, disease, begin, end)

    return LineJson


# heatmap population


@server.route('/heatmap_pop_region', methods=['GET', 'POST'])
def heatmap_pop_region():
    # disease = request.args['disease']
    region = request.args['region']
    begin = request.args['begin']
    end = request.args['end']

    data = query.get_to_population_region(region)

    VNJson = visual.heatmap_pop_region(data, vn_json, begin, end)

    return VNJson


# heatmap ratio


@server.route('/heatmap_radio_region', methods=['GET', 'POST'])
def heatmap_radio_region():
    disease = request.args['disease']
    region = request.args['region']
    begin = request.args['begin']
    end = request.args['end']

    data = query.get_to_disease_region(region)

    VNJson = visual.heatmap_radio_region(data, vn_json, disease, begin, end)

    return VNJson


########################### explorer pages#######################


@server.route('/explore', methods=['GET', 'POST'])
def explore():
    columns = query.get_columns()
    # get columns disease
    col_disease = columns['disease']
    # get columns climate
    col_climate = columns['climate1'].append(columns['climate2'].dropna())

    # name province
    province_name = query.get_province_name()
    province_code = query.get_province_code()

    return render_template('explore.html',
                           col_disease=col_disease,
                           col_climate=col_climate,
                           province=zip(province_name, province_code),
                           )


# information province response


@server.route("/explore_response/<id>")
def explore_response(id):
    data = query.get_to_pop_province(id)
    disease = query.get_to_disease_province(id)
    begin = request.args['begin']
    end = request.args['end']

    # end between time
    feature_selected = query.get_disease_response_exp(data, disease)

    return jsonify({'data': render_template('explore_response.html',
                                            feature_selected=feature_selected)})


# information province climate


@server.route("/exp_climate_response/<id>", methods=['GET', 'POST'])
def exp_climate_response(id):
    climate = query.get_to_climate_province(id)
    begin = request.args['begin']
    end = request.args['end']
    feature_selected = query.get_climate_response_exp(climate)

    return jsonify({'data': render_template('exp_climate_response.html',
                                            feature_selected=feature_selected)})


# region disease response


@server.route("/explore_response_region/<id>", methods=['GET', 'POST'])
def explore_response_region(id):
    data = query.get_to_population_region(id)
    disease = query.get_to_disease_region(id)
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['name']

    feature_selected = query.get_disease_response_exp(data, disease)
    return jsonify({'data': render_template('explore_response.html',
                                            feature_selected=feature_selected)})


# region climate response


@server.route("/explore_region_climate/<id>", methods=['GET', 'POST'])
def explore_region_climate(id):
    climate = query.get_to_climate_region(id)
    begin = request.args['begin']
    end = request.args['end']
    feature_selected = query.get_climate_response_exp(climate)
    # get attribute columns

    return jsonify({'data': render_template('exp_climate_response.html',
                                            feature_selected=feature_selected)})


# show chart in here lag correlation disease

# lag disease


@server.route('/lag_correlation', methods=['GET', 'POST'])
def lag_correlation():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']
    # get data
    data = query.get_to_disease_province(province)
    lag = visual.lag_correlation(data, disease, begin, end)
    return lag


# lag region disease


@server.route('/lag_region_disease', methods=['GET', 'POST'])
def lag_region_disease():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']
    # get data
    data = query.get_to_disease_region(region)
    lag = visual.lag_correlation(data, disease, begin, end)
    return lag


# lag climate correlation


@server.route('/lag_climate_correlation', methods=['GET', 'POST'])
def lag_climate_correlation():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']
    data = query.get_to_climate_province(province)
    lag = visual.lag_correlation(data, climate, begin, end)
    return lag


# lag correlation region


@server.route('/lag_region_climate', methods=['GET', 'POST'])
def lag_region_climate():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_climate_region(region)
    lag = visual.lag_correlation(data, climate, begin, end)
    return lag


# line chart disease for year


@server.route('/line_province_disease_year', methods=['GET', 'POST'])
def province_disease_year():
    province = request.args['province']
    begin = request.args['begin']
    end = request.args['end']
    disease = request.args['disease']

    mean = query.get_to_disease_province_mean(province)
    max_ = query.get_to_disease_province_max(province)
    min_ = query.get_to_disease_province_min(province)

    LineJson = visual.stat_disease_year(
        mean, max_, min_, disease, begin, end)
    return LineJson


# chart disease month


@server.route('/line_province_disease_month', methods=['GET', 'POST'])
def province_disease_month():
    province = request.args['province']
    begin = request.args['begin']
    end = request.args['end']
    disease = request.args['disease']

    # get data
    data = query.get_to_disease_province(province)

    LineJson = visual.stat_disease_month(data, disease, begin, end)
    return LineJson


# seasonal analyst


@server.route('/seasonal_disease_exp', methods=['GET', 'POST'])
def seasonal_disease_exp():
    disease = request.args['disease']
    province = request.args['province']
    begin = request.args['begin']
    end = request.args['end']
    # get data
    data = query.get_to_disease_province(province)
    seasonal = visual.seasonal_disease_exp(data, disease, begin, end)

    return seasonal


# seasonal disease


@server.route('/region_seasonal_disease', methods=['GET', 'POST'])
def region_seasonal_disease():
    begin = request.args['begin']
    end = request.args['end']
    disease = request.args['disease']
    region = request.args['region']

    data = query.get_to_disease_region(region)

    linejson = visual.region_season_disease(data, disease, begin, end)
    return linejson


# climate year


@server.route('/province_climate_year', methods=['GET', 'POST'])
def province_climate_year():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']

    mean = query.get_to_climate_mean_province(province)
    max_ = query.get_to_climate_max_province(province)
    min_ = query.get_to_climate_province(province)

    LineJson = visual.stat_climate_year(mean, max_, min_, climate, begin, end)
    return LineJson


# climate month


@server.route('/province_climate_month', methods=['GET', 'POST'])
def province_climate_month():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']
    data = query.get_to_climate_province(province)

    LineJson = visual.stat_climate_month(data, climate, begin, end)
    return LineJson


# seasonal analyst


@server.route('/seasonal_climate_exp', methods=['GET', 'POST'])
def seasonal_climate_exp():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']

    data = query.get_to_climate_province(province)

    LineJson = visual.seasonal_climate_exp(data, climate, begin, end)
    return LineJson
    # region
    # end region


# seasonal climate region


@server.route('/region_seasonal_climate', methods=['GET', 'POST'])
def region_seasonal_climate():
    begin = request.args['begin']
    end = request.args['end']
    climate = request.args['climate']
    region = request.args['region']

    data = query.get_to_climate_disease_region(region)

    linejoin = visual.region_season_climate(data, climate, begin, end)
    return linejoin


# correlation pages explore


@server.route('/corr_disease_exp', methods=['GET', 'POST'])
def corr_disease_exp():
    data = query.get_to_climate_disease()
    disease = request.args.getlist('disease[]')
    begin = request.args['begin']
    end = request.args['end']
    province = request.args['province']
    # get data
    data = query.get_to_disease_province(province)
    corr = visual.corr_disease_exp(data, disease, begin, end)
    return corr


# correlation region disease


@server.route('/region_corr_disease_exp', methods=['GET', 'POST'])
def region_corr_disease_exp():
    data = query.get_to_climate_disease()
    disease = request.args.getlist('disease[]')
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']
    # get data
    data = query.get_to_climate_region(region)
    corr = visual.corr_disease_exp(data, disease, begin, end)
    return corr


# line chart date1


@server.route('/line_date1_exp', methods=['GET', 'POST'])
def line_date1_exp():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    provice = request.args['province']
    # get data
    data = query.get_to_disease_province(provice)
    line = visual.line_date1_exp(data, disease, begin, end)
    return line


# date1 region


@server.route('/date1_region_disease', methods=['GET', 'POST'])
def date1_region_disease():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_disease_region(region)
    line = visual.region_date1_exp(data, disease, begin, end)
    return line


# line chart climate date1


@server.route('/line_date1_climate_exp', methods=['GET', 'POST'])
def line_date1_climate_exp():
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    provice = request.args['province']
    # get data
    data = query.get_to_climate_province(provice)
    line = visual.line_date1_climate_exp(data, climate, begin, end)
    return line


# date1 climate


@server.route('/region_date1_climate_exp', methods=['GET', 'POST'])
def region_date1_climate_exp():
    # data = query.climate_disease()
    climate = request.args['climate']
    begin = request.args['begin']
    end = request.args['end']
    region = request.args['region']

    data = query.get_to_climate_region(region)
    line = visual.region_date1_climate_exp(data, climate, begin, end)
    return line


###############################region id province Viet Nam ###################
# region disease year


@server.route('/region_disease_year', methods=['GET', 'POST'])
def region_disease_year():
    begin = request.args['begin']
    end = request.args['end']
    disease = request.args['disease']
    region = request.args['region']

    mean = query.get_to_disease_region_mean(region)
    max_ = query.get_to_disease_region_max(region)
    min_ = query.get_to_disease_region_min(region)

    linejson = visual.stat_disease_year(
        mean, max_, min_, disease, begin, end)
    return linejson


# region disease month


@server.route('/region_disease_month', methods=['GET', 'POST'])
def region_disease_month():
    begin = request.args['begin']
    end = request.args['end']
    disease = request.args['disease']
    region = request.args['region']

    data = query.get_to_disease_region(region)

    linejson = visual.stat_disease_month(data, disease, begin, end)
    return linejson


# region climate


@server.route('/region_climate_year', methods=['GET', 'POST'])
def region_climate_year():
    begin = request.args['begin']
    end = request.args['end']
    climate = request.args['climate']
    region = request.args['region']

    mean = query.get_to_climate_mean_region(region)
    max_ = query.get_to_climate_max_region(region)
    min_ = query.get_to_climate_min_region(region)

    linejson = visual.stat_climate_year(mean, max_, min_, climate, begin, end)
    return linejson


# region climate month


@server.route('/region_climate_month', methods=['GET', 'POST'])
def region_climate_month():
    begin = request.args['begin']
    end = request.args['end']
    climate = request.args['climate']
    region = request.args['region']

    data = query.get_to_climate_region(region)

    linejson = visual.stat_climate_month(data, climate, begin, end)
    return linejson


############################# comparation factor##############################


@server.route('/compare')
def compare():
    columns = query.get_columns()
    # get columns disease
    col_disease = columns['disease']
    # get columns climate
    col_climate = columns['climate1'].append(columns['climate2'].dropna())
    # get columns climate 2
    climate2 = columns['climate2'].dropna()
    # get province column
    province_name = query.get_province_name()
    province_code = query.get_province_code()

    return render_template('compare.html', col_disease=col_disease,
                           col_climate=col_climate,
                           province=zip(province_name, province_code)
                           )


# population response


@server.route("/popu_response/<id>/<id0>", methods=['GET', 'POST'])
def popu_response(id, id0):
    data0 = query.get_to_pop_province(id)
    data1 = query.get_to_pop_province(id0)
    feature_selected = query.get_population_response(data0, data1)

    return jsonify({'data': render_template('popu_response.html',
                                            feature_selected=feature_selected)})


# compare factor


@server.route('/factor')
def factor():
    # get columns disease
    disease_factor = [
        {'name': 'influenza'},
        {'name': 'dengue_fever'},
        {'name': 'diarrhoea'},
    ]

    columns = query.get_columns()
    province_name = query.get_province_name()
    province_code = query.get_province_code()
    return render_template('disease.html',
                           disease_factor=disease_factor,
                           columns=columns,
                           province=zip(province_name, province_code)

                           )


# show subplotly in here


@server.route('/subplotly', methods=['GET', 'POST'])
def subplotly():
    data = query.get_to_climate_disease()
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    sub = visual.compare_factor(data, disease, begin, end)
    return sub


# show subplotly year in here


@server.route('/subplotly_year', methods=['GET', 'POST'])
def subplotly_year():

    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    y_m = request.args['y_m']
    # get data
    data = query.get_to_climate_disease()
    sub = visual.compare_factor_year(data, disease, y_m, begin, end)
    return sub


# correlation


@server.route('/corr_factor', methods=['GET', 'POST'])
def corr_factor():
    data = query.get_to_climate_disease()
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    sub = visual.corr_factor(data, disease, begin, end)
    return sub


###########################comparation two province disease#############################


@server.route('/compare_province', methods=['GET', 'POST'])
def compare_province():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_province(province1)
    df2 = query.compare_province(province2)

    line = visual.compare_disease_year(df1, df2, disease, begin, end)
    return line


# compare province month disease


@server.route('/compare_pro_month', methods=['GET', 'POST'])
def compare_pro_month():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_month(province1)
    df2 = query.compare_pro_month(province2)

    line = visual.compare_disease_month(df1, df2, disease, begin, end)
    return line


# comparation two province climate


@server.route('/compare_pro_climate', methods=['GET', 'POST'])
def compare_pro_climate():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate(province1)
    df2 = query.compare_pro_climate(province2)

    line = visual.compare_climate_province(df1, df2, climate, begin, end)
    return line


# compare two province climate month


@server.route('/compare_pro_climate_month', methods=['GET', 'POST'])
def compare_pro_climate_month():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate_month(province1)
    df2 = query.compare_pro_climate_month(province2)

    line = visual.compare_climate_province_month(df1, df2, climate, begin, end)
    return line


# pie chart in here


@server.route('/pie_disease_year', methods=['GET', 'POST'])
def pie_disease_year():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_province(province1)
    df2 = query.compare_province(province2)

    pie = visual.pie_chart_disease(df1, df2, disease, begin, end)
    return pie


# climate chart in here


@server.route('/pie_climate_year', methods=['GET', 'POST'])
def pie_climate_month():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate(province1)
    df2 = query.compare_pro_climate(province2)

    pie = visual.pie_chart_climate(df1, df2, climate, begin, end)
    return pie


# compare disease


@server.route('/compare_disease', methods=['GET', 'POST'])
def compare_disease():
    disease = request.args['disease']
    begin = request.args['begin']
    end = request.args['end']
    data = query.get_to_disease()
    line = visual.compare_disease(data, disease, begin, end)
    return line


# compare 2 province date1


@server.route('/comp_date1_disease', methods=['GET', 'POST'])
def comp_date1_disease():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_month(province1)
    df2 = query.compare_pro_month(province2)
    line = visual.compare_disease_date1(df1, df2, disease, begin, end)
    return line


# line chart climate date1


@server.route('/comp_date1_climate', methods=['GET', 'POST'])
def comp_date1_climate():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate_month(province1)
    df2 = query.compare_pro_climate_month(province2)
    line = visual.compare_climate_date1(df1, df2, climate, begin, end)
    return line


#  linear chart disease


@server.route('/linear_comp_year', methods=['GET', 'POST'])
def linear_comp_year():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_province(province1)
    df2 = query.compare_province(province2)
    line = visual.linear_comp_year(df1, df2, disease, begin, end)
    return line


#  linear chart disease  month


@server.route('/linear_comp_month', methods=['GET', 'POST'])
def linear_comp_month():
    disease = request.args['disease']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_month(province1)
    df2 = query.compare_pro_month(province2)
    line = visual.linear_comp_month(df1, df2, disease, begin, end)
    return line


# linear climate year


@server.route('/linear_climate_year', methods=['GET', 'POST'])
def linear_climate_year():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate(province1)
    df2 = query.compare_pro_climate(province2)
    line = visual.linear_comp_year(df1, df2, climate, begin, end)
    return line


# linear climate month


@server.route('/linear_climate_month', methods=['GET', 'POST'])
def linear_climate_month():
    climate = request.args['climate']
    province1 = request.args['province1']
    province2 = request.args['province2']
    begin = request.args['begin']
    end = request.args['end']
    df1 = query.compare_pro_climate_month(province1)
    df2 = query.compare_pro_climate_month(province2)
    line = visual.linear_comp_month(df1, df2, climate, begin, end)
    return line
