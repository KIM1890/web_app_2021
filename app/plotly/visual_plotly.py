import json
import plotly
import plotly.graph_objs as go
import pandas as pd
import calendar
import chart_studio.plotly as py
import numpy as np
from plotly.subplots import make_subplots
from statsmodels.tsa.stattools import pacf, acf
import plotly.express as px


class Visual:
    """docstring for"""

    ########################summary pages################################
    # process  don vi

    def title_climate(self, climate):
        dv = " "
        dict_climate = {
            "rain": "(mm)",
            "max_rain": "(mm)",
            "temperature": "(oC)",
            "temperature_min": "(oC)",
            "temperature_max": "(oC)",
            "temperature": "(oC)",
            "temperature_abs_min": "(oC)",
            "temperature_abs_max": "(oC)",
            "humidity": "(%)",
            "humidity_min": "(%)",
            "raining_day": "(day)",
            "vaporation": "(mm)",
            "sun_hour": "hour"
        }
        for keys, values in dict_climate.items():

            if str(climate) == keys:
                dv = values

        return dv

    # get string

    def listToString(self, s):
        str1 = " "
        for ele in s:
            str1 += ele
        return str1

    # replace ky tu

    def replaceList(self, a):
        arr = []
        for elemt in a:
            arr.append(elemt.replace('_', ' '))
        return arr

    # beetween year
    def between_year(self, df, begin, end):
        mask = ((df.index.year >= int(begin)) & (df.index.year <= int(end)))
        return df.loc[mask]

    ###################################################################

    # bar chart default in Viet Nam

    def bar_chart_disease(self, df):
        fig = go.Figure()
        fig.add_trace(go.Bar(x=df.index,
                             y=df['influenza'],
                             name='Influenza',
                             marker_color='rgb(55, 83, 109)',
                             showlegend=True
                             ))
        fig.add_trace(go.Bar(x=df.index,
                             y=df['dengue_fever'],
                             name='Dengue Fever',
                             marker_color='red',
                             showlegend=True
                             ))
        fig.add_trace(go.Bar(x=df.index,
                             y=df['diarrhoea'],
                             name='Diarrhoea',
                             marker_color='rgb(26, 118, 255)',
                             showlegend=True
                             ))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "line"],
                            label="Line Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),

            ],
            showlegend=True,
            xaxis_tickfont_size=14,
            xaxis=dict(
                title='Year',
                titlefont_size=16,
                tickfont_size=14,
            ),
            yaxis=dict(
                title='Yearly mean',
                titlefont_size=16,
                tickfont_size=14,
            ),
            template="plotly_white",
            margin={"r": 10, "t": 10, "l": 10, "b": 10},
            barmode='group',
            bargap=0.15,
            bargroupgap=0.1
        )
        BarJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return BarJson

    # bar chart death

    def bar_chart_disease_death(self, df):
        fig = go.Figure()
        fig.add_trace(go.Bar(x=df.index,
                             y=df['influenza_death'],
                             name='Influenza Death',
                             marker_color='rgb(55, 83, 109)',
                             showlegend=True
                             ))
        fig.add_trace(go.Bar(x=df.index,
                             y=df['dengue_fever_death'],
                             name='Dengue Death',
                             marker_color='red',
                             showlegend=True
                             ))
        fig.add_trace(go.Bar(x=df.index,
                             y=df['diarrhoea_death'],
                             name='Diarrhoea Death',
                             marker_color='rgb(26, 118, 255)',
                             showlegend=True
                             ))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "line"],
                            label="Line Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_tickfont_size=14,
            legend=dict(
                yanchor="top",
                y=1.0,
                xanchor="right",
                x=1.02
            ),
            xaxis=dict(
                title='Year',
                titlefont_size=16,
                tickfont_size=14,
            ),
            yaxis=dict(
                title='Yearly mean',
                titlefont_size=16,
                tickfont_size=14,
            ),
            template="plotly_white",
            margin={"r": 10, "t": 10, "l": 10, "b": 10},
            barmode='group',
            bargap=0.15,  # gap between bars of adjacent location coordinates.
            # gap between bars of the same location coordinate.
            bargroupgap=0.1
        )
        BarJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return BarJson

    # end bar chart
    # box chart climate and disease

    def box_chart_feature(self, df, feature, begin, end):
        df = df[df['year'].between(int(begin), int(end))]
        df = df.resample('A').mean()
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df.index.year,
            y=df[str(feature)],
            mode='lines',
            line_color="rgb(189,189,189)"
        ))
        dv = self.title_climate(str(feature))
        fig.update_layout(
            xaxis_title='Year', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(feature.replace('_', ' ')).title()) + ' yearly mean ' + str(dv))
        BoxJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return BoxJson

    # end box chart
    # heatmap disease Viet Nam

    def heatmap_vn(self, df, vn_json, disease, begin, end):
        df = self.between_year(df, begin, end)
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        # get data
        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'], z=mean[str(disease)],
                                            colorscale="Viridis", hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0
                                            ))
        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4,
                                         "lon": 107.683333333333})

        VNJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return VNJson

    # heatmap population in Viet Nam

    def heatmap_population(self, df, vn_json, begin, end):
        # group by
        df = self.between_year(df, begin, end)
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        # map in here
        fig = go.Figure(go.Choroplethmapbox(
            geojson=vn_json, locations=mean['fips'], z=mean['population'],
            colorscale="Viridis", hovertext=mean['province_name'],
            marker_opacity=0.5, marker_line_width=0))

        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4, "lon": 107.683333333333})

        PopupJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return PopupJson

    # line chart population

    def line_chart_population(self, df, begin, end):

        df = self.between_year_mean(df, begin, end, 'A')
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df.index,
            y=df['population'],
            mode='lines+markers', name="Population",
            marker_symbol='triangle-up', line_color="red",
            showlegend=True
        ))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle",
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Year', yaxis_title='Population yearly mean',
            template="plotly_white", margin={"r": 10, "t": 10, "l": 10, "b": 10}
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # heatmap ratio disease/population

    def heatmap_ratio(self, df, vn_json, disease, begin, end):
        # group by
        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        # map in here
        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'],
                                            z=(mean[str(disease)] / (100000)),
                                            colorscale="Viridis",
                                            hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0))

        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4, "lon": 107.683333333333})

        RatioJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return RatioJson

    # line chart ratio

    def line_chart_ratio(self, df, disease, begin, end):
        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['year']).mean().reset_index()
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=mean.index,
            y=(mean[str(disease)] / 100000),
            mode='lines+markers', marker_symbol='triangle-up', line_color="red"))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Year', yaxis_title='Incidence rate per 100000',
            template="plotly_white", margin={"r": 10, "t": 10, "l": 10, "b": 10}
        )

        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # heatmap climate

    def heatmap_climate(self, df, vn_json, climate, begin, end):
        df = self.between_year(df, begin, end)
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'], z=mean[str(climate)],
                                            colorscale="Viridis", hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0))
        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4,
                                         "lon": 107.683333333333},
                          )
        # Add dropdown

        VNJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return VNJson

    # line chart region population tung vung mien
    def chart_region_population(self, df, begin, end):
        fig = go.Figure()
        df = self.between_year_mean(df, begin, end)
        fig.add_trace(go.Scatter(
            x=df['year'],
            y=df['population'],
            line_color="red",
            mode='lines+markers', marker_symbol='triangle-up'))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Year', template="plotly_white", yaxis_title=('Population yearly mean'),
            margin={"r": 20, "t": 20, "l": 20, "b": 20}
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # line chart region ratio tung vung mien

    def chart_region_ratio(self, df, disease, begin, end):
        fig = go.Figure()
        df = self.between_year_mean(df, begin, end)
        fig.add_trace(go.Scatter(
            x=df['year1'],
            y=(df[str(disease)] / 100000),
            line_color="red",
            mode='lines+markers', marker_symbol='triangle-up'))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Year', template="plotly_white", yaxis_title=(str(
                disease) + '/' + 'Population '), margin={"r": 20, "t": 20, "l": 20, "b": 20}
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return linesJSON

    # heatmap disease

    def heatmap_vn_region(self, df, vn_json, disease, begin, end):

        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'], z=mean[str(disease)],
                                            colorscale="Viridis", hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0
                                            ))
        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4,
                                         "lon": 107.683333333333})

        VNJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return VNJson

    # heatmap population

    def heatmap_pop_region(self, df, vn_json, begin, end):
        # group by
        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        # map in here
        fig = go.Figure(go.Choroplethmapbox(
            geojson=vn_json, locations=mean['fips'], z=mean['population'],
            colorscale="Viridis", hovertext=mean['province_name'],
            marker_opacity=0.5, marker_line_width=0))

        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4, "lon": 107.683333333333})

        PopuJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return PopuJson

    # heatmap radio

    def heatmap_radio_region(self, df, vn_json, disease, begin, end):
        # group by
        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()
        # map in here
        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'],
                                            z=(mean[str(disease)] / (100000)),
                                            colorscale="Viridis",
                                            hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0))
        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4, "lon": 107.683333333333})

        RatioJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return RatioJson

    # heatmap climate region

    def heatmap_climate_region(self, df, vn_json, climate, begin, end):

        df = df[df['year'].between(int(begin), int(end))]
        mean = df.groupby(['fips', 'province_name']).mean().reset_index()

        fig = go.Figure(go.Choroplethmapbox(geojson=vn_json, locations=mean['fips'], z=mean[str(climate)],
                                            colorscale="Viridis", hovertext=mean['province_name'],
                                            marker_opacity=0.5, marker_line_width=0))
        fig.update_layout(mapbox_style="carto-positron", mapbox_zoom=4.0,
                          margin={"r": 20, "t": 20, "l": 20, "b": 20},
                          mapbox_center={"lat": 16.4,
                                         "lon": 107.683333333333},
                          title_text="Number of case" + " " + str(climate) + str(begin) + "-" + str(end))

        VNJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return VNJson

    ##############################Explorer pages data###############################
    # error band

    def stat_disease_year(self, mean, max_, min_, disease, begin, end):
        fig = go.Figure()

        mean = self.between_year(mean, begin, end)
        max_ = self.between_year(max_, begin, end)
        min_ = self.between_year(min_, begin, end)

        fig = go.Figure([
            go.Scatter(
                name=str(disease),
                x=mean.index.year,
                y=mean[str(disease)],
                mode='lines',
                line=dict(color='rgb(31, 119, 180)'),
                showlegend=True
            ),
            go.Scatter(
                name='Max ' + str(disease),
                x=max_.index.year,
                y=max_[str(disease)],
                mode='lines',
                marker=dict(color="#444"),
                line=dict(width=0),
                # fill='tonexty',
                showlegend=False
            ),
            go.Scatter(
                name='Min ' + str(disease),
                x=min_.index.year,
                y=min_[str(disease)],
                marker=dict(color="#444"),
                line=dict(width=0),
                mode='lines',
                fillcolor='rgba(68, 68, 68, 0.3)',
                fill='tonexty',
                showlegend=False
            )
        ])

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            # showlegend=True,
            xaxis_title='Year', template="plotly_white",
            width=450,
            margin=dict(l=50, r=50, b=50, t=50, pad=4),
            yaxis_title=str(disease.replace('_', ' ')).title() + " yearly mean"
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # month disease error band

    def stat_disease_month(self, df, disease, begin, end):
        fig = go.Figure()
        df = df[df['year'].between(int(begin), int(end))]
        df = df[df[str(disease)] != 0]
        # get mean
        mean = df.groupby('month').mean().reset_index()
        max_ = df.groupby('month').max().reset_index()
        min_ = df.groupby('month').min().reset_index()

        # convert month
        mean['month'] = mean['month'].apply(lambda x: calendar.month_abbr[x])
        max_['month'] = max_['month'].apply(lambda x: calendar.month_abbr[x])
        min_['month'] = min_['month'].apply(lambda x: calendar.month_abbr[x])
        fig = go.Figure([
            go.Scatter(
                name=str(disease),
                x=mean['month'],
                y=mean[str(disease)],
                mode='lines',
                line=dict(color='rgb(31, 119, 180)'),
                showlegend=True
            ),
            go.Scatter(
                name='Max ' + str(disease),
                x=max_['month'],
                y=max_[str(disease)],
                mode='lines',
                marker=dict(color="#444"),
                line=dict(width=0),
                showlegend=False
            ),
            go.Scatter(
                name='Min ' + str(disease),
                x=min_['month'],
                y=min_[str(disease)],
                marker=dict(color="#444"),
                line=dict(width=0),
                mode='lines',
                fillcolor='rgba(68, 68, 68, 0.3)',
                fill='tonexty',
                showlegend=False
            )
        ])

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            # showlegend=True,
            xaxis_title='Month', template="plotly_white",
            width=450,
            margin=dict(l=50, r=50, b=50, t=50, pad=4),
            yaxis_title=str(disease.replace('_', ' ')).title() + " monthly mean"
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # year climate

    def stat_climate_year(self, mean, max_, min_, climate, begin, end):

        fig = go.Figure()
        mean = mean[mean['year'].between(int(begin), int(end))]
        max_ = max_[max_['year'].between(int(begin), int(end))]
        min_ = min_[min_['year'].between(int(begin), int(end))]

        fig = go.Figure([
            go.Scatter(
                name=str(climate),
                x=mean['year'],
                y=mean[str(climate)],
                mode='lines',
                line=dict(color='rgb(31, 119, 180)'),
                showlegend=True
            ),
            go.Scatter(
                name='Max ' + str(climate),
                x=max_['year'],
                y=max_[str(climate)],
                mode='lines',
                marker=dict(color="#444"),
                line=dict(width=0),
                showlegend=False
            ),
            go.Scatter(
                name='Min ' + str(climate),
                x=min_['year'],
                y=min_[str(climate)],
                marker=dict(color="#444"),
                line=dict(width=0),
                mode='lines',
                fillcolor='rgba(68, 68, 68, 0.3)',
                fill='tonexty',
                showlegend=False
            )
        ])
        dv = self.title_climate(str(climate))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            # showlegend=True,
            xaxis_title='Year', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' yearly ' +' '+str(dv)
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # month climate

    def stat_climate_month(self, df, climate, begin, end):
        fig = go.Figure()
        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        mean = df.groupby('month').mean().reset_index()
        max_ = df.groupby('month').max().reset_index()
        min_ = df.groupby('month').min().reset_index()

        # convert month
        mean['month'] = mean['month'].apply(lambda x: calendar.month_abbr[x])
        max_['month'] = max_['month'].apply(lambda x: calendar.month_abbr[x])
        min_['month'] = min_['month'].apply(lambda x: calendar.month_abbr[x])
        fig = go.Figure([
            go.Scatter(
                name=str(climate),
                x=mean['month'],
                y=mean[str(climate)],
                mode='lines',
                line=dict(color='rgb(31, 119, 180)'),
                showlegend=True
            ),
            go.Scatter(
                name='Max ' + str(climate),
                x=max_['month'],
                y=max_[str(climate)],
                mode='lines',
                marker=dict(color="#444"),
                line=dict(width=0),
                showlegend=False
            ),
            go.Scatter(
                name='Min ' + str(climate),
                x=min_['month'],
                y=min_[str(climate)],
                marker=dict(color="#444"),
                line=dict(width=0),
                mode='lines',
                fillcolor='rgba(68, 68, 68, 0.3)',
                fill='tonexty',
                showlegend=False
            )
        ])

        dv = self.title_climate(str(climate))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Month', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' yearly   ' + str(dv)
        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # seasonal analyst

    def seasonal_disease_exp(self, df, disease, begin, end):
        fig = go.Figure()
        df = df.groupby(['month', 'year']).mean().reset_index()
        df['month'] = df['month'].apply(lambda x: calendar.month_abbr[x])
        year = [y for y in range(int(begin), int(end) + 1)]
        for y in year:
            mean = df.loc[(df['year'] == int(y))]
            fig.add_trace(go.Scatter(x=mean['month'], y=mean[str(disease)],
                                     mode='lines',
                                     marker_symbol='triangle-left-open',
                                     marker=dict(size=10),
                                     name=str(y),
                                     ))
        fig.update_layout(xaxis_title='Month', template="plotly_white",
                          margin=dict(l=20, r=20, t=20, b=20),
                          yaxis_title=(str(disease.replace('_', ' ')).title() + ' monthly mean'))

        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # seasonal climate
    def seasonal_climate_exp(self, df, climate, begin, end):
        fig = go.Figure()
        df = df.groupby(['month', 'year']).mean().reset_index()
        df['month'] = df['month'].apply(lambda x: calendar.month_abbr[x])

        year = [y for y in range(int(begin), int(end) + 1)]
        for y in year:
            mean = df.loc[(df['year'] == int(y))]
            fig.add_trace(go.Scatter(x=mean['month'], y=mean[str(climate)],
                                     mode='lines',
                                     marker_symbol='triangle-left-open',
                                     marker=dict(size=10),
                                     name=str(y),
                                     ))

        dv = self.title_climate(str(climate))

        fig.update_layout(xaxis_title='Month', template="plotly_white",
                          margin=dict(l=30, r=30, b=30, t=30),
                          yaxis_title=(str(climate.replace('_', ' ')).title()) + ' monthly mean' + str(dv))

        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # correlation disease

    def corr_disease_exp(self, df, feature, begin, end):
        fig = go.Figure()
        df = df[df['year'].between(int(begin), int(end))]

        fig.add_trace(
            go.Heatmap(
                z=df[feature].corr(),
                x=self.replaceList(df[feature].columns.values),
                y=self.replaceList(df[feature].columns.values)),
        )
        fig.update_layout(height=450, template="plotly_white",
                          margin=dict(l=20, r=20, t=20, b=20))
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # between_year()
    def between_year_mean(self, df, begin, end, step):
        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        df = df.resample(step).mean()
        return df

    # date1 disease province

    def line_date1_exp(self, df, disease, begin, end):
        df = self.between_year_mean(df, begin, end, 'A')
        # Create figure with secondary y-axis
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df.index, y=df[str(disease)],
                                 mode='lines',
                                 line=dict(color='rgb(31, 119, 180)'),
                                 name=(str(disease.replace('_', ' '))).title()
                                 ))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            template="plotly_white",
            xaxis_title='Date',
            yaxis_title=(str(disease).title()).replace(
                '_', ' ') + ' monthly mean'
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # date1 in climate

    def line_date1_climate_exp(self, df, climate, begin, end):
        df = self.between_year_mean(df, begin, end, 'A')

        # Create figure with secondary y-axis
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df.index, y=df[str(climate)],
                                 mode='lines',
                                 line=dict(color='rgb(31, 119, 180)'),
                                 name=(str(climate.replace('_', ' ')).title())
                                 ))
        dv = self.title_climate(str(climate))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            template="plotly_white",
            xaxis_title='Date', margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' monthly mean' + str(dv),
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # region date1  disease

    def region_date1_exp(self, df, disease, begin, end):
        df = self.between_year_mean(df, begin, end, 'A')

        # Create figure with secondary y-axis
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df.index, y=df[str(disease)],
                                 mode='lines',
                                 line=dict(color='rgb(31, 119, 180)'),
                                 name=str(disease)))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            template="plotly_white",
            xaxis_title='Date1',
            yaxis_title=(str(disease.replace('_', ' ')
                             ).title() + ' monthly mean'),
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # region climate data 1

    def region_date1_climate_exp(self, df, climate, begin, end):
        df = self.between_year_mean(df, begin, end, 'A')

        # Create figure with secondary y-axis
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df.index, y=df[str(climate)],
                                 mode='lines',
                                 line=dict(color='rgb(31, 119, 180)'),
                                 name=str(climate)))
        dv = self.title_climate(str(climate))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            template="plotly_white",
            xaxis_title='Date', margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' monthly mean' + str(dv)
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    ###############################region disease###############################

    # lag correlation

    def lag_correlation(self, df, feature, begin, end):

        # df = df[df['year'].between(int(begin), int(end))]
        df = self.between_year(df, begin, end)
        saw_auto = []
        saw_pauto = pacf(df[str(feature)], nlags=11)
        fig = go.Figure()
        # lag calculation
        for i in range(0, 13):
            saw_auto.append(df[str(feature)].autocorr(lag=i))
        lag = list([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])

        fig.add_trace(go.Scatter(x=lag, y=saw_auto, name="ACF", mode='lines'))
        fig.add_trace(go.Scatter(x=lag, y=saw_pauto, name="PACF",
                                 mode='lines', line=dict(color='rgb(255, 102, 0)')))

        fig.update_layout(xaxis_title='Lag (month)', template="plotly_white",
                          yaxis_title='ACF/PACF meanly mean',
                          margin=dict(l=20, r=20, t=20, b=20))
        lagJson = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return lagJson

    # seasonal region climate

    def region_season_climate(self, df, climate, begin, end):
        fig = go.Figure()
        df = df.groupby(['month', 'year']).mean().reset_index()
        df['month'] = df['month'].apply(lambda x: calendar.month_abbr[x])
        year = [y for y in range(int(begin), int(end) + 1)]
        for y in year:
            mean = df.loc[(df['year'] == int(y))]
            fig.add_trace(go.Scatter(x=mean['month'], y=mean[str(climate)],
                                     mode='lines',
                                     marker_symbol='triangle-left-open',
                                     marker=dict(size=10),
                                     name=str(y),
                                     ))
        dv = self.title_climate(str(climate))

        fig.update_layout(
            xaxis_title='Year', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) + ' ' + str(dv)

        )
        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    # seasonal region disease

    def region_season_disease(self, df, disease, begin, end):
        fig = go.Figure()
        df = df.groupby(['month', 'year']).mean().reset_index()
        df['month'] = df['month'].apply(lambda x: calendar.month_abbr[x])
        year = [y for y in range(int(begin), int(end) + 1)]
        for y in year:
            mean = df.loc[(df['year'] == int(y))]
            fig.add_trace(go.Scatter(x=mean['month'], y=mean[str(disease)],
                                     mode='lines',
                                     marker_symbol='triangle-left-open',
                                     marker=dict(size=10),
                                     name=str(y),
                                     ))
        fig.update_layout(xaxis_title='Month', template="plotly_white",
                          # width=450, height=300,
                          margin=dict(l=20, r=20, t=20, b=20),
                          yaxis_title=str(disease.replace('_', ' ')))

        linesJSON = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

        return linesJSON

    ###########################compare factor##########################

    def compare_factor(self, df, feature, begin, end):
        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        df = df.groupby('month').mean().reset_index()
        df['month'] = df['month'].apply(lambda x: calendar.month_abbr[x])

        fig = make_subplots(rows=3, cols=2, start_cell="bottom-left",
                            specs=[[{"secondary_y": True}, {"secondary_y": True}],
                                   [{"secondary_y": True}, {
                                       "secondary_y": True}],
                                   [{"secondary_y": True}, {"secondary_y": True}]],
                            subplot_titles=(
                                '<b> Monthly mean ' + str(feature) + ' and temperature' + '<br>' + str(
                                    begin) + '-' + str(
                                    end) + '</b>',
                                '<b> Monthly mean ' +
                                str(feature) + ' and rain' + '<br>' +
                                str(begin) + '-' + str(end) + '</b>',
                                '<b> Monthly mean incidence rates of ' +
                                str(feature) + '<br>' +
                                str(begin) + '-' + str(end) + '</b>',
                                '<b> Monthly mean ' +
                                str(feature) + ' and humidity' + '<br>' +
                                str(begin) + '-' + str(end) + '</b>',
                                # title in here
                                '<b> Monthly mean ' + \
                                str(feature) + ' and vaporation' + \
                                '<br>' + str(begin) + '-' + \
                                str(end) + '</b>',
                                '<b> Monthly mean ' + str(feature) + ' and sun hour' + '<br>' + str(begin) + '-' + str(
                                    end) + '</b>'))
        # Create figure with secondary y-axis

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color="red", marker_symbol='triangle-up'),
                      row=2, col=1, secondary_y=False)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature) + '_death'],
                                 name=(str(feature).replace('_', ' ') + '_death').title(), line_color="blue",
                                 marker_symbol='x'),
                      row=2, col=1, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df['temperature'], name='Temperature', mode='lines+markers',
                                 marker_symbol='x'),
                      row=1, col=1, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color="red", marker_symbol='triangle-up'),
                      row=1, col=1, secondary_y=False)
        fig.add_trace(go.Scatter(x=df['month'], y=df['rain'], name='Rain', marker_symbol='star'),
                      row=1, col=2, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=1, col=2, secondary_y=False)

        fig.add_trace(go.Scatter(x=df['month'], y=df['humidity'], name='Humidity', line_color='green',
                                 marker_symbol='asterisk-open'),
                      row=2, col=2, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=2, col=2, secondary_y=False)
        # vaporation
        fig.add_trace(go.Scatter(x=df['month'], y=df['vaporation'], name='Vaporation', line_color='black',
                                 marker_symbol='asterisk-open'),
                      row=3, col=1, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=3, col=1, secondary_y=False)
        # sun hour
        fig.add_trace(go.Scatter(x=df['month'], y=df['sun_hour'], name='Sun hour', line_color='orange',
                                 marker_symbol='asterisk-open'),
                      row=3, col=2, secondary_y=True)

        fig.add_trace(go.Scatter(x=df['month'], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=3, col=2, secondary_y=False)
        fig.update_xaxes(title_text="Month")
        # y title
        # disease
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=2,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text=(str(feature) + '  Death').title() +
                                    '  mean', row=2, col=1, secondary_y=True)
        # disease and humidity
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=2,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Humidity(%)  mean',
                         row=2, col=2, secondary_y=True)
        # disease and Temperature
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=1,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text='Temperature(oC)  mean',
                         row=1, col=1, secondary_y=True)
        # disease and Rain
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=1,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Rain(mm)  mean',
                         row=1, col=2, secondary_y=True)
        # disease and vaporation
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=3,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text='Vaporation(mm)  mean',
                         row=3, col=1, secondary_y=True)
        # sun hour
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=3,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Sun hour(hour)  mean',
                         row=3, col=2, secondary_y=True)
        fig.update_layout(height=700, showlegend=True, template="plotly_white", margin=dict(l=30, r=10)
                          )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compare factor year

    def compare_factor_year(self, df, feature, y_m, begin, end):
        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        df = df.groupby(str(y_m)).mean().reset_index()
        # show chart
        fig = make_subplots(rows=3, cols=2, start_cell="bottom-left",
                            specs=[[{"secondary_y": True}, {"secondary_y": True}],
                                   [{"secondary_y": True}, {
                                       "secondary_y": True}],
                                   [{"secondary_y": True}, {"secondary_y": True}]],
                            subplot_titles=('<b>' + str(y_m).title() + 'ly mean' + str(feature).replace('_',
                                                                                                        ' ') + ' and temperature' + '<br>' + str(
                                begin) + '-' + str(end) + '</b>',
                                            '<b>' + str(y_m).title() + 'ly mean ' +
                                            str(feature).replace('_', ' ') + ' and rain' + '<br>' +
                                            str(begin) + '-' + str(end) + '</b>',
                                            '<b> Incidence rates of ' +
                                            str(feature).replace('_', ' ') + 'Yearly mean <br>' +
                                            str(begin) + '-' + str(end) + '</b>',
                                            '<b>' + str(y_m).title() + 'ly mean ' +
                                            str(feature).replace('_', ' ') + ' and humidity' + '<br>' +
                                            str(begin) + '-' + str(end) + '</b>',
                                            '<b>' + str(y_m).title() + 'ly mean ' + str(feature).replace('_',
                                                                                                         ' ') + ' and vaporation' +
                                            '<br>' + str(begin) + '-' +
                                            str(end) + '</b>',
                                            '<b>' + str(y_m).title() + 'ly mean ' +
                                            str(feature).replace('_', ' ') + ' and sun hour' + '<br>' +
                                            str(begin) + '-' + str(end) + '</b>'
                                            ))
        # Create figure with secondary y-axis

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color="red",
                                 marker_symbol='triangle-up'),
                      row=2, col=1, secondary_y=False)

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df[str(feature) + '_death'],
                                 name=(str(feature) + '_death').title(), line_color="blue", marker_symbol='x'),
                      row=2, col=1, secondary_y=True)

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df['temperature'], name='Temperature'),
                      row=1, col=1, secondary_y=True)

        fig.add_trace(
            go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=str(feature).replace('_', ' '), line_color="red",
                       marker_symbol='triangle-up'),
            row=1, col=1, secondary_y=False)

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df['rain'], name='Rain', marker_symbol='asterisk-open'),
                      row=1, col=2, secondary_y=True)

        fig.add_trace(
            go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=str(feature).replace('_', ' '), line_color='red',
                       marker_symbol='triangle-up'),
            row=1, col=2, secondary_y=False)

        fig.add_trace(
            go.Scatter(x=df[str(y_m)], y=df['humidity'], name='Humidity', line_color='green', marker_symbol='star'),
            row=2, col=2, secondary_y=True)

        fig.add_trace(
            go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=str(feature).replace('_', ' '), line_color='red',
                       marker_symbol='triangle-up'),
            row=2, col=2, secondary_y=False)
        # vaporation
        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df['vaporation'], name='Vaporation', line_color='black',
                                 marker_symbol='asterisk-open'),
                      row=3, col=1, secondary_y=True)

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=3, col=1, secondary_y=False)
        # sun hour
        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df['sun_hour'], name='Sun hour', line_color='orange',
                                 marker_symbol='asterisk-open'),
                      row=3, col=2, secondary_y=True)

        fig.add_trace(go.Scatter(x=df[str(y_m)], y=df[str(feature)], name=(str(feature).replace('_', ' ')).title(),
                                 line_color='red', marker_symbol='triangle-up'),
                      row=3, col=2, secondary_y=False)
        # xtitle
        fig.update_xaxes(title_text=str(y_m))
        # y title
        # disease
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=2,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title() + '  Death mean',
                         row=2, col=1, secondary_y=True)
        # disease and humidity
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=2,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Humidity(%)  mean',
                         row=2, col=2, secondary_y=True)
        # disease and Temperature
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=1,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text='Temperature(oC)  mean',
                         row=1, col=1, secondary_y=True)
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=3,
                         col=1, secondary_y=False)
        fig.update_yaxes(title_text='Vaporation(mm)  mean',
                         row=3, col=1, secondary_y=True)
        # sun hour
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=3,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Sun hour(hour)  mean',
                         row=3, col=2, secondary_y=True)
        # disease and Rain
        fig.update_yaxes(title_text=(str(feature).replace('_', ' ')).title(), row=1,
                         col=2, secondary_y=False)
        fig.update_yaxes(title_text='Rain(mm)  mean',
                         row=1, col=2, secondary_y=True)
        fig.update_layout(height=700, showlegend=True, template="plotly_white", margin=dict(l=30, r=10)
                          )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # correlation

    def corr_factor(self, df, feature, begin, end):
        fig = make_subplots(rows=1, cols=2, subplot_titles=(
            "<b>Yearly mean" + ' ' +
            str(feature) + 'Viet Nam' + '<br>' + str(begin) + '-' + str(end),
            "<b>Yearly mean" + ' ' + str(feature) + '  Death  Viet Nam <br>' + str(begin) + '-' + str(end)))
        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        df = df.groupby('month').mean().reset_index()
        corr1 = df[[str(feature), 'rain', 'vaporation',
                    'humidity', 'sun_hour', 'raining_day']].corr()
        corr2 = df[[(str(feature) + '_death'), 'temperature', 'rain',
                    'vaporation', 'humidity', 'sun_hour', 'raining_day']].corr()
        fig.add_trace(
            go.Heatmap(
                z=corr1,
                x=self.replaceList(corr1.columns.values),
                y=self.replaceList(corr1.columns.values),
                hoverongaps=False),
            row=1, col=1)

        fig.add_trace(
            go.Heatmap(
                z=corr2,
                x=self.replaceList(corr2.columns.values),
                y=self.replaceList(corr2.columns.values),
                hoverongaps=False),
            row=1, col=2
        )
        fig.update_layout(height=600, template="plotly_white")
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    #########################compare two province########################
    # compare date1 disease 2 province

    def compare_disease_date1(self, df1, df2, disease, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get
        df1 = df1.groupby(['date1', 'name']).mean().reset_index()
        df2 = df2.groupby(['date1', 'name']).mean().reset_index()
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df1['date1'], y=df1[str(disease)],
                                 name=str(df1['name'][0]),
                                 line=dict(color='rgb(31, 119, 180)'),
                                 mode='lines+markers', marker_symbol='triangle-up'
                                 ))
        fig.add_trace(go.Scatter(x=df2['date1'], y=df2[str(disease)],
                                 name=str(df2['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='star'))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            template="plotly_white",
            margin=dict(l=20, r=20, t=20, b=20),
            xaxis_title='Date',
            yaxis_title=(str(disease).replace('_', ' ')
                         ).title() + ' monthly mean'
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compare date1 climate 2 province

    def compare_climate_date1(self, df1, df2, climate, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get mean
        df1 = df1.groupby(['date1', 'name']).mean().reset_index()
        df2 = df2.groupby(['date1', 'name']).mean().reset_index()
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df1['date1'], y=df1[str(climate)],
                                 name=str(df1['name'][0]),
                                 line=dict(color='rgb(31, 119, 180)'),
                                 mode='lines+markers', marker_symbol='triangle-up'
                                 ))
        fig.add_trace(go.Scatter(x=df2['date1'], y=df2[str(climate)],
                                 name=str(df2['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='star'
                                 ))
        dv = self.title_climate(str(climate))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            showlegend=True,
            xaxis_title='Date', template="plotly_white", margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' montly mean' + str(dv)
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compareation 2 province

    def compare_disease_year(self, df1, df2, disease, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get mean
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df1['year'], y=df1[str(disease)],
                                 name=str(df1['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='triangle-up', showlegend=True
                                 ))
        fig.add_trace(go.Scatter(x=df2['year'], y=df2[str(disease)],
                                 name=str(df2['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='star', showlegend=True
                                 ))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            template="plotly_white",
            margin=dict(l=20, r=20, t=20, b=20),
            xaxis_title='Year',
            yaxis_title=(str(disease).replace('_', ' ')
                         ).title() + ' yearly mean'
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compare province month

    def compare_disease_month(self, df1, df2, disease, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get mean
        mean1 = df1.groupby(['month', 'name']).mean().reset_index()
        mean2 = df2.groupby(['month', 'name']).mean().reset_index()
        mean1['month'] = mean1['month'].apply(lambda x: calendar.month_abbr[x])
        mean2['month'] = mean2['month'].apply(lambda x: calendar.month_abbr[x])
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=mean1['month'], y=mean1[str(disease)],
                                 name=str(mean1['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='triangle-up'
                                 ))
        fig.add_trace(go.Scatter(x=mean2['month'], y=mean2[str(disease)],
                                 name=str(mean2['name'][0]),
                                 mode='lines+markers',
                                 marker_symbol='star'
                                 ))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            template="plotly_white",
            margin=dict(l=20, r=20, t=20, b=20),
            showlegend=True,
            xaxis_title='Month',
            yaxis_title=(str(disease).replace('_', ' ')).title() + ' monthly mean')
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compare disease line chart

    def compare_disease(self, df, disease, begin, end):

        df = df[df['year'].between(int(begin), int(end))]
        # get mean
        df = df.groupby(['date1']).mean().reset_index()

        # Create figure with secondary y-axis
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(go.Scatter(x=df['date1'], y=df[str(disease)],
                                 mode='lines',
                                 name=str(disease), showlegend=True), secondary_y=False, )
        fig.add_trace(go.Scatter(x=df['date1'], y=df[str(disease) + '_death'],
                                 mode='lines',
                                 name=str(disease) + ' death', showlegend=True), secondary_y=True, )

        fig.update_xaxes(title_text="Year")
        fig.update_yaxes(title_text=((str(disease).replace('_', ' ')).title() +
                                     ' yearly mean'), secondary_y=False)
        fig.update_yaxes(title_text=((str(disease).replace(
            '_', ' ')).title() + ' death yearly mean'), secondary_y=True)
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],

        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # pie chart compare get model year edit

    def pie_chart_disease(self, df1, df2, disease, begin, end):
        df1 = df1[df1['year'].between(int(begin), int(end))]
        df2 = df2[df2['year'].between(int(begin), int(end))]
        labels = [df1['name'].unique(), df2['name'].unique()]
        value0 = df1[str(disease)].mean()
        value1 = df2[str(disease)].mean()
        fig = go.Figure()

        fig.add_trace(go.Pie(labels=labels, values=[
            value0, value1], name=str(disease)))
        fig.update_layout(margin=dict(l=20, r=20, t=20, b=20))
        fig.update_traces(hole=.4, hoverinfo="label+percent+name")
        pie = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return pie

    # pie chart climate

    def pie_chart_climate(self, df1, df2, climate, begin, end):
        df1 = df1[df1['year'].between(int(begin), int(end))]
        df2 = df2[df2['year'].between(int(begin), int(end))]
        labels = [df1['name'].unique(), df2['name'].unique()]
        value0 = df1[str(climate)].mean()
        value1 = df2[str(climate)].mean()
        fig = go.Figure()

        fig.add_trace(go.Pie(labels=labels, values=[
            value0, value1], name=str(climate)))
        #   template="plotly_dark",
        fig.update_layout(margin=dict(l=20, r=20, t=20, b=20))
        fig.update_traces(hole=.4, hoverinfo="label+percent+name")
        pie = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return pie

    # comparation region climate

    def compare_climate_province(self, df1, df2, climate, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get mean
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df1['year'], y=df1[str(climate)],
                                 name=self.listToString(df1['name'].unique()),
                                 mode='lines', showlegend=True
                                 ))
        fig.add_trace(go.Scatter(x=df2['year'], y=df2[str(climate)],
                                 name=self.listToString(df2['name'].unique()),
                                 mode='lines', showlegend=True
                                 ))

        dv = self.title_climate(str(climate))
        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Year', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' yearly mean' + str(dv)
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # compate region climate month

    def compare_climate_province_month(self, df1, df2, climate, begin, end):
        # get data province 1
        df1 = df1[df1['year'].between(int(begin), int(end))]
        # get data province 2
        df2 = df2[df2['year'].between(int(begin), int(end))]
        # get mean
        mean1 = df1.groupby(['month', 'name']).mean().reset_index()
        mean2 = df2.groupby(['month', 'name']).mean().reset_index()
        # month
        mean1['month'] = mean1['month'].apply(lambda x: calendar.month_abbr[x])
        mean2['month'] = mean2['month'].apply(lambda x: calendar.month_abbr[x])
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=mean1['month'], y=mean1[str(climate)],
                                 name=str(mean1['name'][0]),
                                 mode='lines', showlegend=True
                                 ))
        fig.add_trace(go.Scatter(x=mean2['month'], y=mean2[str(climate)],
                                 name=str(mean2['name'][0]),
                                 mode='lines', showlegend=True
                                 ))
        dv = self.title_climate(str(climate))

        fig.update_layout(
            updatemenus=[
                dict(
                    buttons=list([
                        dict(
                            args=["type", "scatter"],
                            label="Line Chart",
                            method="restyle"
                        ),
                        dict(
                            args=["type", "bar"],
                            label="Bar Chart",
                            method="restyle"
                        ),

                    ]),
                    direction="down",
                    pad={"r": 10, "t": 10},
                    showactive=True,
                    x=1.2,
                    xanchor="right",
                    y=1.2,
                    yanchor="top"
                ),
            ],
            xaxis_title='Month', template="plotly_white",
            margin=dict(l=30, r=30, b=30, t=30),
            yaxis_title=(str(climate.replace('_', ' ')).title()) +
                        ' monthly mean' + str(dv)
        )
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # visulization linear year compare data

    def linear_comp_year(self, df0, df1, feature, begin, end):
        df0 = df0[df0['year'].between(int(begin), int(end))]
        # get data province 2
        df1 = df1[df1['year'].between(int(begin), int(end))]
        fig = px.scatter(x=df0[str(feature)], y=df1[str(feature)],
                         trendline="ols", color=df0['year'])

        fig.update_layout(
            xaxis_title=str(df0['name'][0]),
            yaxis_title=str(df1['name'][0]),
            showlegend=True)
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line

    # visulization linear month compare data

    def linear_comp_month(self, df0, df1, feature, begin, end):
        df0 = df0[df0['year'].between(int(begin), int(end))]
        # get data province 2
        df1 = df1[df1['year'].between(int(begin), int(end))]
        mean1 = df0.groupby(['month', 'name']).mean().reset_index()
        mean2 = df1.groupby(['month', 'name']).mean().reset_index()
        # month
        # mean1['month'] = mean1['month'].apply(lambda x: calendar.month_abbr[x])
        # mean2['month'] = mean2['month'].apply(lambda x: calendar.month_abbr[x])
        fig = px.scatter(x=mean1[str(feature)], y=mean2[str(feature)],
                         trendline="ols", color=mean1['month'])

        fig.update_layout(
            xaxis_title=str(mean1['name'][0]),
            yaxis_title=str(mean2['name'][0]), showlegend=True)
        line = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return line
