$(document).ready(function () {
  // timeseries begin and year
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/home') {
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
          $(`#title_date1_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')}  in Viet Nam  ${begin}-${end}`);
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
          $(`#climate_line_${order}`).html(`Yearly mean ${name.split('_').join('  ')} by year in Viet Nam  ${begin}-${end}`);
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
          $(`#climate_${order}`).html(`Distribution of yearly mean ${name.split('_').join('  ')} in Viet Nam  ${begin}-${end}`);
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
          $(`#title_climate_home_${order}`).html(`Monthly mean ${name.split('_').join('  ')} in Viet Nam  ${begin}-${end}`);
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

$(document).ready(function() {
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    }
  });
  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });
  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  $("#sidebarToggle").click(function() {
    var toggled = $(".accordion ").hasClass("toggled");
    if (toggled == false) {
      $(".container-fluid").attr("style", "padding-left: 15.5rem !important");
    } else {
      $(".container-fluid").attr("style", "padding-left: 7.5rem !important");
    };
  });
});

$(document).ready(function () {
    let currentURL = $(location).attr('pathname');
    if (currentURL != '/explore') {
        return false;
    }
    // tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // timeseries begin and year
    var begin = 1997;
    var end = 2019;
    $(".begin").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_begin").text(val);
        $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
        // check time
        begin = $(".begin").val();
        end = $(".end").val();
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
                            begin = $(".begin").val();
                            title_explore(begin, end);
                            run_disease_explore(disease_exp_array);
                            run_climate_explore(climate_exp_array);
                            // test
                            $(".check_region").click(function () {
                                run_region_disease(disease_exp_array);
                                run_region_climate(climate_exp_array);
                            });
                        }
                    },
                }
            });
            return false;
        }
        // tittle
        // default
        title_explore(begin, end);
        run_disease_explore(disease_exp_array);
        run_climate_explore(climate_exp_array);
        // process in here
        $(".check_region").click(function () {
            run_region_disease(disease_exp_array);
            run_region_climate(climate_exp_array);
        });

    });
    // end year
    $(".end").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_end").text(val);
        $(".indicator_end").css("left", portion * ($(".end").width() - 18));
        // check time
        begin = $(".begin").val();
        end = $(".end").val();
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
                            title_explore(min, end);
                            run_disease_explore(disease_exp_array);
                            run_climate_explore(climate_exp_array);
                            $(".check_region").click(function () {
                                run_region_disease(disease_exp_array);
                                run_region_climate(climate_exp_array);
                            });
                        }
                    },
                }
            });
            return false;
        }
        // default
        title_explore(begin, end);
        run_disease_explore(disease_exp_array);
        run_climate_explore(climate_exp_array);
        $(".check_region").click(function () {
            run_region_disease(disease_exp_array);
            run_region_climate(climate_exp_array);
        });

    });
    // form search
    var province_code = "15";
    $(".search_pro").change(function (event) {
        var province = $('#province').val();
        var code_map = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13,
            9, 8, 11, 6, 1, 10, 2, 17, 12, 19, 22, 23, 21, 38, 26, 45, 32,
            49, 28, 40, 56, 42, 43, 61, 35, 41, 37, 55, 34, 57, 48,
            36, 59, 60, 52, 62, 46, 39, 63, 51, 64, 54]

        $.each(code_map, function (index, value) {
            if (province == value) {
                province_code = value;
                $(`#${province}`).css("fill", "#3b729f");
            } else {
                $(`#${value}`).css("fill", "#88a4bc");

            }
        });
        run_disease_explore(disease_exp_array);
        run_climate_explore(climate_exp_array);
        getData(province_code);
        getData_Climate(province_code);
        title_explore(begin, end);

    });
    // end search
    // double click
    $("path").click(function (event) {
        $("#province option:selected").text("Choose Province...");
        var id = $(this).attr("id");
        province_code = id;
        // kiem tra xem check map nao
        exist_data(id);
        var check = $(this).data("check");
        if (check == "mvn") {
            // co the click chon tung tinh
            run_disease_explore(disease_exp_array);
            run_climate_explore(climate_exp_array);
            getData(id, name);
            getData_Climate(id, name);
            title_explore(begin, end);
            $("path").each(function () {
                var listid = $(this).attr("id");
                if (listid == id) {
                    $(`#${id}`).css("fill", "#3b729f");
                } else {
                    $(`#${listid}`).removeClass().css("fill", "#88a4bc");
                }
            });
        }
        ;
    });
    // select region in Viet Nam with map
    var region_id = "3";
    var name_region = '';
    $(".check_region").click(function (envet) {
        var region = $(this).data('value');
        // var region_vn = $(this).data('check');
        region_id = region;
        name_region = $(this).attr('at');
        // get id cua ca nuoc
        var all_id = [];
        $("path").each(function (index, value) {
            var path_id = $(this).attr("id");
            // console.log($(this).attr('title'));
            all_id.push(path_id);
        });
        var list_id_north = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6, 1, 10, 2, 17, 12, 19];
        var list_id_central = [22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56, 42, 43, 61, 35, 41, 37, 55, 34];
        var list_id_south = [57, 48, 36, 59, 60, 52, 62, 46, 39, 63, 51, 64, 54];
        if (region == 0) {
            $.each(list_id_north, function (index, value) {
                get_all_id(value);
            });
            // get data region
            getData_region(region_id);
            getData_region_climate(region_id);
            // end data region
            check_id_exits(list_id_south);
            check_id_exits(list_id_central);
            run_region_disease(disease_exp_array);
            run_region_climate(climate_exp_array);
        } else if (region == 1) {
            $.each(list_id_central, function (index, value) {
                get_all_id(value);
            });
            // get region data
            getData_region(region_id);
            getData_region_climate(region_id);
            // end region data
            check_id_exits(list_id_north);
            check_id_exits(list_id_south);
            run_region_disease(disease_exp_array);
            run_region_climate(climate_exp_array);
        } else if (region == 2) {
            $.each(list_id_south, function (index, value) {
                get_all_id(value);
            });
            // get region data
            getData_region(region_id);
            getData_region_climate(region_id);
            // get region data
            check_id_exits(list_id_north);
            check_id_exits(list_id_central);
            run_region_disease(disease_exp_array);
            run_region_climate(climate_exp_array);
        } else {
            $.each(all_id, function (index, value) {
                $(`#${value}`).css("fill", "#88a4bc");
                $(`#15`).css("fill", "#3b729f");
            });
        }
    });

    //  check_id_exits
    function check_id_exits(list_id_area = []) {
        $.each(list_id_area, function (index, value) {
            $(`#${value}`).removeClass().css("fill", "#88a4bc");
        });
    }

    // get all id
    function get_all_id(id) {
        $("path").each(function (index, value) {
            var path_id = $(this).attr("id");
            if (path_id == id) {
                $(`#${id}`).css("fill", "#3b729f");
            }
        });
    }

    // check nhieu loai benh
    var disease_exp_array = [];
    // var disease_climate = [];
    $(".check_disease").click(function () {
        // check time
        var begin = $(".begin").val();
        var end = $(".end").val();

        if (this.checked) {
            disease_exp_array.push(this.value);
            // disease_climate.push(this.value);
            run_disease_explore(disease_exp_array);
            $(".check_region").click(function () {
                run_region_disease(disease_exp_array);
            });
            // run_region_disease(disease_exp_array);
        } else {
            disease_exp_array.pop(this.value);
            // disease_climate.pop(this.value);
            unchecked_disease_exp(this.value);
        }
    });
    // check nhieu yeu to
    var climate_exp_array = [];
    $(".check_climate").click(function () {
        // check time
        if (this.checked) {
            climate_exp_array.push(this.value);
            // disease_climate.push(this.value);
            run_climate_explore(climate_exp_array);
            $(".check_region").click(function () {
                run_region_climate(climate_exp_array);
            });
        } else {
            climate_exp_array.pop(this.value);
            // disease_climate.pop(this.value);
            unchecked_climate_exp(this.value);
        }
    });
    // console.log(climate_exp_array);

    // disease
    function run_disease_explore(disease_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(disease_array, function (index, value) {
            i++;
            chart_disease_explore(begin, end, value, i);
        });
    };

    // climate
    function run_climate_explore(climate_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(climate_array, function (index, value) {
            i++;
            chart_climate_explore(begin, end, value, i);
        })
    }

    // chart disease
    function chart_disease_explore(begin, end, name, order) {
        create_tag_exp(order, name)
        // lag correlation
        $.ajax({
            url: "/lag_correlation",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`lag_province_${order}`, data, {});
                // split(' ').join('');
                $(`#lag_explore_${order}`).html(`Lag correlation of ${name.split('_').join(' ')} by monthly mean ${begin}-${end}`);
            },
        });
        // disease year province
        $.ajax({
            url: "/line_province_disease_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_province_${order}`, data, {});
                $(`#disease_explore_${order}`).html(`Number case of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // disease month province
        $.ajax({
            url: "/line_province_disease_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_province_month_${order}`, data, {});
                $(`#disease_exp_month_${order}`).html(`Number case of ${name.split('_').join('  ')} by monthly mean ${begin}-${end}`);
            },
        });
        // seasonal analyst
        $.ajax({
            url: "/seasonal_disease_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`seasonal_disease_${order}`, data, {});
                $(`#seasonal_${order}`).html(`Seasonal of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // correlation
        // var disease_climate = $.merge($.merge([], disease_exp_array), climate_exp_array);
        $.ajax({
            url: "/corr_disease_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease_climate,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_exp_${order}`, data, {});
                $(`#title_corr_exp_${order}`).html(`Correlation of ${name.split('_').join('  ')} 
        with climate and disease by yearly mean  ${begin}-${end}`);
            },
        });
        // date1 line chart
        $.ajax({
            url: "/line_date1_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`date1_disease_${order}`, data, {});
                $(`#title_date1_${order}`).html(`Number case of ${name.split('_').join('  ')} by monthly mean ${begin}-${end}`);
            },
        });
    };

    // chart climate
    function chart_climate_explore(begin, end, name, order) {
        create_tag_climate_exp(order, name);
        // line chart climate
        $.ajax({
            url: "/province_climate_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_explore_${order}`, data, {});
                $(`#climate_exp_${order}`).html(`Number case of  ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // ajax heatmap climate
        $.ajax({
            url: "/province_climate_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_explore_month_${order}`, data, {});
                $(`#climate_exp_month_${order}`).html(`Number case of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // seasonal analyst
        $.ajax({
            url: "/seasonal_climate_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`seasonal_climate_${order}`, data, {});
                $(`#seasonal_analyst_exp_${order}`).html(`Seasonal of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // lag correlation
        $.ajax({
            url: "/lag_climate_correlation",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`lag_chart_climate_${order}`, data, {});
                $(`#lag_climate_${order}`).html(`Lag correlation of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // line chart date1
        $.ajax({
            url: "/line_date1_climate_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_date1_exp_${order}`, data, {});
                $(`#title_date1_exp1_${order}`).html(`Number case of  ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
    }

    // use function
    function create_tag_exp(order, name) {
        var html = '';
        html += ` <div class="product-sales-area mg-tb-30" id=disease_exp0_${name}>
    <div class="container-fluid">
      <!-- chart in here  -->
      <div class="row">
        <!-- col 1  year-->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" id="disease_exp_${name}">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=disease_explore_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here -->
            <div id=line_province_${order} class=line_province_${order} style="height: auto;width:auto"></div>
          </div>
        </div>
        <!-- year + date1  -->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=title_date1_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here -->
            <div id=date1_disease_${order} class=date1_disease_${order} style="height: auto;width:auto">
            </div>
          </div>
        </div>
        <!-- end  -->
      </div>
    </div>
  </div>
  <!--  chart  disease2-->
  <div class="product-sales-area mg-tb-30" id=disease_exp1_${name}>
    <div class="container-fluid">
      <!-- show chart in here seasonal -->
      <div class="row">
        <!-- begin col 1  -->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=seasonal_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here -->
            <div id=seasonal_disease_${order} class=seasonal_disease_${order} style="height: auto;width:auto">
            </div>
          </div>
        </div>
        <!-- col 2  month-->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=disease_exp_month_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here  -->
            <div class="line_province_month_${order}" id=line_province_month_${order}
              style="height: auto;width:auto"></div>
          </div>
        </div>
        <!-- end col 2  -->
      </div>
    </div>
  </div>
  <!-- begin date 1  -->
  <div class="product-sales-area mg-tb-30" id=date1_exp_${name}>
    <div class="container-fluid">
      <!-- show chart in here  -->
      <div class="row">
        <!-- lag correlation  -->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=lag_explore_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here -->
            <div class="lag_province_${order}" id=lag_province_${order} style="height: auto;width:auto"></div>
          </div>
        </div>
        <!-- end lag -->
        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
          <div class="product-sales-chart">
            <div class="portlet-title">
              <div class="row">
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="caption pro-sl-hd">
                    <span class="caption-subject" id=title_corr_exp_${order}><b></b></span>
                  </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div class="actions graph-rp graph-rp-dl">
                  </div>
                </div>
              </div>
            </div>
            <!-- chart in here -->
            <div class="corr_exp_${order}" id=corr_exp_${order} style="height: auto;width:auto"></div>
          </div>
        </div>
        <!-- end col 2  -->
      </div>
    </div>
  </div>
  <!-- end date1  -->
  <hr class="my-4" id=ruler_exp_${name}>
  `
        $(".disease_exp").append(html);
        $(`#disease_exp0_${name}, #disease_exp1_${name}, #date1_exp_${name}, #ruler_exp_${name}`).each(function (i) {
            $('[id="' + this.id + '"]').slice(1).remove();
        });
    }

    // create tag climate
    function create_tag_climate_exp(order, name) {
        var html = '';
        html += `<!-- show chart in here  -->
    <div class="product-sales-area mg-tb-30" id=climate_exp0_${name}>
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
                      <span class="caption-subject" id=climate_exp_${order}><b></b></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="actions graph-rp graph-rp-dl">
                    </div>
                  </div>
                </div>
              </div>
              <!-- chart in here -->
              <div id=climate_explore_${order} class=climate_explore_${order} style="height: auto;width:auto">
              </div>
            </div>
          </div>
          <!-- col 2  -->
          <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div class="product-sales-chart">
              <div class="portlet-title">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="caption pro-sl-hd">
                      <span class="caption-subject" id=climate_exp_month_${order}><b></b></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="actions graph-rp graph-rp-dl">
                    </div>
                  </div>
                </div>
              </div>
              <!-- chart in here  -->
              <div id=climate_explore_month_${order} class=climate_explore_month_${order}
                style="height: auto;width:auto"></div>
            </div>
          </div>
          <!-- end col 2  -->
        </div>
      </div>
    </div>
    <!--  chart  disease2-->
    <div class="product-sales-area mg-tb-30" id=climate_exp1_${name}>
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
                      <span class="caption-subject" id=seasonal_analyst_exp_${order}><b></b></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="actions graph-rp graph-rp-dl">
                    </div>
                  </div>
                </div>
              </div>
              <!-- chart in here -->
              <div class="seasonal_climate_${order}" id=seasonal_climate_${order} style="height: auto;width:auto">
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
                      <span class="caption-subject" id=lag_climate_${order}><b></b></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="actions graph-rp graph-rp-dl">
                    </div>
                  </div>
                </div>
              </div>
              <!-- chart in here -->
              <div class="lag_chart_climate_${order}" id=lag_chart_climate_${order}
                style="height: auto;width:auto"></div>
            </div>
          </div>
          <!-- end col 2  -->
        </div>
      </div>
    </div>
    <!-- end -->
    <div class="product-sales-area mg-tb-30" id='line_date1_exp1_${name}'>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div class="product-sales-chart">
              <div class="portlet-title">
                <div class="row">
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="caption pro-sl-hd">
                      <span class="caption-subject" id="title_date1_exp1_${order}"><b></b></span>
                    </div>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                    <div class="actions graph-rp graph-rp-dl">
                    </div>
                  </div>
                </div>
              </div>
              <div class="line_date1_exp_${order}" id="line_date1_exp_${order}" style="height: auto;width:auto">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <hr class="my-4 " id=ruler_exp0_${name}> 
    `
        $(".climate_exp").append(html);
        $(`#climate_exp0_${name}, #climate_exp1_${name}, #line_date1_exp1_${name}, #ruler_exp0_${name}`).each(function (i) {
            $('[id="' + this.id + '"]').slice(1).remove();
        });
    }

    // uncheck disease
    function unchecked_disease_exp(name) {
        // $(`#disease_exp_${name}`).remove();
        $(`#disease_exp0_${name}`).remove();
        $(`#disease_exp1_${name}`).remove();
        $(`#date1_exp_${name}`).remove();
        $(`#ruler_exp_${name}`).attr('class', 'my-4 hidden');
        ;
    }

    // uncheck climate
    function unchecked_climate_exp(name) {
        $(`#climate_exp0_${name}`).remove();
        $(`#climate_exp1_${name}`).remove();
        $(`#line_date1_exp1_${name}`).remove();
        $(`#ruler_exp0_${name}`).attr('class', 'my-4 hidden');
    }

    // chosen_region_disease('Influenza');
    function chosen_region_disease(begin, end, name, order) {
        // line year disease
        $.ajax({
            url: "/region_disease_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_province_${order}`, data, {});
                $(`#disease_explore_${order}`).html(`Number case of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // line month disease
        $.ajax({
            url: "/region_disease_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_province_month_${order}`, data, {});
                $(`#disease_exp_month_${order}`).html(`Number case of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // seasonal analyst
        $.ajax({
            url: "/region_seasonal_disease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`seasonal_disease_${order}`, data, {});
                $(`#seasonal_${order}`).html(`Seasonal of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // lag disease region get tag province
        $.ajax({
            url: "/lag_region_disease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`lag_province_${order}`, data, {});
                $(`#lag_explore_${order}`).html(`Lag correlation of ${name.split('_').join(' ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // line chart date1
        $.ajax({
            url: "/date1_region_disease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`date1_disease_${order}`, data, {});
                $(`#title_date1_${order}`).html(`Number case of ${name.split('_').join('  ')} by montly mean  ${begin}-${end}`);
            },
        });
        // correlation
        $.ajax({
            url: "/region_corr_disease_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease_climate,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_exp_${order}`, data, {});
                $(`#title_corr_exp_${order}`).html(`Correlation of ${name.split('_').join('  ')} 
        with climate and disease by yearly mean  ${begin}-${end}`);
            },
        });
    };

    // run disease region
    function run_region_disease(disease_exp_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(disease_exp_array, function (index, value) {
            i++;
            chosen_region_disease(begin, end, value, i);
        });
    };

    // chosen region climate
    function chosen_region_climate(begin, end, name, order) {
        // line chart climate year
        $.ajax({
            url: "/region_climate_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_explore_${order}`, data, {});
                $(`#climate_exp_${order}`).html(`Number case of  ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // chosen region month
        $.ajax({
            url: "/region_climate_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_explore_month_${order}`, data, {});
                $(`#climate_exp_month_${order}`).html(`Number case of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // seasonal analyst
        $.ajax({
            url: "/region_seasonal_climate",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`seasonal_climate_${order}`, data, {});
                $(`#seasonal_analyst_exp_${order}`).html(`Seasonal of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // lag correlation
        $.ajax({
            url: "/lag_region_climate",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`lag_chart_climate_${order}`, data, {});
                $(`#lag_climate_${order}`).html(`Lag correlation of ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
        // line region
        $.ajax({
            url: "/region_date1_climate_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_date1_exp_${order}`, data, {});
                $(`#title_date1_exp1_${order}`).html(`Number case of  ${name.split('_').join('  ')} by monthly mean  ${begin}-${end}`);
            },
        });
    };

    function run_region_climate(climate_exp_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(climate_exp_array, function (index, value) {
            i++;
            chosen_region_climate(begin, end, value, i);
        });
    };

    // check exist data in map Viet Nam
    function exist_data(id) {
        // id data province
        var id_data = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6,
            1, 10, 2, 17, 12, 19, 22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56,
            42, 43, 61, 35, 41, 37, 55, 34, 57, 48, 36, 59, 60, 52, 62, 46, 39,
            63, 51, 64, 54];
        if ((id_data.includes(parseInt(id))) == false) {
            $.confirm({
                title: "Explore Province",
                content: "Data not exist.Please choose another province!",
                buttons: {
                    ok: {
                        btnClas: "btn-primary",
                    },
                    cancel: {
                        btnClass: "btn-danger",
                    },
                },
            });
            return false;
        }
        ;
    };
    // ajax to get data result next map
    getData(province_code);

    function getData(id) {
        var begin = $(".begin").val();
        var end = $(".end").val();
        $.ajax({
            type: "GET",
            url: "/explore_response/" + id,
            data: {
                begin: begin,
                end: end,
            },
            success: function (response) {
                $(".showresult").html(response.data);

            },

            error: function (response) {
                console.log(response);
            }
        });
    };
    // get province code climate
    getData_Climate(province_code);

    function getData_Climate(id) {
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.ajax({
            type: "GET",
            url: "/exp_climate_response/" + id,
            success: function (response) {
                $(".showresult_climate").html(response.data);

            },
            data: {
                begin: begin,
                end: end,
            },
            error: function (response) {
                console.log(response);
            }
        });
    };

    // get region disease
    function getData_region(id) {
        var begin = $(".begin").val();
        var end = $(".end").val();
        $.ajax({
            type: "GET",
            url: "/explore_response_region/" + id,
            success: function (response) {
                $(".showresult").html(response.data);

            },
            data: {
                'name': name_region,
                begin: begin,
                end: end,
            },
            error: function (response) {
                console.log(response);
            }
        });
    };

    // get region climate
    function getData_region_climate(id) {
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.ajax({
            type: "GET",
            url: "/explore_region_climate/" + id,
            success: function (response) {
                $(".showresult_climate").html(response.data);

            },
            data: {
                'name': name_region,
                begin: begin,
                end: end
            },
            error: function (response) {
                console.log(response);
            }
        });
    };
    // correlation data frame province
    var disease_climate = []
    $('.check_disease,.check_climate').click(function () {
        var begin = $(".begin").val();
        var end = $(".end").val();

        if (this.checked) {
            disease_climate.push(this.value);
            run_correlation(disease_climate);
            $('.check_region').click(function () {
                run_correlation_region(disease_climate);
            });
        } else {
            // disease_climate.pop(this.value);
            // delete disease_climate[this.value];
            var remove_Item = this.value;
            disease_climate = $.grep(disease_climate, function (value) {
                return value != remove_Item;
            });
            run_correlation(disease_climate);
            $('.check_region').click(function () {
                run_correlation_region(disease_climate);
            });
            // unchecked_disease_exp(this.value);
        }
    });

    function correlation(begin, end, name, order) {
        // create_tag_exp(order, name);
        $.ajax({
            url: "/corr_disease_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease_climate,
                begin: begin,
                end: end,
                province: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_exp_${order}`, data, {});
                $(`#title_corr_exp_${order}`).html(`Correlation of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
    }

    function run_correlation(disease_climate = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(disease_climate, function (index, value) {
            i++;
            correlation(begin, end, value, i);
        });
    };

    // correlation region
    function correlation_region(begin, end, name, order) {
        $.ajax({
            url: "/region_corr_disease_exp",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease_climate,
                begin: begin,
                end: end,
                region: region_id
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_exp_${order}`, data, {});
                $(`#title_corr_exp_${order}`).html(`Correlation of ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
    }

    // run correlation
    function run_correlation_region(disease_climate = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(disease_climate, function (index, value) {
            i++;
            correlation_region(begin, end, value, i);
        });
    };
    // title explore
    title_explore(1997, 2019);

    function title_explore(begin, end) {
        let $name = '';
        $("path").each(function (key, value) {
            $id = $(this).attr('id');
            if ($id == province_code) {
                $name = $(this).data("original-title");
            }
        })
        $('.title_explore').html(`Explore By Disease In ${$name}  ${begin}-${end}`)
    }
});
$(document).ready(function () {
    let currentURL = $(location).attr('pathname');
    if (currentURL != '/compare') {
        return false;
    }
    $('[data-toggle="tooltip"]').tooltip();
    // map prionce compare
    var province_code = 15;
    var count_click = 0;
    var count_click_once = 0;
    var count_click_twice = 0;
    var id_click_twice = 25;
    var id_click_once = 15;
    // timeseries begin and year
    $(".begin").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");
        var max = $(this).attr("max");
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
                            title_comp(min, end);
                            run_province_disease(disease_pro_array);
                            run_province_climate(climate_pro_array);
                        }
                    },
                }
            });
            return false;
        }
        title_comp(begin, end);
        run_province_disease(disease_pro_array);
        run_province_climate(climate_pro_array);
        getData_comp(id_click_once, id_click_twice);
    });
    // end year
    $(".end").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_end").text(val);
        $(".indicator_end").css("left", portion * ($(".end").width() - 18));

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
                            title_comp(min, end);
                            run_province_disease(disease_pro_array);
                            run_province_climate(climate_pro_array);
                        }
                    },
                }
            });
            return false;
        }
        title_comp(begin, end);
        run_province_disease(disease_pro_array);
        run_province_climate(climate_pro_array);
        getData_comp(id_click_once, id_click_twice);
    });

    // run disease region

    // check disease
    var disease_pro_array = [];
    $(".check_disease").click(function () {
        // check time
        var begin = $(".begin").val();
        var end = $(".end").val();

        if (this.checked) {
            disease_pro_array.push(this.value);
            if ((id_click_once == 0) & (id_click_twice == 0)) {
                alert('Please choose province want compare');
                return false;
            }
            run_province_disease(disease_pro_array);
        } else {
            disease_pro_array.pop(this.value);
            unchecked_disease_pro(this.value);
        }
        ;
    });

    // check climate
    var climate_pro_array = [];
    $(".check_climate").click(function () {
        // check time
        var begin = $(".begin").val();
        var end = $(".end").val();

        if (this.checked) {
            climate_pro_array.push(this.value);
            if ((id_click_once == 0) & (id_click_twice == 0)) {
                alert('Please choose province want compare');
                return false;
            }
            run_province_climate(climate_pro_array);
        } else {
            climate_pro_array.pop(this.value);
            unchecked_climate_pro(this.value);
        }
        ;
    });
    $("path").click(function (event) {
        count_click++;
        var check = $(this).data("check");
        var id = $(this).attr("id");
        // console.log(id);
        if (check == "mapvn") {
            exist_data_comp(id);
            if (count_click % 2 == 0) {
                $("path").each(function () {
                    var listid = $(this).attr("id");
                    if (listid == id) {
                        if (count_click_twice == 0) {
                            $(`#${id}`).css("fill", "orange");
                            id_click_twice = id;
                            count_click_twice++;
                            // check exist province code
                        } else {
                            $(`#${id_click_twice}`).css("fill", "#88a4bc");
                            click_event_twice_orange(id, 0);

                        }
                    }
                });
            } else {
                $("path").each(function () {
                    // run_province_disease(disease_pro_array);
                    var listid = $(this).attr("id");
                    if (listid == id) {
                        // show chart in here
                        // end show chart in here
                        if (count_click_once == 0) {
                            $('#15').css('fill', '#88a4bc');
                            $('#25').css('fill', '#88a4bc');
                            $(`#${id}`).css("fill", " #3b729f");
                            id_click_once = id;
                            count_click_once++;
                            // check exist province code
                        } else {
                            $(`#${id_click_once}`).css("fill", "#88a4bc");
                            click_event_once_green(id, 0);
                            // check exist province code
                        }
                        ;
                    }
                    ;

                });
            }
            ;
            if (count_click == 1) {
                alert('Please choose province want compare');
                return false;
            }
            getData_comp(id_click_once, id_click_twice);
            run_province_disease(disease_pro_array);
            run_province_climate(climate_pro_array);
        }
        ;

        // function green
        function click_event_once_green(id, value_count) {
            if (value_count == 0) {
                $(`#${id}`).css("fill", " #3b729f");
                id_click_once = id;
                count_click_once++;
            }
            ;
        };
        // end function green
        // function orange
        function click_event_twice_orange(id, value_count) {
            if (value_count == 0) {
                $(`#${id}`).css("fill", "orange");
                id_click_twice = id;
                count_click_twice++;
            }
            ;
        };
        // end function orange
    });

    // create tag disease
    function create_tag_climate(order, name) {
        var html = '';
        html += `<div class="courses-area mg-b-15" id='climate_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <!-- pie chart  -->
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box">
                    <span class="box-title" id="pie_climate_year_${order}"></span>
                    <div class="pie_climate_y_${order}" id="pie_climate_y_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end pie chart  -->
            <!-- line chart year  -->
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <span class="box-title" id="climate_pro_year_${order}"></span>
                    <div id="climate_pro_y_${order}" class="climate_pro_y_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</div>
<!-- end -->
<div class="product-sales-area mg-tb-30" id='date1_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id="title_date1_comp_${order}"><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="climate_date1_comp_${order}" id="climate_date1_comp_${order}" style="height: auto;width:auto">
                    </div>
                </div>
			</div>
			<!-- end line chart year  -->
            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <span class="box-title" id="climate_pro_month_${order}"></span>
                    <div id="climate_pro_m_${order}" class="climate_pro_m_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end line chart month  -->
        </div>
    </div>
</div>

<div class="courses-area mg-b-15" id='linear_comp_climate_${name}'>
	<div class="container-fluid">
		<div class="row">
			<!-- pie chart  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box">
					<span class="box-title" id="linear_climate_year_${order}"></span>
					<div class="linear_climate_y_${order}" id="linear_climate_y_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			<!-- end pie chart  -->
			<!-- line chart year  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box res-mg-t-30 table-mg-t-pro-n">
					<span class="box-title" id="linear_title_month_${order}"></span>
					<div id="linear_climate_month_${order}" class="linear_climate_month_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			
		</div>
	</div>
</div>
<hr class="my-4" id=ruler_comp0_${name}>
`;
        $(".climate_comp").append(html);
        $(`#climate_comp_${name}, #date1_comp_${name}, #ruler_comp0_${name}, #linear_comp_climate_${name}`).each(function (i) {
            $('[id="' + this.id + '"]').slice(1).remove();
        });
    };

    // create tag climate
    function create_tag_disease(order, name) {
        var html = '';
        html += `
    <div class="courses-area mg-b-15" id='disease_comp_${name}'>
	<div class="container-fluid">
		<div class="row">
			<!-- pie chart  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box">
					<span class="box-title" id="pie_disease_year_${order}"></span>
					<div class="pie_disease_y_${order}" id="pie_disease_y_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			<!-- end pie chart  -->
			<!-- line chart year  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box res-mg-t-30 table-mg-t-pro-n">
					<span class="box-title" id="title_pro_year_${order}"></span>
					<div id="line_pro_year_${order}" class="line_pro_year_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			
		</div>
	</div>
</div>
<!-- end -->
<div class="product-sales-area mg-tb-30" id='disease_date1_comp_${name}'>
	<div class="container-fluid">
		<div class="row">
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="product-sales-chart">
					<div class="portlet-title">
						<div class="row">
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
								<div class="caption pro-sl-hd">
									<span class="caption-subject" id="title_date1_comp_disease_${order}"><b></b></span>
								</div>
							</div>
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
								<div class="actions graph-rp graph-rp-dl">

								</div>
							</div>
						</div>
					</div>
					<div class="disease_date1_comp_${order}" id="disease_date1_comp_${order}"
						style="height: auto;width:auto">
					</div>
				</div>
			</div>
			<!-- end line chart year  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box res-mg-t-30 table-mg-t-pro-n">
					<span class="box-title" id="title_pro_month_${order}"></span>
					<div id="line_pro_month_${order}" class="line_pro_month_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			<!-- end line chart month  -->
		</div>
	</div>
</div>
<div class="courses-area mg-b-15" id='linear_comp_${name}'>
	<div class="container-fluid">
		<div class="row">
			<!-- pie chart  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box">
					<span class="box-title" id="linear_disease_year_${order}"></span>
					<div class="linear_disease_y_${order}" id="linear_disease_y_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			<!-- end pie chart  -->
			<!-- line chart year  -->
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="white-box res-mg-t-30 table-mg-t-pro-n">
					<span class="box-title" id="linear_title_year_${order}"></span>
					<div id="linear_pro_month_${order}" class="linear_pro_month_${order}" style="width:auto;height:auto">
						<!-- chart in here  -->
					</div>
				</div>
			</div>
			
		</div>
	</div>
</div>
<hr class="my-4" id=ruler_comp_${name}>
`;
        $(`.disease_comp`).append(html);
        $(`#disease_comp_${name}, #disease_date1_comp_${name}, #ruler_comp_${name}, #linear_comp_${name}`).each(function (i) {
            $('[id="' + this.id + '"]').slice(1).remove();
        });
    };

    // choosen province disease
    function chosen_province_disease(begin, end, name, order) {
        // pie chart year
        create_tag_disease(order, name);
        $.ajax({
            url: "/pie_disease_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`pie_disease_y_${order}`, data, {});
                $(`#pie_disease_year_${order}`).html(`Number case of ${name.split('_').join('  ')} 
        by yearly mean  ${begin}-${end}`);
            },
        });
        // line year disease
        $.ajax({
            url: "/compare_province",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_pro_year_${order}`, data, {});
                $(`#title_pro_year_${order}`).html(`Number case of  ${name.split('_').join('  ')} by yearly mean  ${begin}-${end}`);
            },
        });
        // line month disease
        $.ajax({
            url: "/compare_pro_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`line_pro_month_${order}`, data, {});
                $(`#title_pro_month_${order}`).html(`Number of  ${name.split('_').join('  ')} monthly mean  ${begin}-${end}`);
            },
        });
        // disease_date1_comp_${order}
        $.ajax({
            url: "/comp_date1_disease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`disease_date1_comp_${order}`, data, {});
                $(`#title_date1_comp_disease_${order}`).html(`Number case of  ${name.split('_').join('  ')} 
        by monthly mean  ${begin}-${end}`);
            },
        });
        // linear disease year
        $.ajax({
            url: "/linear_comp_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`linear_disease_y_${order}`, data, {});
                $(`#linear_disease_year_${order}`).html(`Linear of ${name.split('_').join('  ')} by yearly mean ${begin}-${end}`);
            },
        });
        // linear disease month
        $.ajax({
            url: "/linear_comp_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`linear_pro_month_${order}`, data, {});
                $(`#linear_title_year_${order}`).html(`Linear of ${name.split('_').join('  ')} 
        by monthly mean  ${begin}-${end}`);
            },
        });

    };

    // uncheck disease
    function unchecked_disease_pro(name) {
        $(`#disease_comp_${name}`).remove();
        $(`#disease_date1_comp_${name}`).remove();
        $(`#linear_comp_${name}`).remove();
        $(`#ruler_comp_${name}`).attr('class', 'my-4 hidden');
    };

    // run disease
    function run_province_disease(disease_pro_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(disease_pro_array, function (index, value) {
            i++;
            chosen_province_disease(begin, end, value, i);
        });
    };

    // choose province climate
    function chosen_province_climate(begin, end, name, order) {
        create_tag_climate(order, name);
        // pie chart year climate
        $.ajax({
            url: "/pie_climate_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`pie_climate_y_${order}`, data, {});
                $(`#pie_climate_year_${order}`).html(`Number of ${name.split('_').join('  ')} 
        by yearly mean  ${begin}-${end}`);
            },
        });
        // line year climate
        $.ajax({
            url: "/compare_pro_climate",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_pro_y_${order}`, data, {});
                $(`#climate_pro_year_${order}`).html(`Number of ${name.split('_').join('  ')} 
        by yearly mean  ${begin}-${end}`);
            },
        });
        // line month climate
        $.ajax({
            url: "/compare_pro_climate_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_pro_m_${order}`, data, {});
                $(`#climate_pro_month_${order}`).html(`Number of ${name.split('_').join('  ')} 
        by monthly mean  ${begin}-${end}`);
            },
        });
        // date1 climate
        // line month climate
        $.ajax({
            url: "/comp_date1_climate",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`climate_date1_comp_${order}`, data, {});
                $(`#title_date1_comp_${order}`).html(`Number of ${name.split('_').join('  ')} monthly mean 
         ${begin}-${end}`);
            },
        });
        // linear year climate
        $.ajax({
            url: "/linear_climate_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`linear_climate_y_${order}`, data, {});
                $(`#linear_climate_year_${order}`).html(`Linear of ${name.split('_').join('  ')} 
        by yearly mean  ${begin}-${end}`);
            },
        });
        // linear_climate_month
        $.ajax({
            url: "/linear_climate_month",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                climate: name,
                begin: begin,
                end: end,
                province1: id_click_once,
                province2: id_click_twice,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`linear_climate_month_${order}`, data, {});
                $(`#linear_title_month_${order}`).html(`Linear of ${name.split('_').join('  ')} 
        by monthly mean  ${begin}-${end}`);
            },
        });
    };

    // uncheck climate
    function unchecked_climate_pro(name) {
        $(`#climate_comp_${name}`).remove();
        $(`#date1_comp_${name}`).remove();
        $(`#linear_comp_climate_${name}`).remove();
        $(`#ruler_comp0_${name}`).attr('class', 'my-4 hidden');
    };

    // run province climate
    function run_province_climate(climate_pro_array = []) {
        var i = 0;
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.each(climate_pro_array, function (index, value) {
            i++;
            chosen_province_climate(begin, end, value, i);
        });
    };
    // end choose province climate
    // check exist data in map Viet Nam
    function exist_data_comp(id,) {
        // id data province
        var id_data = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6,
            1, 10, 2, 17, 12, 19, 22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56,
            42, 43, 61, 35, 41, 37, 55, 34, 57, 48, 36, 59, 60, 52, 62, 46, 39,
            63, 51, 64, 54];
        if ((id_data.includes(parseInt(id))) == false) {
            $.confirm({
                title: "Compare Province",
                content: "Data not exist.Please choose another province to compare!",
                buttons: {
                    ok: {
                        btnClas: "btn-primary",
                    },
                    cancel: {
                        btnClass: "btn-danger",
                    },
                },
            });
            // $(`#${id}`).css("fill", "#ddddbb");
            return false;
        }
        ;
    };
    // ajax in here
    getData_comp(id_click_once, id_click_twice);

    function getData_comp(id, id0) {
        var begin = $(".begin").val();
        var end = $(".end").val();

        $.ajax({
            type: "GET",
            url: "/popu_response/" + id + '/' + id0,
            success: function (response) {
                $(".showresult_popu").html(response.data);

            },
            data: {
                begin: begin,
                end: end,
            },
            error: function (response) {
                console.log(response);
            }
        });
    };
    title_comp(1997, 2019);

    function title_comp(begin, end) {
        $('.title_comp').html(`Compare By Disease  Province In Viet Nam  ${begin}-${end}`)
    }

    $('.min_max').html(`(${begin}-${end})`)
});

$(document).ready(function () {
    // get url
    let currentURL = $(location).attr('pathname');
    if (currentURL != '/factor') {
        return false;
    }
    let province_code = '15';
    let begin = '1997'
    let end = '2019'
    let name = 'Lai Châu';
    $(".search_pro").change(function (event) {
        province_code = $('#province').val();
        name = $(this).find(':selected').attr('data-target');
        // call fuction
        title_factor(begin, end);
        chart_subplotly(disease);
    });
    // begin
    $(".begin").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");

        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_begin").text(val);
        $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
        // correlation
        begin = $(".begin").val();
        end = $(".end").val();
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
                            title_factor(min, end);
                            chart_subplotly(disease);
                        }
                    },
                }
            });
            return false;
        }
        title_factor(begin, end);
        chart_subplotly(disease);

    });
    // end
    $(".end").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");
        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_end").text(val);
        $(".indicator_end").css("left", portion * ($(".end").width() - 18));

        begin = $(".begin").val();
        end = $(".end").val();
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
                            title_factor(min, end);
                            chart_subplotly(disease);
                        }
                    },
                }
            });
            return false;
        }
        title_factor(begin, end);
        chart_subplotly(disease);
    });
    // province
    // select province code

    // disease
    var disease = 'influenza'
    $('.disease_select')[0].checked = true;

    $('.disease_select').click(function () {
        if (this.checked) {
            disease = $(this).val().toLowerCase();
            chart_subplotly(disease);
        }
    });
    // year and month 
    var year_month = 'year'
    $('.radioBtnClass').click(function () {
        if (this.checked) {
            year_month = $(this).val();
        }
        chart_subplotly(disease);
    });

    function chart_subplotly(disease) {
        // check time 
        var begin = $(".begin").val();
        var end = $(".end").val();
        // subplotly year
        $.ajax({
            url: "/subplotly_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease,
                begin: begin,
                end: end,
                y_m: year_month,
                code: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`subplotly_y`, data, {});
                $(`#sub_title_year`).html(`Compare  ${disease.split('_').join('  ')} with climate by 
                ${year_month}ly mean Viet Nam 
                 ${begin}-${end}`);

            },
        })
        // corr_factor
        $.ajax({
            url: "/corr_factor",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease,
                begin: begin,
                end: end,
                code: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_compare`, data, {});
                $(`#sub_corr_title`).html(`Correlation of ${disease.split('_').join('  ')} yearly mean Viet Nam  ${begin}-${end}`);
            },
        });
        // chart compare disease 
        $.ajax({
            url: "/compare_disease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                disease: disease,
                begin: begin,
                end: end,
                code: province_code
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`comp_disease`, data, {});
                $(`#comp_disease_title`).html(`Incidence and death of ${disease.split('_').join('  ')} by monthly mean Viet Nam  ${begin}-${end}`);

            },
        });
    };
    chart_subplotly(disease);

    title_factor(1997, 2019);

    function title_factor(begin, end) {
        $('.title_factor').html(` Explore By Disease  In ${name}  ${begin}-${end}`)
    }

});
$(document).ready(function () {
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/prediction') {
    return false;
  }

  let province_code = 15;
  $(`.option_${province_code}`).attr('selected', 'selected');
  // form search
  $(".search_province").change(function (event) {
    province_code = $('#province').val();
    var begin = $(".begin").val();
    var end = $(".end").val();
    // getData(disease_climate_array, begin, end, province_code);
    // getDataInfo(disease_climate_array, begin, end, province_code);
    // getcorrFeature(disease_climate_array, begin, end, province_code);
    // linear_model(disease_array, climate_array, begin, end, province_code);
    get_model(disease_array, begin, end, province_code);
    // get_linear(disease_array,begin,end,province_code);
    // get_info_model(disease_array,begin,end,province_code);
  });
  // selection option 
  var number = ''
  // predict 
  $(".algorithm").change(function (event) {
    number = $("#algorithm").val()
  });
  $(".predict_data").click(function (event) {
    number = $("#algorithm option:selected").val();

    if (number == 0) {
      console.log(number);
      $('.predict_data').attr('data-target', '#exampleModal');
      create_modal_regression();
    }
    if (number == 1) {
      console.log(number);
      $('.predict_data').attr('data-target', '#exampleSarima');
      create_modal_sarima();
    }
  });
  // create modal linear regression 
  function create_modal_regression() {
    var html = ``
    html += `<div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">LinearRegression</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- form to predict  -->
          <form id='form_regression'>
            <!-- Vaporation  -->
            <div class="form-group">
              <label for="recipient-name" class="col-form-label">Vaporation:</label>
              <input type="text" class="form-control" id="recipient-Vaporation">
            </div>
            <!-- Temperature  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Temperature:</label>
              <input type="text" class="form-control" id="recipient-Temperature">
            </div>
            <!-- Rain  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Rain:</label>
              <input type="text" class="form-control" id="recipient-Rain">
            </div>
            <!-- humidity  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Humidity:</label>
              <input type="text" class="form-control" id="recipient-Humidity">
            </div>
            <!-- sun hour  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Sun hour:</label>
              <input type="text" class="form-control" id="recipient-Sun_hour">
            </div>
            <!-- Date  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Date:</label>
              <input type="date" class="form-control" id="recipient-Date">
            </div>
            <button type="submit" class="btn btn-primary submit">Submit</button>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary process">Save Change</button>
        </div>
      </div>
    </div>
  </div>`;
    $('.modal_regression').append(html);
    $('.process').click(function () {

      form_regression();

    });
  }
  // create modal SARIMA 
  function create_modal_sarima() {
    var html = ``
    html += `<div class="modal" id="exampleSarima" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">SARIMA</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <!-- form to predict  -->
          <form>
            <!-- Vaporation  -->
            <div class="form-group">
              <label for="recipient-name" class="col-form-label">Vaporation:</label>
              <input type="text" class="form-control" id="recipient-Vaporation">
            </div>
            <!-- Temperature  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Temperature:</label>
              <input type="text" class="form-control" id="recipient-Temperature">
            </div>
            <!-- Rain  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Rain:</label>
              <input type="text" class="form-control" id="recipient-Rain">
            </div>
            <!-- Date  -->
            <div class="form-group">
              <label for="message-text" class="col-form-label">Date:</label>
              <input type="date" class="form-control" id="recipient-Date">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Process</button>
        </div>
      </div>
    </div>
    </div>`
    $('.modal_sarima').append(html)
  }
  // processing form 
  function form_regression() {
    $('#form_regression').on('submit', function (event) {
      event.preventDefault();
      $.ajax({
        url: "/predict",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: 'JSON',
        data: $('form').serialize(),
        success: function (res) {
          $('.result_model').html(res.prediction_text);
        },
        error: function (res) {
          console.log(res);
        }
      });
    });

  }
  //  add para 
  // var html = ''
  // $('.add_para').click(function () {

  //   html += `
  //     <li>
  //         <label for="check_p">p:</label>
  //         <input type="number" id="check_p" name="check_p" min="0" max="10" value='0'>
  //     </li>
  //     <li>
  //         <label for="check_p">d:</label>
  //         <input type="number" id="check_d" name="check_d" min="0" max="10" value='0'>
  //     </li>
  //     <li>
  //         <label for="check_q">q:</label>
  //         <input type="number" id="check_q" name="check_q" min="0" max="10" value='0'>
  //     </li>
  //     <li>
  //       <label for="check_p">Time steps:</label>
  //       <input type="number" id="check_time" name="check_time" min="1" max="365" value='0'>
  //     </li>`
  //   $('.paramater').append(html);
  // })
});