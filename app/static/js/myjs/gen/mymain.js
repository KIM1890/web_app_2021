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
    var portion = (val - min) / (max - min);
    console.log(portion);
    $(".indicator_begin").text(val);
    $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
    run_desease_array(desease_array);
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
    run_desease_array(desease_array);
    run_climate_array(climate_array);
    get_data_home();
  });
  // check nhieu loai benh
  var desease_array = [];
  $(".check_desease").click(function () {
    if (this.checked) {
      desease_array.push(this.value);
      console.log(desease_array);
      run_desease_array(desease_array);
    } else {
      unchecked_desease(this.value);
      desease_array.pop(this.value);
    }
  });
  // check nhieu yeu to
  var climate_array = [];
  $(".check_climate").click(function () {
    if (this.checked) {
      climate_array.push(this.value);
      console.log(climate_array);
      run_climate_array(climate_array);
    } else {
      unchecked_climate(this.value);
      climate_array.pop(this.value);
    }
  });
  // on click desease
  function run_desease_array(desease_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    console.log(begin, ' ', end);
    $.each(desease_array, function (index, value) {
      i++;
      chart_desease(begin, end, value, i);
    })
  }
  // run nhieu yeu to moi truong
  function run_climate_array(climate_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(climate_array, function (index, value) {
      i++;
      chart_climate(begin, end, value, i);
    })
  }
  // request to get feature.csv data climate
  function chart_climate(begin, end, name, order) {
    if (begin >= end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year small than end year",
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
        $(`#climate_line_${order}`).html(`Line plot: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
        $(`#climate_${order}`).html(`Heatmap Viet Nam: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#title_climate_home_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
      },
    });
    create_tag_chart_climate(order, name);
  }

  // request to get feature.csv data desease
  function chart_desease(begin, end, name, order) {
    if (begin >= end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year small than end year",
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
    create_tag_chart_desease(order, name);
    $.ajax({
      url: "/line_chart_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_desease_${order}`, data, {});
        $(`#desease_line_${order}`).html(`Line plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // heatmap Viet Nam
    // ajax heatmap desease
    $.ajax({
      url: "/heatmap_vn",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmapvn_${order}`, data, {});
        $(`#desease_${order}`).html(`Heatmap Viet Nam: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // line chart population
    $.ajax({
      url: "/line_chart_population",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        // desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_pop_${order}`, data, {});
        $(`#pop_line_${order}`).html(`Line plot: population from ${begin}-${end}`);
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
        $(`#pop_${order}`).html(`Heatmap Viet Nam:population from ${begin}-${end}`);
      },
    });
    //   ajax case/population
    $.ajax({
      url: "/heatmap_ratio",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`heatmap_ratio_${order}`, data, {});
        $(`#ratio_${order}`).html(`Ratio ${name.replace('_', ' ')}/Population  from ${begin}-${end}`);
      },
    });
    // ratio case/population
    // line_chart_ratio
    $.ajax({
      url: "/line_chart_ratio",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_ratio_${order}`, data, {});
        $(`#ratio_line_${order}`).html(`Line plot:ratio ${name.replace('_', ' ')}/population  from ${begin}-${end}`);
      },
    });
    // /date1_home_desease
    $.ajax({
      url: "/date1_home_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`linechart_date1_${order}`, data, {});
        $(`#title_date1_home_${order}`).html(`Line plot: ${name.replace('_', ' ')} from ${begin}-${end}`);
      },
    });
  };
  // create tag in summary data
  function create_tag_chart_desease(order, name) {
    var html = '';
    html += `<div class="product-sales-area mg-tb-30" id=desease_${name}>
    <div class="container-fluid">
        <!-- chart in here  -->
        <div class="row">
            <!-- col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" id=trash_${name}>
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=desease_line_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a  class='trash_delete' href='#'>
                                        <i class="fa fa-trash" id='trash'></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id="linechart_desease_${order}" class="linechart_desease_${order}"
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
                                    <span class="caption-subject" id=desease_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                    <div class="dropdown no-arrow">
                                        <a class="dropdown-toggle" role="button" id="dropdownMenuLink"
                                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
<div class="product-sales-area mg-tb-30" id=desease_date1_home_${name}>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                            <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
<!--  chart  desease2-->
<div class="library-book-area mg-t-30" id=heatmapdesease_${name}>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                        <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                        <i class="fa fa-trash"></i>
                                        </a>

                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
<!-- chart desease 3  -->
<div class="product-sales-area mg-tb-30" id=desease_heatmap_${name}>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                        <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                        <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='3'
                                                data-desease="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='0'
                                                data-desease="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='1'
                                                data-desease="${name}">Central</a>
                                            <br>
                                            <a class="dropdown-item click_desease_region_${order}" data-value='2'
                                                data-desease="${name}">South</a>
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
</div>`;
    $(".desease_chart").append(html);
    // remove dupplicate
    $(`#desease_${name},#heatmapdesease_${name},#desease_heatmap_${name},#desease_date1_home_${name}`).each(function (i) {
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#">
                                          <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                data-climate="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                data-climate="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                data-climate="${name}">Central</a>
                                            <br>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#" >
                                          <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                data-climate="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                data-climate="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                data-climate="${name}">Central</a>
                                            <br>
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
                                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                                        </a>
                                        <a href="#" >
                                          <i class="fa fa-trash"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                                            aria-labelledby="dropdownMenuLink">
                                            <div class="dropdown-header">Region Viet Nam</div>
                                            <hr>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='3'
                                                data-climate="${name}">Viet Nam</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='0'
                                                data-climate="${name}">North</a>
                                            <br>
                                            <a class="dropdown-item click_climate_region_${order}" data-value='1'
                                                data-climate="${name}">Central</a>
                                            <br>
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
</div>`;
    $(".climate_chart").append(html);
    // remove dupplicate class
    $(`#climate_${name},#climate_date1_home_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
    chosen_region_climate(order);
  };
  // create function to delete then uncheckbox
  function unchecked_desease(name) {
    // var name = desease_array.pop(this.value);
    $(`#desease_${name}`).remove();
    $(`#heatmapdesease_${name}`).remove();
    $(`#desease_heatmap_${name}`).remove();
    $(`#desease_date1_home_${name}`).remove();
  };
  // create function delete climate then uncheckbox
  function unchecked_climate(name) {
    $(`#climate_${name}`).remove();
    $(`#climate_date1_home_${name}`).remove();
  };
  // tag a href
  function chosen_region(order) {
    $(`.click_desease_region_${order}`).click(function () {
      var region = $(this).data('value');
      var name = $(this).data('desease');
      var begin = $(".begin").val();
      var end = $(".end").val();
      // line chart region desease
      $.ajax({
        url: "/line_chart_region_desease",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          desease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_desease_${order}`, data, {});
          $(`#desease_line_${order}`).html(`Line plot: ${name.replace('_', ' ')} case  from ${begin}-${end}`);
        },
      });
      // heatmap region desease
      $.ajax({
        url: "/heatmap_vn_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          desease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmapvn_${order}`, data, {});
          $(`#desease_${order}`).html(`Heatmap Viet Nam: ${name.replace('_', ' ')} case  from ${begin}-${end}`);
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
          $(`#pop_${order}`).html(`Heatmap Viet Nam: population from ${begin}-${end}`);
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
          $(`#pop_line_${order}`).html(`Line plot:population from ${begin}-${end}`);
        },
      });
      // heatmap radio
      $.ajax({
        url: "/heatmap_radio_region",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          region: region,
          desease: name,
          begin: begin,
          end: end,
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`heatmap_ratio_${order}`, data, {});
          $(`#ratio_${order}`).html(`Heatmap Viet Nam:ratio ${name}/population from ${begin}-${end}`);
        },
      });
      // line_chart_ratio
      $.ajax({
        url: "/chart_region_ratio",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          desease: name,
          begin: begin,
          end: end,
          region: region
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_ratio_${order}`, data, {});
          $(`#ratio_line_${order}`).html(`Line plot:ratio ${name.replace('_', ' ')}/population  from ${begin}-${end}`);
        },
      });
      // /region_date1_desease_home
      $.ajax({
        url: "/region_date1_desease_home",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
          desease: name,
          begin: begin,
          end: end,
          region: region
        },
        dataType: "json",
        success: function (data) {
          Plotly.newPlot(`linechart_date1_${order}`, data, {});
          $(`#title_date1_home_${order}`).html(`Line plot: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
          $(`#climate_line_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
        },
      });
      // heatmap region desease
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
          $(`#climate_${order}`).html(`Heatmap Viet Nam: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
          $(`#title_climate_home_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
        },
      });
    });
  };
  // response in here 
  // showresult_home
  // get region climate 
  get_data_home()
  function get_data_home() {
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      console.log('test');
      $.confirm({
        title: "Notification",
        content: "Please chose begin year smaller than end year!",
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
    $.ajax({
      type: "GET",
      url: "/summary_response",
      success: function (response) {
        $(".showresult_home").html(response.data);

      },
      data: {
        // 'name': $('.check_region').text(),
        begin: begin,
        end: end
      },
      error: function (response) {
        console.log(response);
      }
    });
  };
  // process button delete 
  $(".trash_delete").click(function(){
    alert('trash');
  });
});

$(document).ready(function () {
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/explore') {
    return false;
  }
  
  // tooltip
  $('[data-toggle="tooltip"]').tooltip();
  // $('[data-toggle="tooltip"]').hover(function(){
  //   $('[data-toggle="tooltip"]').modal({
  //       show:true
  //   });
  // });
  // timeseries begin and year
  $(".begin").on("input", function () {
    var val = $(this).val();
    var min = $(this).attr("min");

    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_begin").text(val);
    $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
    run_desease_explore(desease_exp_array);
    run_climate_explore(climate_exp_array);
    // process in here
    run_region_desease(desease_exp_array);
    run_region_climate(climate_exp_array);
    // response data
    getData(province_code);
    getData_Climate(province_code);
    getData_region(province_code);
    getData_region_climate(province_code);
    // console.log(province_code);
  });
  // end year
  $(".end").on("input", function () {
    var val = $(this).val();
    var min = $(this).attr("min");

    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_end").text(val);
    $(".indicator_end").css("left", portion * ($(".end").width() - 18));
    run_desease_explore(desease_exp_array);
    run_climate_explore(climate_exp_array);
    run_region_desease(desease_exp_array);
    run_region_climate(climate_exp_array);
    getData(province_code);
    getData_Climate(province_code);
    getData_region(province_code);
    getData_region_climate(province_code);
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
    run_desease_explore(desease_exp_array);
    run_climate_explore(climate_exp_array);
    getData(province_code);
    getData_Climate(province_code);
  });
  // end search
  // double click
  $("path").click(function (event) {
    $("#province option:selected").text("Choose Province...");
    var id = $(this).attr("id");
    // var name = $(this).title();
    // console.log(name);
    province_code = id;
    // kiem tra xem check map nao
    exist_data(id);
    var check = $(this).data("check");
    if (check == "mvn") {
      // co the click chon tung tinh
      run_desease_explore(desease_exp_array);
      run_climate_explore(climate_exp_array);
      getData(id);
      getData_Climate(id);
      $("path").each(function () {
        var listid = $(this).attr("id");
        if (listid == id) {
          $(`#${id}`).css("fill", "#3b729f");
        } else {
          $(`#${listid}`).removeClass().css("fill", "#88a4bc");
        }
      });
    };
  });
  // select region in Viet Nam with map
  var region_id = "3";

  $(".check_region").click(function (envet) {
    var region = $(this).data('value');
    region_id = region;
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
      run_region_desease(desease_exp_array);
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
      run_region_desease(desease_exp_array);
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
      run_region_desease(desease_exp_array);
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
  var desease_exp_array = [];
  $(".check_desease").click(function () {
    if (this.checked) {
      desease_exp_array.push(this.value);
      run_desease_explore(desease_exp_array);
      run_region_desease(desease_exp_array);

    } else {
      desease_exp_array.pop(this.value);
      unchecked_desease_exp(this.value);
    }
  });
  // check nhieu yeu to
  var climate_exp_array = [];
  $(".check_climate").click(function () {
    if (this.checked) {
      climate_exp_array.push(this.value);
      run_climate_explore(climate_exp_array);
      run_region_climate(climate_exp_array);
    } else {
      climate_exp_array.pop(this.value);
      unchecked_climate_exp(this.value);
    }
  });
  // desease
  function run_desease_explore(desease_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(desease_array, function (index, value) {
      i++;
      chart_desease_explore(begin, end, value, i);
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
  function chart_desease_explore(begin, end, name, order) {
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year bigger than end year!",
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
    create_tag_exp(order, name)
    // lag correlation
    $.ajax({
      url: "/lag_correlation",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`lag_province_${order}`, data, {});
        $(`#lag_explore_${order}`).html(`Lag plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // desease year province
    $.ajax({
      url: "/line_province_desease_year",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_province_${order}`, data, {});
        $(`#desease_explore_${order}`).html(`Line plot year: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // desease month province
    $.ajax({
      url: "/line_province_desease_month",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_province_month_${order}`, data, {});
        $(`#desease_exp_month_${order}`).html(`Line plot month: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // seasonal analyst
    $.ajax({
      url: "/seasonal_desease_exp",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`seasonal_desease_${order}`, data, {});
        $(`#seasonal_${order}`).html(`Seasonal Plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // correlation 
    $.ajax({
      url: "/corr_desease_exp",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`corr_exp_${order}`, data, {});
        $(`#title_corr_exp_${order}`).html(`Correlation: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // date1 line chart 
    $.ajax({
      url: "/line_date1_exp",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province: province_code
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`date1_desease_${order}`, data, {});
        $(`#title_date1_${order}`).html(`Line plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
  };
  // chart climate
  function chart_climate_explore(begin, end, name, order) {
    if (begin >= end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year bigger than end year",
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
        $(`#climate_exp_${order}`).html(`Line plot: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
        $(`#climate_exp_month_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#seasonal_analyst_exp_${order}`).html(`Seasonal Plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#lag_climate_${order}`).html(`Lag plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#title_date1_exp1_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
      },
    });
    create_tag_climate_exp(order, name);
  }
  // use function
  function create_tag_exp(order, name) {
    var html = '';
    html += ` <div class="product-sales-area mg-tb-30" id=desease_exp0_${name}>
    <div class="container-fluid">
        <!-- chart in here  -->
        <div class="row">
            <!-- col 1  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" id="desease_exp_${name}">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=desease_explore_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id=line_province_${order} class=line_province_${order} style="height: auto;width:auto"></div>
                </div>
            </div>
            <!-- col 2  -->
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id=desease_exp_month_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                <i class="fa fa-trash"></i>
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
<!--  chart  desease2-->
<div class="product-sales-area mg-tb-30" id=desease_exp1_${name}>
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
                                    <span class="caption-subject" id=seasonal_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id=seasonal_desease_${order} class=seasonal_desease_${order} style="height: auto;width:auto">
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
                                    <span class="caption-subject" id=lag_explore_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div class="lag_province_${order}" id=lag_province_${order} style="height: auto;width:auto"></div>
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
            <!-- begin col 1  -->
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
                                <i class="fa fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- chart in here -->
                    <div id=date1_desease_${order} class=date1_desease_${order} style="height: auto;width:auto">
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
                                    <span class="caption-subject" id=title_corr_exp_${order}><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">
                                <i class="fa fa-trash"></i>
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
<!-- end date1  -->`
    $(".desease_exp").append(html);
    $(`#desease_exp0_${name},#desease_exp1_${name},#date1_exp_${name}`).each(function (i) {
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
                                    <i class="fa fa-trash"></i>
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
                                    <i class="fa fa-trash"></i>
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
    <!--  chart  desease2-->
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
                                    <i class="fa fa-trash"></i>
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
                                    <i class="fa fa-trash"></i>
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
                                    <i class="fa fa-trash"></i>
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
    </div>`
    $(".climate_exp").append(html);
    $(`#climate_exp0_${name},#climate_exp1_${name},#line_date1_exp1_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  }
  // uncheck desease
  function unchecked_desease_exp(name) {
    // $(`#desease_exp_${name}`).remove();
    $(`#desease_exp0_${name}`).remove();
    $(`#desease_exp1_${name}`).remove();
    $(`#date1_exp_${name}`).remove();
  }
  // uncheck climate
  function unchecked_climate_exp(name) {
    $(`#climate_exp0_${name}`).remove();
    $(`#climate_exp1_${name}`).remove();
    $(`#line_date1_exp1_${name}`).remove();
  }
  // chosen_region_desease('Influenza');
  function chosen_region_desease(begin, end, name, order) {
    // line year desease
    $.ajax({
      url: "/region_desease_year",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_province_${order}`, data, {});
        $(`#desease_explore_${order}`).html(`Line plot year: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // line month desease
    $.ajax({
      url: "/region_desease_month",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_province_month_${order}`, data, {});
        $(`#desease_exp_month_${order}`).html(`Line plot month: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // seasonal analyst
    $.ajax({
      url: "/region_seasonal_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`seasonal_desease_${order}`, data, {});
        $(`#seasonal_${order}`).html(`Seasonal Plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // lag desease region get tag province
    $.ajax({
      url: "/lag_region_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`lag_province_${order}`, data, {});
        $(`#lag_explore_${order}`).html(`Lag plot:${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // line chart date1 
    $.ajax({
      url: "/date1_region_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`date1_desease_${order}`, data, {});
        $(`#title_date1_${order}`).html(`Line plot year: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // correlation date1 
    $.ajax({
      url: "/region_corr_desease_exp",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        region: region_id
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`corr_exp_${order}`, data, {});
        $(`#title_corr_exp_${order}`).html(`Line plot year: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
  };
  // run desease region
  function run_region_desease(desease_exp_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(desease_exp_array, function (index, value) {
      i++;
      chosen_region_desease(begin, end, value, i);
    });
  };
  // chosen region climate
  function chosen_region_climate(begin, end, name, order) {
    if (begin >= end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year < end year",
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
        $(`#climate_exp_${order}`).html(`Line plot year: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
        $(`#climate_exp_month_${order}`).html(`Line plot month: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#seasonal_analyst_exp_${order}`).html(`Seasonal Plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#lag_climate_${order}`).html(`Lag plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#title_date1_exp1_${order}`).html(`Line plot: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
    };
  };
  // ajax to get data result next map
  getData(province_code);
  function getData(id) {
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year smaller than end year!",
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
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year smaller than end year!",
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
  // get region desease 
  function getData_region(id) {
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year smaller than end year!",
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
    $.ajax({
      type: "GET",
      url: "/explore_response_region/" + id,
      success: function (response) {
        $(".showresult").html(response.data);

      },
      data: {
        'name': $('.check_region').text(),
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
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year smaller than end year!",
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
    $.ajax({
      type: "GET",
      url: "/explore_region_climate/" + id,
      success: function (response) {
        $(".showresult_climate").html(response.data);

      },
      data: {
        'name': $('.check_region').text(),
        begin: begin,
        end: end
      },
      error: function (response) {
        console.log(response);
      }
    });
  };

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
  var id_click_twice = 0;
  var id_click_once = 0;
  // timeseries begin and year
  $(".begin").on("input", function () {
    var val = $(this).val();
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_begin").text(val);
    $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
    run_province_desease(desease_pro_array);
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
    run_province_desease(desease_pro_array);
    run_province_climate(climate_pro_array);
    getData_comp(id_click_once, id_click_twice);
  });

  // run desease region

  // check desease
  var desease_pro_array = [];
  $(".check_desease").click(function () {
    if (this.checked) {
      desease_pro_array.push(this.value);
      if ((id_click_once == 0) & (id_click_twice == 0)) {
        alert('Please choose province want compare');
        return false;
      }
      run_province_desease(desease_pro_array);
    } else {
      desease_pro_array.pop(this.value);
      unchecked_desease_pro(this.value);
    };
  });

  // check climate
  var climate_pro_array = [];
  $(".check_climate").click(function () {
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
    };
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
          // run_province_desease(desease_pro_array);
          var listid = $(this).attr("id");
          // console.log(id);
          if (listid == id) {
            // show chart in here
            // end show chart in here
            if (count_click_twice == 0) {
              $(`#${id}`).css("fill", "orange");
              id_click_twice = id;
              count_click_twice++;
              // check exist province code
            } else {
              $(`#${id_click_twice}`).css("fill", "#88a4bc");
              click_event_twice_orange(id, 0);
              // check exist province code
              // exist_data_comp(id,count_click);
            }
          }
        });
      } else {
        $("path").each(function () {
          // run_province_desease(desease_pro_array);
          var listid = $(this).attr("id");
          if (listid == id) {
            // show chart in here
            // end show chart in here
            if (count_click_once == 0) {
              $(`#${id}`).css("fill", " #3b729f");
              id_click_once = id;
              count_click_once++;
              // check exist province code
            } else {
              $(`#${id_click_once}`).css("fill", "#88a4bc");
              click_event_once_green(id, 0);
              // check exist province code
            };
          };

        });
      };
      if (count_click == 1) {
        alert('Please choose province want compare');
        return false;
      }
      getData_comp(id_click_once, id_click_twice);
      run_province_desease(desease_pro_array);
      run_province_climate(climate_pro_array);
    };
    // function green
    function click_event_once_green(id, value_count) {
      if (value_count == 0) {
        $(`#${id}`).css("fill", " #3b729f");
        id_click_once = id;
        count_click_once++;
      };
    };
    // end function green
    // function orange
    function click_event_twice_orange(id, value_count) {
      if (value_count == 0) {
        $(`#${id}`).css("fill", "orange");
        id_click_twice = id;
        count_click_twice++;
      };
    };
    // end function orange
  });
  // create tag desease
  function create_tag_climate(order, name) {
    var html = '';
    html += `<div class="courses-area mg-b-15" id='climate_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <!-- pie chart  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box">
                    <h3 class="box-title" id="pie_climate_year_${order}"></h3>
                    <div class="pie_climate_y_${order}" id="pie_climate_y_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end pie chart  -->
            <!-- line chart year  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <h3 class="box-title" id="climate_pro_year_${order}"></h3>
                    <div id="climate_pro_y_${order}" class="climate_pro_y_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end line chart year  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <h3 class="box-title" id="climate_pro_month_${order}"></h3>
                    <div id="climate_pro_m_${order}" class="climate_pro_m_${order}">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end line chart month  -->
        </div>
    </div>
</div>
<!-- end -->
<div class="product-sales-area mg-tb-30" id='date1_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
        </div>
    </div>
</div>`;
    $(".climate_comp").append(html);
    $(`#climate_comp_${name},#date1_comp_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  };
  // create tag climate
  function create_tag_desease(order, name) {
    var html = '';
    html += `<div class="courses-area mg-b-15" id='desease_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <!-- pie chart  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box">
                    <h3 class="box-title" id="pie_desease_year_${order}"></h3>
                    <div class="pie_desease_y_${order}" id="pie_desease_y_${order}" style="width:auto;height:auto">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end pie chart  -->
            <!-- line chart year  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <h3 class="box-title" id="title_pro_year_${order}"></h3>
                    <div id="line_pro_year_${order}" class="line_pro_year_${order}" style="width:auto;height:auto">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end line chart year  -->
            <div class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                <div class="white-box res-mg-t-30 table-mg-t-pro-n">
                    <h3 class="box-title" id="title_pro_month_${order}"></h3>
                    <div id="line_pro_month_${order}" class="line_pro_month_${order}" style="width:auto;height:auto">
                        <!-- chart in here  -->
                    </div>
                </div>
            </div>
            <!-- end line chart month  -->
        </div>
    </div>
</div>
<!-- end -->
<div class="product-sales-area mg-tb-30" id='desease_date1_comp_${name}'>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div class="product-sales-chart">
                    <div class="portlet-title">
                        <div class="row">
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="caption pro-sl-hd">
                                    <span class="caption-subject" id="title_date1_comp_desease_${order}"><b></b></span>
                                </div>
                            </div>
                            <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <div class="actions graph-rp graph-rp-dl">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="desease_date1_comp_${order}" id="desease_date1_comp_${order}"
                        style="height: auto;width:auto">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    $(`.desease_comp`).append(html);
    $(`#desease_comp_${name},#desease_date1_comp_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  };
  // choosen province desease
  function chosen_province_desease(begin, end, name, order) {
    // pie chart year
    create_tag_desease(order, name);
    $.ajax({
      url: "/pie_desease_year",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province1: id_click_once,
        province2: id_click_twice,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`pie_desease_y_${order}`, data, {});
        $(`#pie_desease_year_${order}`).html(`Pie plot: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // line year desease
    $.ajax({
      url: "/compare_province",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province1: id_click_once,
        province2: id_click_twice,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_pro_year_${order}`, data, {});
        $(`#title_pro_year_${order}`).html(`Line plot year: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // line month desease
    $.ajax({
      url: "/compare_pro_month",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province1: id_click_once,
        province2: id_click_twice,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`line_pro_month_${order}`, data, {});
        $(`#title_pro_month_${order}`).html(`Line plot month: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
    // desease_date1_comp_${order}
    $.ajax({
      url: "/comp_date1_desease",
      type: "GET",
      contentType: "application/json;charset=UTF-8",
      data: {
        desease: name,
        begin: begin,
        end: end,
        province1: id_click_once,
        province2: id_click_twice,
      },
      dataType: "json",
      success: function (data) {
        Plotly.newPlot(`desease_date1_comp_${order}`, data, {});
        $(`#title_date1_comp_desease_${order}`).html(`Line plot year-month: ${name.replace('_', ' ')} case from ${begin}-${end}`);
      },
    });
  };

  // uncheck desease
  function unchecked_desease_pro(name) {
    $(`#desease_comp_${name}`).remove();
    $(`#desease_date1_comp_${name}`).remove();
  };
  // run desease
  function run_province_desease(desease_pro_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year < end year",
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
    $.each(desease_pro_array, function (index, value) {
      i++;
      chosen_province_desease(begin, end, value, i);
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
        $(`#pie_climate_year_${order}`).html(`Pie plot: ${name.replace('_', ' ')} from ${begin}-${end}`);
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
        $(`#climate_pro_year_${order}`).html(`Line plot year: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#climate_pro_month_${order}`).html(`Line plot month: ${name.replace('_', ' ')}  from ${begin}-${end}`);
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
        $(`#title_date1_comp_${order}`).html(`Line plot year-month: ${name.replace('_', ' ')}  from ${begin}-${end}`);
      },
    });
  };
  // uncheck climate
  function unchecked_climate_pro(name) {
    $(`#climate_comp_${name}`).remove();
    $(`#date1_comp_${name}`).remove();
  };
  // run province climate
  function run_province_climate(climate_pro_array = []) {
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year < end year",
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
    };
  };
  // ajax in here 
  getData_comp(id_click_once, id_click_twice);
  function getData_comp(id, id0) {
    var begin = $(".begin").val();
    var end = $(".end").val();
    if (begin > end) {
      $.confirm({
        title: "Notification",
        content: "Please chose begin year bigger than end year!",
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
});

$(document).ready(function () {
  // get url
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/factor'){
    return false;
  }
    // desease
    var desease = 'influenza'
    $('.desease_select').change(function (event) {
        desease = $('#desease_select').val().toLowerCase();
        console.log(desease);
        chart_subplotly(desease);

    });
    // begin
    $(".begin").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");

        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_begin").text(val);
        $(".indicator_begin").css("left", portion * ($(".begin").width() - 18));
        chart_subplotly(desease);
        $(`#sub_title`).html(`Comparation ${desease} with climate from ${begin}-${end}`);
        // correlation
        $(`#sub_corr_title`).html(`Correlation of ${name} from ${begin}-${end}`);
    });
    // end
    $(".end").on("input", function () {
        var val = $(this).val();
        var min = $(this).attr("min");

        var max = $(this).attr("max");
        var portion = (val - min) / (max - min);
        $(".indicator_end").text(val);
        $(".indicator_end").css("left", portion * ($(".end").width() - 18));
        chart_subplotly(desease);
        $(`#sub_title`).html(`Comparation ${desease} with climate from ${begin}-${end}`);
        // correlation
        $(`#sub_corr_title`).html(`Correlation of ${name} from ${begin}-${end}`);
    });
    function chart_subplotly(desease) {
        var begin = $(".begin").val();
        var end = $(".end").val();
        if (begin > end) {
            $.confirm({
                title: "Notification",
                content: "Please chose begin year < end year",
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
        // subplotly year 
        $.ajax({
            url: "/subplotly_year",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                desease: desease,
                begin: begin,
                end: end,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`subplotly_y`, data, {});
                $(`#sub_title_year`).html(`Compare plot: ${desease} with climate from ${begin}-${end}`);
            },
        })
        // ajax
        $.ajax({
            url: "/subplotly",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                desease: desease,
                begin: begin,
                end: end,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`subplotly`, data, {});
                $(`#sub_title`).html(`Compare plot: ${desease} with climate from ${begin}-${end}`);
            },
        })
        // corr_factor
        $.ajax({
            url: "/corr_factor",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                desease: desease,
                begin: begin,
                end: end,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`corr_compare`, data, {});
                $(`#sub_corr_title`).html(`Correlation of ${desease} from ${begin}-${end}`);
            },
        });
        // chart compare desease 
        $.ajax({
            url: "/compare_desease",
            type: "GET",
            contentType: "application/json;charset=UTF-8",
            data: {
                desease:desease,
                begin: begin,
                end: end,
            },
            dataType: "json",
            success: function (data) {
                Plotly.newPlot(`comp_desease`, data, {});
                $(`#comp_desease_title`).html(`Compare plot: ${desease}  from ${begin}-${end}`);
             },
        });
    };
    // default
    var begin = $(".begin").val();
    var end = $(".end").val();
    // subplotly year 
    $.ajax({
        url: "/subplotly_year",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
            desease: 'influenza',
            begin: begin,
            end: end,
        },
        dataType: "json",
        success: function (data) {
            Plotly.newPlot(`subplotly_y`, data, {});
            $(`#sub_title_year`).html(`Compare plot: ${desease} with climate from ${begin}-${end}`);
        },
    });
    // subplotly
    $.ajax({
        url: "/subplotly",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
            desease: 'influenza',
            begin: begin,
            end: end,
        },
        dataType: "json",
        success: function (data) {
            Plotly.newPlot(`subplotly`, data, {});
            $(`#sub_title`).html(`Compare plot:${desease} with climate from ${begin}-${end}`);
        },
    })
    // correlation factor
    $.ajax({
        url: "/corr_factor",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
            desease: "influenza",
            begin: begin,
            end: end,
        },
        dataType: "json",
        success: function (data) {
            Plotly.newPlot(`corr_compare`, data, {});
            $(`#sub_corr_title`).html(`Correlation of ${desease} from ${begin}-${end}`);
        },
    });
    // end document
    // chart compare desease 
    $.ajax({
        url: "/compare_desease",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        data: {
            desease:'influenza',
            begin: begin,
            end: end,
        },
        dataType: "json",
        success: function (data) {
            Plotly.newPlot(`comp_desease`, data, {});
            $(`#comp_desease_title`).html(`Compare plot: influenza from ${begin}-${end}`);
         },
    });
});
