import pathlib
import pandas as pd
import collections
import json
from app.database import *

conn = configure()
# add path
PATH = pathlib.Path(__file__).parent
DATA_PATH = PATH.joinpath("../datasets").resolve()


# split climate and disease
def listToString(s):
    str1 = " "
    for ele in s:
        str1 += ele
    return str1


class GetData:
    """docstring for ."""

    def __init__(self):
        query = '''
                    select DISTINCT  province_name,province_code from province_info
                '''
        # apply pandas
        df = pd.read_sql_query(query, conn)

        dict_code_pro = dict(zip(df['province_code'].astype(
            int).tolist(), df['province_name'].astype(str).tolist()))

        self.name_code_pro = collections.OrderedDict(
            sorted(dict_code_pro.items(), key=lambda t: t[0]))

    # get name province name

    def get_province_name(self):

        return self.name_code_pro.values()

    # get province  code

    def get_province_code(self):

        return self.name_code_pro.keys()

    # get coulmns name summary data

    def get_columns(self):
        name = pd.read_csv(DATA_PATH.joinpath("columns.csv"))
        return name

    # read file json

    def read_json_vn(self):
        with open(DATA_PATH.joinpath("vietnam.json"), 'r', encoding="utf8") as d:
            vn_json = json.load(d)

        return vn_json

    # read file csv disease + climate

    def get_to_disease_climate(self, code):
        # df = pd.read_csv(DATA_PATH.joinpath('disease.csv'), parse_dates=['date1'], index_col='date1')
        df = pd.read_csv(DATA_PATH.joinpath("disease_climate.csv"), parse_dates=['date1'], index_col='date1')
        df = df[(df['province_code'] == code) & (df['year'].between(1997, 2016))]
        return df

    # read file csv disease from 1997-2019
    def read_csv_disease(self, code):
        df = pd.read_csv(DATA_PATH.joinpath("disease.csv"), parse_dates=['date1'], index_col='date1')
        df = df[df['province_code'] == code]
        return df

    # read mean response disease summary data

    def get_disease_response(self):
        data = self.get_to_population()
        disease = self.get_to_disease()
        feature_selected = [{
            'population': round(data['population'].mean(), 0),
            'influenza': round(disease['influenza'].mean(), 0),
            'diarrhoea': round(disease['diarrhoea'].mean(), 0),
            'dengue': round(disease['dengue_fever'].mean(), 0)
        }]
        # get attribute columns
        return feature_selected

    # read mean response disease explore data

    def get_disease_response_exp(self, data, disease):

        feature_selected = [{
            'name': listToString(data['province_name'].unique()),
            'population': round(data['population'].sum(), 4),
            'influenza': round(disease['influenza'].sum(), 4),
            'diarrhoea': round(disease['diarrhoea'].sum(), 4),
            'dengue': round(disease['dengue_fever'].sum(), 4)

        }]
        # get attribute columns
        return feature_selected

    # read mean response climate explore data

    def get_climate_response_exp(self, climate):
        feature_selected = [{
            'vaporation': round(climate['vaporation'].sum(), 4),
            'rain': round(climate['rain'].sum(), 4),
            'max_rain': round(climate['max_rain'].sum(), 4),
            'raining_day': round(climate['raining_day'].sum(), 4),
            'temperature': round(climate['temperature'].sum(), 4),
            'temperature_max': round(climate['temperature_max'].sum(), 4),
            'temperature_min': round(climate['temperature_min'].sum(), 4),
            'temperature_absolute_min': round(climate['temperature_abs_min'].sum(), 4),
            'temperature_absolute_max': round(climate['temperature_abs_max'].sum(), 4),
            'sun_hour': round(climate['sun_hour'].sum(), 4),
            'humidity': round(climate['humidity'].sum(), 4),
            'humidity_min': round(climate['humidity_min'].sum(), 4),
        }]
        # get attribute columns
        return feature_selected

    # get population response
    def get_population_response(self, data0, data1):
        # get attribute columns
        feature_selected = [
            {
                'name0': listToString(data0['province_name'].unique()),
                'name1': listToString(data1['province_name'].unique()),
                'population0': round(data0['population'].sum(), 4),
                'population1': round(data1['population'].sum(), 4),
            }]
        return feature_selected

    ############get database disease########
    # get disease

    def get_to_disease(self):
        query = ''' select year,month,date1,fips,
                    province_name,influenza,influenza_death,
                    dengue_fever_death,dengue_fever,
                    diarrhoea,diarrhoea_death
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code'''
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])

        return data

    # get population data

    def get_to_population(self):
        query = '''select province_name,fips,month,
                    year,date1,population
                    from
                    population as a inner join province_info as b
                    on a.province_code = b.province_code
                '''
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        return data

    # get population and disease
    def get_to_disease_population(self):
        query1 = '''select fips as fips1,province_name,population,
                    year as year1,date1
                    from population as a inner join
                    province_info as b
                    on a.province_code = b.province_code
                '''
        population = pd.read_sql_query(query1, conn)

        query2 = ''' select fips,date1,year,influenza,dengue_fever,diarrhoea,
                    influenza_death,dengue_fever_death,diarrhoea_death
                    from disease as a
                    inner join
                    province_info as b
                    on a.province_code =b.province_code'''
        disease = pd.read_sql_query(query2, conn)
        frame = [population, disease]
        data = pd.concat(frame, join='inner', axis=1)
        return data

    # get disease mean year

    def get_to_disease_mean(self):
        data = self.get_to_disease()
        data = data[['year', 'influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').mean()
        return data

    # get disease max year
    def get_to_disease_max(self):
        data = self.get_to_disease()
        data = data[['year', 'influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').max()
        return data

    # get disease min year
    def get_to_disease_min(self):
        data = self.get_to_disease()
        data = data[['influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').min()
        return data

    ############ disease mean region ###############

    def get_to_disease_region_mean(self, region):
        if (region == 3):
            query = ''' select year,month,date1,fips,
                    province_name,influenza,influenza_death,
                    dengue_fever_death,dengue_fever,
                    diarrhoea,diarrhoea_death
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code'''
        else:
            query = '''select region,year,date1,a.province_code as code,
                        province_name,fips,influenza,
                        influenza_death,dengue_fever,dengue_fever_death,
                        diarrhoea,diarrhoea_death
                        from disease as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region = ''' + str(region)
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        data = data.resample('A').mean()
        return data

    # region disease max
    def get_to_disease_region_max(self, region):
        if (region == 3):
            self.get_to_disease_max()
        else:
            query = '''select region,year,date1,a.province_code as code,
                        province_name,fips,influenza,
                        influenza_death,dengue_fever,dengue_fever_death,
                        diarrhoea,diarrhoea_death
                        from disease as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region = ''' + str(region)
            data = pd.read_sql_query(
                query, conn, index_col='date1', parse_dates=['date1'])
            data = data.resample('A').max()
            return data

    # region disease min

    def get_to_disease_region_min(self, region):
        if (region == 3):
            self.get_to_disease_min()
        else:
            query = '''select region,year,date1,a.province_code as code,
                        province_name,fips,influenza,
                        influenza_death,dengue_fever,dengue_fever_death,
                        diarrhoea,diarrhoea_death
                        from disease as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region = ''' + str(region)
            data = pd.read_sql_query(
                query, conn, index_col='date1', parse_dates=['date1'])
            data = data.resample('A').min()
            return data

    # population region

    def get_to_population_region(self, region):
        query = '''
                select year,month,date1,province_name,fips,
                population from population as a
                inner join province_info as b
                on a.province_code = b.province_code
                where region =
                ''' + str(region)
        data = pd.read_sql_query(query, conn, index_col='date1', parse_dates=['date1'])
        return data

    # region disease + population

    def get_to_disease_population_region(self, region):
        if int(region) == 3:
            self.get_to_disease_population()
        else:
            query1 = '''select
                        fips as fips1,
                        province_name,
                        population,
                        region,
                        year as year1,date1
                        from population as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region =''' + str(region)

            population = pd.read_sql_query(query1, conn)

            query2 = ''' select fips,year as year2,influenza,dengue_fever,
                    diarrhoea,influenza_death,dengue_fever_death,
                    diarrhoea_death,date1
                    from disease as a
                    inner join province_info as b on a.province_code =b.province_code
                    where region = ''' + str(region)
            disease = pd.read_sql_query(query2, conn)
        frame = [population, disease]
        data = pd.concat(frame, join='inner', axis=1)
        return data

    # region disease
    def get_to_disease_region(self, region):
        if int(region) == 3:
            query = ''' select year,month,date1,fips,
                    province_name,influenza,influenza_death,
                    dengue_fever_death,dengue_fever,
                    diarrhoea,diarrhoea_death
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code'''
        else:
            query = '''select year,date1,region,a.province_code as code,
                        province_name,fips,influenza,
                        influenza_death,dengue_fever,dengue_fever_death,
                        diarrhoea,diarrhoea_death
                        from disease as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region = ''' + str(region)

        data = pd.read_sql_query(query, conn, index_col='date1', parse_dates=['date1'])

        return data

    #################get query province code#############
    # get population province code
    def get_to_pop_province(self, province):
        query = '''
                    select year,month,date1,province_name,population,date1
                    from population as a 
                    inner join province_info as b on
                    a.province_code=b.province_code
                     where  a.province_code =''' + str(province)
        data = pd.read_sql_query(query, conn)
        return data

    # get disease province
    def get_to_disease_province(self, province):
        query = '''select year,month,date1,influenza,influenza_death,
                    dengue_fever,dengue_fever_death,diarrhoea,diarrhoea_death
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code
                    where a.province_code =
                    ''' + str(province)

        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        return data

    # get disease mean province

    def get_to_disease_province_mean(self, province):
        data = self.get_to_disease_province(province)
        data = data[['influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').mean()
        return data

    # get disease max province
    def get_to_disease_province_max(self, province):
        data = self.get_to_disease_province(province)
        data = data[['influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').max()
        return data

    # get disease min province

    def get_to_disease_province_min(self, province):
        data = self.get_to_disease_province(province)
        data = data[['influenza', 'influenza_death', 'dengue_fever',
                     'dengue_fever_death', 'diarrhoea', 'diarrhoea_death']].resample('A').min()
        return data

    ######################climate######################
    # get climate

    def get_to_climate(self):
        query = '''select b.region,a.province_code as code,
                        b.province_name,b.fips,a.year,a.vaporation,
                        a.rain,a.max_rain,a.raining_day,
                        a.temperature,a.temperature_max,
                        temperature_abs_max,temperature_abs_min,
                        a.temperature_min,a.humidity,a.humidity_min,
                        a.sun_hour,date1,month
                        from climate as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                         '''
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        data['raining_day'] = pd.to_numeric(
            data['raining_day'], errors='coerce')
        return data

    # get to climate mean

    def get_to_climate_mean(self):

        data = self.get_to_climate()
        data = data.resample('A').mean()
        return data

    # get to climate max

    def get_to_climate_max(self):

        data = self.get_to_climate()
        data = data.resample('A').max()
        return data

    # get to climate min
    def get_to_climate_min(self):

        data = self.get_to_climate()
        data = data.resample('A').min()
        return data

    # concat climate+disease
    def get_to_climate_disease(self):
        query1 = ''' select year,month,influenza,
                            influenza_death,dengue_fever_death,dengue_fever,
                            diarrhoea,diarrhoea_death,province_code as code,date1
                            from disease'''
        query2 = '''select province_code,vaporation,
                                rain,max_rain,raining_day,
                                temperature,temperature_max,
                                temperature_min,temperature_abs_max,
                                temperature_abs_min,
                                humidity,humidity_min,sun_hour,date1
                                from climate
                                 '''
        df1 = pd.read_sql_query(query1, conn)
        df2 = pd.read_sql_query(query2, conn)
        df = pd.concat([df2, df1], axis=1, join='inner')
        df['raining_day'] = pd.to_numeric(df['raining_day'], errors='coerce')
        return df

        # return data

    # concat disease and climate
    def get_to_climate_disease_province(self, code):
        query1 = ''' select year,month,influenza,
                                    influenza_death,dengue_fever_death,dengue_fever,
                                    diarrhoea,diarrhoea_death,province_code as code,date1
                                    from disease where province_code=''' + str(code)
        query2 = '''select province_code,vaporation,
                                        rain,max_rain,raining_day,
                                        temperature,temperature_max,
                                        temperature_min,temperature_abs_max,
                                        temperature_abs_min,
                                        humidity,humidity_min,sun_hour,date1
                                        from climate where province_code =
                                         ''' + str(code)
        df1 = pd.read_sql_query(query1, conn)
        df2 = pd.read_sql_query(query2, conn)
        df = pd.concat([df2, df1], axis=1, join='inner')
        df['raining_day'] = pd.to_numeric(df['raining_day'], errors='coerce')
        return df

    ################### get province ##################

    def get_to_climate_province(self, province):
        query = '''select year,month,date1,vaporation,
                        rain,max_rain,raining_day,
                        temperature,temperature_max,
                        temperature_min,humidity,humidity_min,
                        sun_hour,temperature_abs_max,temperature_abs_min
                        from climate
                        where province_code =
                         ''' + str(province)
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        data['raining_day'] = pd.to_numeric(
            data['raining_day'], errors='coerce')
        return data

    # mean province climate

    def get_to_climate_mean_province(self, province):
        data = self.get_to_climate_province(province)
        data = data.resample('A').mean()
        return data

    # max province climate
    def get_to_climate_max_province(self, province):
        data = self.get_to_climate_province(province)
        data = data.resample('A').max()
        return data

    # min province climate

    def get_to_climate_min_province(self, province):
        data = self.get_to_climate_province(province)
        data = data.resample('A').min()
        return data

    # climate region
    def get_to_climate_region(self, region):
        if (int(region) == 3):
            data = self.get_to_climate()
        else:
            query = '''select region,a.province_code as code,
                        province_name,fips,vaporation,
                        rain,max_rain,raining_day,
                        temperature,temperature_max,
                        temperature_min,humidity,humidity_min,
                        sun_hour,temperature_abs_max,temperature_abs_min,
                        year,date1,month
                        from climate as a
                        inner join province_info as b
                        on a.province_code = b.province_code
                        where region = ''' + str(region)
        data = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=['date1'])
        data['raining_day'] = pd.to_numeric(
            data['raining_day'], errors='coerce')

        return data

    # climate region mean

    def get_to_climate_mean_region(self, region):
        data = self.get_to_climate_region(region)
        data = data.resample('A').mean()
        return data

    # climate region max
    def get_to_climate_max_region(self, region):
        data = self.get_to_climate_region(region)
        data = data.resample('A').max()
        return data

    # climate region min

    def get_to_climate_min_region(self, region):
        data = self.get_to_climate_region(region)
        data = data.resample('A').min()
        return data

    # climate + disease
    def get_to_climate_disease_region(self, region):
        climate = self.get_to_climate_region(region)
        disease = self.get_to_disease_region(region)
        frame = [climate, disease]
        data = pd.concat(frame, axis=1, join='inner')
        return data

    # compare province

    def compare_province(self, province):
        query = '''select year,month,influenza,influenza_death,
                    province_name as name,
                    dengue_fever,dengue_fever_death,diarrhoea,diarrhoea_death,
                    date1
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code
                    where a.province_code =
                    ''' + str(province)

        data = pd.read_sql_query(query, conn)
        data = data.groupby(['year', 'name']).mean().reset_index()
        return data

    # get name provice month

    def compare_pro_month(self, province):
        query = '''select year,month,influenza,influenza_death,
                    province_name as name,
                    dengue_fever,dengue_fever_death,diarrhoea,diarrhoea_death,
                    date1
                    from disease as a inner join province_info as b
                    on a.province_code = b.province_code
                    where a.province_code =
                    ''' + str(province)

        data = pd.read_sql_query(query, conn)
        return data

    # comparation 2 province

    def compare_pro_climate(self, province):
        query = '''select year,month,vaporation,rain,
                    b.province_name as name,
                    max_rain,raining_day,temperature,temperature_min,
                    temperature_max,humidity,humidity_min,sun_hour,
                    temperature_abs_max,temperature_abs_min,date1
                    from climate as a inner join province_info as b
                    on a.province_code = b.province_code
                    where a.province_code =
                    ''' + str(province)

        data = pd.read_sql_query(query, conn)
        data['raining_day'] = pd.to_numeric(
            data['raining_day'], errors='coerce')
        data = data.groupby(['year', 'name']).mean().reset_index()
        return data

    # compare 2 province month

    def compare_pro_climate_month(self, province):
        query = '''select year,month,vaporation,rain,
                    b.province_name as name,
                    max_rain,raining_day,temperature,temperature_min,
                    temperature_max,humidity,humidity_min,sun_hour,
                    temperature_abs_max,temperature_abs_min,date1
                    from climate as a inner join province_info as b
                    on a.province_code = b.province_code
                    where a.province_code =
                    ''' + str(province)

        data = pd.read_sql_query(query, conn)
        data['raining_day'] = pd.to_numeric(
            data['raining_day'], errors='coerce')
        return data

    # merge climate and disease
    def climate_disease_pre(self, province_code):
        query1 = ''' select year,month,influenza,
                    influenza_death,dengue_fever_death,dengue_fever,
                    diarrhoea,diarrhoea_death,province_code as code,date1
                    from disease where code=''' + str(province_code)
        query2 = '''select province_code,vaporation,
                        rain,max_rain,raining_day,
                        temperature,temperature_max,
                        temperature_min,temperature_abs_max,
                        temperature_abs_min,
                        humidity,humidity_min,sun_hour,date1
                        from climate where province_code =
                         ''' + str(province_code)
        df1 = pd.read_sql_query(query1, conn)
        df2 = pd.read_sql_query(query2, conn)
        df = pd.concat([df2, df1], axis=1, join='inner')
        df['raining_day'] = pd.to_numeric(df['raining_day'], errors='coerce')
        return df

    # date1 and resample

    def disease_province(self, province_code):
        query = '''select date1,influenza,influenza_death,
                    dengue_fever,dengue_fever_death,diarrhoea,diarrhoea_death,date1
                    from disease
                    where province_code =
                    ''' + str(province_code)
        disease = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=["date1"])
        disease = disease.resample('A').mean().reset_index()
        return disease

    # date1 and climate resample

    def climate_province(self, province_code):
        query = '''select date1,vaporation,
                        rain,max_rain,raining_day,
                        temperature,temperature_max,
                        temperature_min,humidity,humidity_min,
                        sun_hour,temperature_abs_max,temperature_abs_min
                        from climate
                        where province_code =
                         ''' + str(province_code)
        climate = pd.read_sql_query(
            query, conn, index_col='date1', parse_dates=["date1"])
        climate = climate.resample('A').mean().reset_index()
        return climate
