$(document).ready(function () {
  let currentURL = $(location).attr('pathname');
  if (currentURL != '/explore') {
    return false;
  }
  // tooltip
  $('[data-toggle="tooltip"]').tooltip();
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
    }
    else if (region == 2) {
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
    $(`#disease_exp0_${name},#disease_exp1_${name},#date1_exp_${name},#ruler_exp_${name}`).each(function (i) {
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
    $(`#climate_exp0_${name},#climate_exp1_${name},#line_date1_exp1_${name},#ruler_exp0_${name}`).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  }
  // uncheck disease
  function unchecked_disease_exp(name) {
    // $(`#disease_exp_${name}`).remove();
    $(`#disease_exp0_${name}`).remove();
    $(`#disease_exp1_${name}`).remove();
    $(`#date1_exp_${name}`).remove();
    $(`#ruler_exp_${name}`).attr('class', 'my-4 hidden');;
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
    };
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
      disease_climate = $.grep(disease_climate, function(value) {
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
    $('.title_explore').html(`Explore Disease Data In Viet Nam  ${begin}-${end}`)
  }
});