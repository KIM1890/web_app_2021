$(document).ready(function () {
  // timeseries begin and year
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/') {
    return false;
  }
  $(".begin").change(function () {
    var val = $(this).val();
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    // console.log(min,' ',max);
    var portion = (val - min) / (max - min);
    $(".indicator_begin").text(val);
    $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
    // check time 
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: 'Confirm',
        content: 'Please choose begin year bigger than or equal end year!',
        iconClose: true,
        buttons: {
          ok: {
            btnClass: 'btn-primay',
            action: function () {
              $(".begin").val(min);
              $(".indicator_begin").text(min);
              title_home(min, end);
              run_disease_array(disease_array);
              run_climate_array(climate_array);
            }
          },
        }
      });
      return false;
    }
    title_home(begin, end);
    run_disease_array(disease_array);
    run_climate_array(climate_array);
    get_data_home();
  });
  // end year
  $(".end").change(function () {
    var val = $(this).val();
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_end").text(val);
    $(".indicator_end").css("left", portion * ($(".end").width() - 18));
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: 'Confirm',
        content: 'Please choose begin year bigger than or equal end year!',
        iconClose: true,
        buttons: {
          ok: {
            btnClass: 'btn-primay',
            action: function () {
              $(".begin").val(min);
              $(".indicator_begin").text(min);
              console(min);
              title_home(min, end);
              run_disease_array(disease_array);
              run_climate_array(climate_array);
            }
          },
        }
      });
      return false;
    }
    title_home(begin, end);
    run_disease_array(disease_array);
    run_climate_array(climate_array);
    get_data_home();
  });
  // check nhieu loai benh
  var disease_array = [];
  $(".check_disease").click(function () {
    var begin = $(".begin").val();
    var end = $(".end").val();

    if (this.checked) {
      disease_array.push(this.value);
      run_disease_array(disease_array);
    } else {
      unchecked_disease(this.value);
      disease_array.pop(this.value);
    }
  });
  // check nhieu yeu to
  var climate_array = [];
  $(".check_climate").click(function () {
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (this.checked) {
      climate_array.push(this.value);
      run_climate_array(climate_array);
    } else {
      unchecked_climate(this.value);
      climate_array.pop(this.value);
    }
  });
  // on click disease
  function run_disease_array(disease_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();

    $.each(disease_array, function (index, value) {
      i++;
      chart_disease(begin, end, value, i);
    });
  };
  // run nhieu yeu to moi truong
  function run_climate_array(climate_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();

    $.each(climate_array, function (index, value) {
      i++;
      chart_climate(begin, end, value, i);
    });
  };
  // request to get feature.csv data climate
  function chart_climate(begin, end, name, order) {
    // line chart climate
    $.ajax({
      url: "/line_chart_climate",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        climate: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_climate_${order}`, data, {});
        $(`#climate_line_${order}`).html(`Yearly mean ${name.split('_').join('  ')} by year, Viet Nam  ${begin}-${end}`);
      },
    });
    // heatmap Viet Nam
    // ajax heatmap climate
    $.ajax({
      url: "/heatmap_climate",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        climate: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmapclimate_${order}`, data, {});
        $(`#climate_${order}`).html(`Distribution of yearly mean ${name.split('_').join('  ')} in Viet Nam  ${begin}-${end}`);
      },
    });
    // chart date1 home
    $.ajax({
      url: "/date1_home_climate",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        climate: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_climate_home_${order}`, data, {});
        $(`#title_climate_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')} in Viet Nam  ${begin}-${end}`);
      },
    });
    create_tag_chart_climate(order, name);
  }
  // request to get feature.csv data disease
  function chart_disease(begin, end, name, order) {

    create_tag_chart_disease(order, name);
    $.ajax({
      url: "/line_chart_disease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_disease_${order}`, data, {});
        // incidence and death rates of influenza by monthly mean, Việt Nam,
        $(`#disease_line_${order}`).html(`Number case of ${name.split('_').join('  ')}
          by yearly mean in Viet Nam  ${begin}-${end}`);
      },
    });
    // ajax heatmap disease
    $.ajax({
      url: "/heatmap_vn",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmapvn_${order}`, data, {});
        //Distribution of  influenza incidence rate by monthly mean in Viet
        // Nam, 1997-2016
        $(`#disease_${order}`).html(`Distribution of ${name.split('_').join('  ')}
         by yearly mean in Viet Nam  ${begin}-${end}`);
      },
    });
    // line chart population
    $.ajax({
      url: "/line_chart_population",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        // disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_pop_${order}`, data, {});
        $(`#pop_line_${order}`).html(`Yearly mean population by year in Viet Nam  ${begin}-${end}`);
      },
    });
    // ajax population
    $.ajax({
      url: "/heatmap_population",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmap_pop_${order}`, data, {});
        //Distribution of  influenza incidence rate by monthly mean in Viet
        // Nam, 1997-2016
        $(`#pop_${order}`).html(`Distribution of population by yearly mean in Viet Nam  ${begin}-${end}`);
      },
    });
    //   ajax case/population
    $.ajax({
      url: "/heatmap_ratio",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmap_ratio_${order}`, data, {});
        $(`#ratio_${order}`).html(`Distribution rate of ${name.split('_').join('  ')}
        /100000 by yearly mean in Viet Nam
          ${begin}-${end}`);
      },
    });
    // ratio case/population
    // line_chart_ratio
    $.ajax({
      url: "/line_chart_ratio",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_ratio_${order}`, data, {});
        $(`#ratio_line_${order}`).html(`Rate of ${name.split('_').join('  ')}/100000 
                    by yearly mean in Viet Nam  ${begin}-${end}`);
      },
    });
    // /date1_home_disease
    $.ajax({
      url: "/date1_home_disease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        disease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_date1_${order}`, data, {});
        // monthly mean influenza incidence
        $(`#title_date1_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')}  in Viet Nam  ${begin}-${end}`);
      },
    });
  };
  // create tag in summary data
  function create_tag_chart_disease(order, name) {
    var html = '';
    html += `<div class="product-sales-area mg-tb-30" id=disease_${name}>
    <div class="container-fluid">
        <!-- chart in here  -->
        <div class="row">
            <!-- col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=disease_line_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="linechart_disease_${order}" class="linechart_disease_${order}"
                        style="height: auto;width:auto"></div>
                </div>
            </div>
            <!-- col 2  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=disease_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here  -->
                    <div id="heatmapvn_${order}" class="heatmapvn_${order}" style="height: auto;width:auto"></div>
                </div>
            </div>
            <!-- end col 2  -->
        </div>
    </div>
</div>
<!-- lline chart date1  -->
<div class="product-sales-area mg-tb-30" id=disease_date1_home_${name}>
    <div class="container-fluid">
        <!-- chart in here  -->
        <div class="row">
            <!-- col 1  -->
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=title_date1_home_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="linechart_date1_${order}" class="linechart_date1_${order}"
                        style="height: auto;width:auto"></div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- end line chart date1  -->
<!--  chart  disease2-->
<div class="library-book-area mg-t-30" id=heatmapdisease_${name}>
    <div class="container-fluid">
        <!-- show chart in here  -->
        <div class="row">
            <!-- begin col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=pop_line_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="linechart_pop_${order}" class="linechart_pop_${order}" style="height: auto;width:auto">
                    </div>
                </div>
            </div>
            <!-- end col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=pop_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="heatmap_pop_${order}" class=" heatmap_pop_${order}" style="height: auto;width:auto"></div>
                </div>
            </div>
            <!-- end col 2  -->
        </div>
    </div>
</div>
<!-- chart disease 3  -->
<div class="product-sales-area mg-tb-30" id=disease_heatmap_${name}>
    <div class="container-fluid">
        <!-- show chart in here  -->
        <div class="row">
            <!-- begin col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=ratio_line_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- chart in here -->
                    <div id="linechart_ratio_${order}" class="linechart_ratio_${order}" style="height: auto;width:auto">
                    </div>
                </div>
            </div>
            <!-- end col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=ratio_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Select region Viet Nam
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='3'
                                                data-disease="${name}">Viet Nam</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='0'
                                                data-disease="${name}">North</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='1'
                                                data-disease="${name}">Central</a>
                                            <a class="dropdown-item click_disease_region_${order}" data-value='2'
                                                data-disease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="heatmap_ratio_${order}" class="heatmap_ratio_${order}" style="height: auto;width:auto">
                    </div>
                </div>
            </div>
            <!-- end col 2  -->
        </div>
    </div>
</div>
<hr class="my-4" id=ruler1_${name}>
`;
    $(".disease_chart").append(html);
    // remove dupplicate
    $(`#disease_${name},#heatmapdisease_${name},#disease_heatmap_${name},#disease_date1_home_${name},#ruler1_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
    chosen_region(order);
  };
  // end timeseries
  // climate
  function create_tag_chart_climate(order, name) {
    var html = '';
    html += `<div class="product-sales-area mg-tb-30" id=climate_${name}>
        <div class="container-fluid">
            <!-- show chart climate in here  -->
            <div class="row">
                <!-- begin col 1  -->
                <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <div class="product-sales-chart">
                        <div class="portlet-title">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="caption pro-sl-hd">
                                        <span class="caption-subject" id=climate_line_${order}><b></b></span>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="actions graph-rp graph-rp-dl">
                                        <div class="dropdown no-arrow">
                                            <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Select region Viet Nam
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                aria-labelledby="dropdownMenuLink">
                                                <div class="dropdown-header">Region Viet Nam</div>
                                                <hr>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                    data-climate="${name}">Viet Nam</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                    data-climate="${name}">North</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                    data-climate="${name}">Central</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='2'
                                                    data-climate="${name}">South</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- chart in here -->
                        <div id="linechart_climate_${order}" class="linechart_climate_${order}"
                            style="height: auto;width:auto"></div>
                    </div>
                </div <!-- begin col 2 -->
                <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                    <div class="product-sales-chart">
                        <div class="portlet-title">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="caption pro-sl-hd">
                                        <span class="caption-subject" id=climate_${order}><b></b></span>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="actions graph-rp graph-rp-dl">
                                        <div class="dropdown no-arrow">
                                            <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Select region Viet Nam
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                aria-labelledby="dropdownMenuLink">
                                                <div class="dropdown-header">Region Viet Nam</div>
                                                <hr>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                    data-climate="${name}">Viet Nam</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                    data-climate="${name}">North</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                    data-climate="${name}">Central</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='2'
                                                    data-climate="${name}">South</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- chart in here -->
                        <div id="heatmapclimate_${order}" class=" heatmapclimate_${order}" style="height: auto;width:auto">
                        </div>
                    </div>
                </div>
                <!-- end col 2  -->
            </div>
        </div>
    </div>
    <!-- show chart climate in here  -->
    <div class="product-sales-area mg-tb-30" id=climate_date1_home_${name}>
        <div class="container-fluid">
            <!-- show chart climate in here  -->
            <div class="row">
                <!-- begin col 1  -->
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="product-sales-chart">
                        <div class="portlet-title">
                            <div class="row">
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="caption pro-sl-hd">
                                        <span class="caption-subject" id=title_climate_home_${order}><b></b></span>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                    <div class="actions graph-rp graph-rp-dl">
                                        <div class="dropdown no-arrow">
                                            <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Select region Viet Nam
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                                aria-labelledby="dropdownMenuLink">
                                                <div class="dropdown-header">Region Viet Nam</div>
                                                <hr>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                    data-climate="${name}">Viet Nam</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                    data-climate="${name}">North</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                    data-climate="${name}">Central</a>
                                                <a class="dropdown-item click_climate_region_${order}" data-value='2'
                                                    data-climate="${name}">South</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- chart in here -->
                        <div id="linechart_climate_home_${order}" class="linechart_climate_home_${order}"
                            style="height: auto;width:auto"></div>
                    </div>
                </div >
            </div>
        </div>
    </div>
    <hr class="my-4" id=ruler2_${name}>
    `;
    $(".climate_chart").append(html);
    $(`#climate_${name},#climate_date1_home_${name},#ruler2_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
    chosen_region_climate(order);
  };
  // create function to delete then uncheckbox
  function unchecked_disease(name) {
    $(`#disease_${name}`).remove();
    $(`#heatmapdisease_${name}`).remove();
    $(`#disease_heatmap_${name}`).remove();
    $(`#disease_date1_home_${name}`).remove();
    $(`#ruler1_${name}`).attr('class', 'my-4 hidden');
  };
  // create function delete climate then uncheckbox
  function unchecked_climate(name) {
    $(`#climate_${name}`).remove();
    $(`#climate_date1_home_${name}`).remove();
    $(`#ruler2_${name}`).attr('class', 'my-4 hidden');
  };
  // tag a href
  function chosen_region(order) {
    $(`.click_disease_region_${order}`).click(function () {
      var region = $(this).data('value');
      var name = $(this).data('disease');
      var begin = $(".begin").val();
      var end = $(".end").val();

      // line chart region disease
      $.ajax({
        url: "/line_chart_region_disease",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          disease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_disease_${order}`, data, {});
          $(`#disease_line_${order}`).html(`Number case of ${name.split('_').join('  ')} by yearly mean in Viet Nam  ${begin}-${end}`);
        },
      });
      // heatmap region disease
      $.ajax({
        url: "/heatmap_vn_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          disease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmapvn_${order}`, data, {});
          $(`#disease_${order}`).html(`Distribution of ${name.split('_').join('  ')} by yearly mean in Viet Nam  ${begin}-${end}`);
        },
      });
      // heatmap population
      $.ajax({
        url: "/heatmap_pop_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmap_pop_${order}`, data, {});
          $(`#pop_${order}`).html(`Distribution of population by yearly mean in Viet Nam  ${begin}-${end}`);
        },
      });
      // line chart population
      $.ajax({
        url: "/chart_region_population",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_pop_${order}`, data, {});
          $(`#pop_line_${order}`).html(`Yearly mean population in Viet Nam  ${begin}-${end}`);
        },
      });
      // heatmap radio
      $.ajax({
        url: "/heatmap_radio_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          disease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmap_ratio_${order}`, data, {});
          $(`#ratio_${order}`).html(`Distribution rate of ${name.split('_').join('  ')}
          /100000 by yearly mean in Viet Nam
           ${begin}-${end}`);
        },
      });
      // line_chart_ratio
      $.ajax({
        url: "/chart_region_ratio",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          disease: name,
          begin: begin,
          end: end,
          region: region
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_ratio_${order}`, data, {});
          $(`#ratio_line_${order}`).html(`Rate of ${name.split('_').join('  ')}/100000
           by yearly mean in Viet Nam  ${begin}-${end}`);
        },
      });
      // /region_date1_disease_home
      $.ajax({
        url: "/region_date1_disease_home",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          disease: name,
          begin: begin,
          end: end,
          region: region
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_date1_${order}`, data, {});
          $(`#title_date1_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')}  in Viet Nam from ${begin}-${end}`);
        },
      });
    });
  };
  // choosen climate
  function chosen_region_climate(order) {
    $(`.click_climate_region_${order}`).click(function () {
      var region = $(this).data('value');
      var name = $(this).data('climate');
      var begin = $(".begin").val();
      var end = $(".end").val();

      $.ajax({
        url: "/line_chart_region_climate",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          climate: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_climate_${order}`, data, {});
          $(`#climate_line_${order}`).html(`Yearly mean ${name.split('_').join('  ')} by year in Viet Nam from ${begin}-${end}`);
        },
      });
      // heatmap region disease
      $.ajax({
        url: "/heatmap_climate_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          climate: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmapclimate_${order}`, data, {});
          $(`#climate_${order}`).html(`Distribution of yearly mean ${name.split('_').join('  ')} in Viet Nam from ${begin}-${end}`);
        },
      });
      // region_date1_climate_home
      $.ajax({
        url: "/region_date1_climate_home",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          climate: name,
          begin: begin,
          end: end,
          region: region
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_climate_home_${order}`, data, {});
          $(`#title_climate_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')} in Viet Nam from ${begin}-${end}`);
        },
      });
    });
  };
  // get region climate
  get_data_home()

  function get_data_home() {
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.ajax({
      type: "GET",
      url: "/summary_response",
      success: function (response) {
        $(".showresult_home").html(response.data);

      },
      data: {
        begin: begin,
        end: end
      },
      error: function (response) {
        console.log(response);
      }
    });
  };
  // title home default
  title_home(1997, 2019);
  function title_home(begin, end) {
    $('.title_home').html(`Summary Disease Data In Viet Nam, ${begin}-${end}`)
  }
});
