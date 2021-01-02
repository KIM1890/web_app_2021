"use strict";

$(document).ready(function () {
  var currentURL = $(location).attr('pathname');

  if (currentURL != '/explore') {
    return false;
  } // tooltip


  $('[data-toggle="tooltip"]').tooltip(); // timeseries begin and year

  $(".begin").on("input", function () {
    var val = $(this).val();
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_begin").text(val);
    $(".indicator_begin").css("left", portion * ($(".begin").width() - 18)); // check time 

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
            action: function action() {
              $(".begin").val(min);
              $(".indicator_begin").text(min);
              begin = $(".begin").val();
              title_explore(begin, end);
              run_disease_explore(disease_exp_array);
              run_climate_explore(climate_exp_array); // test

              $(".check_region").click(function () {
                run_region_disease(disease_exp_array);
                run_region_climate(climate_exp_array);
              });
            }
          }
        }
      });
      return false;
    } // tittle 
    // default


    title_explore(begin, end);
    run_disease_explore(disease_exp_array);
    run_climate_explore(climate_exp_array); // process in here

    $(".check_region").click(function () {
      run_region_disease(disease_exp_array);
      run_region_climate(climate_exp_array);
    });
  }); // end year

  $(".end").on("input", function () {
    var val = $(this).val();
    var min = $(this).attr("min");
    var max = $(this).attr("max");
    var portion = (val - min) / (max - min);
    $(".indicator_end").text(val);
    $(".indicator_end").css("left", portion * ($(".end").width() - 18)); // check time 

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
            action: function action() {
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
          }
        }
      });
      return false;
    } // default


    title_explore(begin, end);
    run_disease_explore(disease_exp_array);
    run_climate_explore(climate_exp_array);
    $(".check_region").click(function () {
      run_region_disease(disease_exp_array);
      run_region_climate(climate_exp_array);
    });
  }); // form search

  var province_code = "15";
  $(".search_pro").change(function (event) {
    var province = $('#province').val();
    var code_map = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6, 1, 10, 2, 17, 12, 19, 22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56, 42, 43, 61, 35, 41, 37, 55, 34, 57, 48, 36, 59, 60, 52, 62, 46, 39, 63, 51, 64, 54];
    $.each(code_map, function (index, value) {
      if (province == value) {
        province_code = value;
        $("#".concat(province)).css("fill", "#3b729f");
      } else {
        $("#".concat(value)).css("fill", "#88a4bc");
      }
    });
    run_disease_explore(disease_exp_array);
    run_climate_explore(climate_exp_array);
    getData(province_code);
    getData_Climate(province_code);
  }); // end search
  // double click

  $("path").click(function (event) {
    $("#province option:selected").text("Choose Province...");
    var id = $(this).attr("id");
    province_code = id; // kiem tra xem check map nao

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
          $("#".concat(id)).css("fill", "#3b729f");
        } else {
          $("#".concat(listid)).removeClass().css("fill", "#88a4bc");
        }
      });
    }

    ;
  }); // select region in Viet Nam with map

  var region_id = "3";
  var name_region = '';
  $(".check_region").click(function (envet) {
    var region = $(this).data('value'); // var region_vn = $(this).data('check');

    region_id = region;
    name_region = $(this).attr('at'); // get id cua ca nuoc

    var all_id = [];
    $("path").each(function (index, value) {
      var path_id = $(this).attr("id"); // console.log($(this).attr('title'));

      all_id.push(path_id);
    });
    var list_id_north = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6, 1, 10, 2, 17, 12, 19];
    var list_id_central = [22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56, 42, 43, 61, 35, 41, 37, 55, 34];
    var list_id_south = [57, 48, 36, 59, 60, 52, 62, 46, 39, 63, 51, 64, 54];

    if (region == 0) {
      $.each(list_id_north, function (index, value) {
        get_all_id(value);
      }); // get data region

      getData_region(region_id);
      getData_region_climate(region_id); // end data region

      check_id_exits(list_id_south);
      check_id_exits(list_id_central);
      run_region_disease(disease_exp_array);
      run_region_climate(climate_exp_array);
    } else if (region == 1) {
      $.each(list_id_central, function (index, value) {
        get_all_id(value);
      }); // get region data

      getData_region(region_id);
      getData_region_climate(region_id); // end region data

      check_id_exits(list_id_north);
      check_id_exits(list_id_south);
      run_region_disease(disease_exp_array);
      run_region_climate(climate_exp_array);
    } else if (region == 2) {
      $.each(list_id_south, function (index, value) {
        get_all_id(value);
      }); // get region data

      getData_region(region_id);
      getData_region_climate(region_id); // get region data

      check_id_exits(list_id_north);
      check_id_exits(list_id_central);
      run_region_disease(disease_exp_array);
      run_region_climate(climate_exp_array);
    } else {
      $.each(all_id, function (index, value) {
        $("#".concat(value)).css("fill", "#88a4bc");
        $("#15").css("fill", "#3b729f");
      });
    }
  }); //  check_id_exits

  function check_id_exits() {
    var list_id_area = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    $.each(list_id_area, function (index, value) {
      $("#".concat(value)).removeClass().css("fill", "#88a4bc");
    });
  } // get all id


  function get_all_id(id) {
    $("path").each(function (index, value) {
      var path_id = $(this).attr("id");

      if (path_id == id) {
        $("#".concat(id)).css("fill", "#3b729f");
      }
    });
  } // check nhieu loai benh


  var disease_exp_array = []; // var disease_climate = [];

  $(".check_disease").click(function () {
    // check time 
    var begin = $(".begin").val();
    var end = $(".end").val();

    if (this.checked) {
      disease_exp_array.push(this.value); // disease_climate.push(this.value);

      run_disease_explore(disease_exp_array);
      $(".check_region").click(function () {
        run_region_disease(disease_exp_array);
      }); // run_region_disease(disease_exp_array);
    } else {
      disease_exp_array.pop(this.value); // disease_climate.pop(this.value);

      unchecked_disease_exp(this.value);
    }
  }); // check nhieu yeu to

  var climate_exp_array = [];
  $(".check_climate").click(function () {
    // check time 
    if (this.checked) {
      climate_exp_array.push(this.value); // disease_climate.push(this.value);

      run_climate_explore(climate_exp_array);
      $(".check_region").click(function () {
        run_region_climate(climate_exp_array);
      });
    } else {
      climate_exp_array.pop(this.value); // disease_climate.pop(this.value);

      unchecked_climate_exp(this.value);
    }
  }); // console.log(climate_exp_array);
  // disease

  function run_disease_explore() {
    var disease_array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(disease_array, function (index, value) {
      i++;
      chart_disease_explore(begin, end, value, i);
    });
  }

  ; // climate

  function run_climate_explore() {
    var climate_array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(climate_array, function (index, value) {
      i++;
      chart_climate_explore(begin, end, value, i);
    });
  } // chart disease 


  function chart_disease_explore(begin, end, name, order) {
    create_tag_exp(order, name); // lag correlation

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
      success: function success(data) {
        Plotly.newPlot("lag_province_".concat(order), data, {}); // split(' ').join('');

        $("#lag_explore_".concat(order)).html("Lag correlation of ".concat(name.split('_').join(' '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // disease year province

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
      success: function success(data) {
        Plotly.newPlot("line_province_".concat(order), data, {});
        $("#disease_explore_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // disease month province

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
      success: function success(data) {
        Plotly.newPlot("line_province_month_".concat(order), data, {});
        $("#disease_exp_month_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // seasonal analyst

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
      success: function success(data) {
        Plotly.newPlot("seasonal_disease_".concat(order), data, {});
        $("#seasonal_".concat(order)).html("Seasonal of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // correlation 
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
      success: function success(data) {
        Plotly.newPlot("corr_exp_".concat(order), data, {});
        $("#title_corr_exp_".concat(order)).html("Correlation of ".concat(name.split('_').join('  '), " with climate and disease by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // date1 line chart 

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
      success: function success(data) {
        Plotly.newPlot("date1_disease_".concat(order), data, {});
        $("#title_date1_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by montly mean from ").concat(begin, "-").concat(end));
      }
    });
  }

  ; // chart climate

  function chart_climate_explore(begin, end, name, order) {
    create_tag_climate_exp(order, name); // line chart climate

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
      success: function success(data) {
        Plotly.newPlot("climate_explore_".concat(order), data, {});
        $("#climate_exp_".concat(order)).html("Number case of  ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // ajax heatmap climate

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
      success: function success(data) {
        Plotly.newPlot("climate_explore_month_".concat(order), data, {});
        $("#climate_exp_month_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // seasonal analyst

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
      success: function success(data) {
        Plotly.newPlot("seasonal_climate_".concat(order), data, {});
        $("#seasonal_analyst_exp_".concat(order)).html("Seasonal of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // lag correlation

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
      success: function success(data) {
        Plotly.newPlot("lag_chart_climate_".concat(order), data, {});
        $("#lag_climate_".concat(order)).html("Lag correlation of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // line chart date1 

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
      success: function success(data) {
        Plotly.newPlot("line_date1_exp_".concat(order), data, {});
        $("#title_date1_exp1_".concat(order)).html("Number case of  ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    });
  } // use function


  function create_tag_exp(order, name) {
    var html = '';
    html += " <div class=\"product-sales-area mg-tb-30\" id=disease_exp0_".concat(name, ">\n    <div class=\"container-fluid\">\n      <!-- chart in here  -->\n      <div class=\"row\">\n        <!-- col 1  year-->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\" id=\"disease_exp_").concat(name, "\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=disease_explore_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here -->\n            <div id=line_province_").concat(order, " class=line_province_").concat(order, " style=\"height: auto;width:auto\"></div>\n          </div>\n        </div>\n        <!-- year + date1  -->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=title_date1_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here -->\n            <div id=date1_disease_").concat(order, " class=date1_disease_").concat(order, " style=\"height: auto;width:auto\">\n            </div>\n          </div>\n        </div>\n        <!-- end  -->\n      </div>\n    </div>\n  </div>\n  <!--  chart  disease2-->\n  <div class=\"product-sales-area mg-tb-30\" id=disease_exp1_").concat(name, ">\n    <div class=\"container-fluid\">\n      <!-- show chart in here seasonal -->\n      <div class=\"row\">\n        <!-- begin col 1  -->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=seasonal_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here -->\n            <div id=seasonal_disease_").concat(order, " class=seasonal_disease_").concat(order, " style=\"height: auto;width:auto\">\n            </div>\n          </div>\n        </div>\n        <!-- col 2  month-->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=disease_exp_month_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here  -->\n            <div class=\"line_province_month_").concat(order, "\" id=line_province_month_").concat(order, "\n              style=\"height: auto;width:auto\"></div>\n          </div>\n        </div>\n        <!-- end col 2  -->\n      </div>\n    </div>\n  </div>\n  <!-- begin date 1  -->\n  <div class=\"product-sales-area mg-tb-30\" id=date1_exp_").concat(name, ">\n    <div class=\"container-fluid\">\n      <!-- show chart in here  -->\n      <div class=\"row\">\n        <!-- lag correlation  -->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=lag_explore_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here -->\n            <div class=\"lag_province_").concat(order, "\" id=lag_province_").concat(order, " style=\"height: auto;width:auto\"></div>\n          </div>\n        </div>\n        <!-- end lag -->\n        <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n          <div class=\"product-sales-chart\">\n            <div class=\"portlet-title\">\n              <div class=\"row\">\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"caption pro-sl-hd\">\n                    <span class=\"caption-subject\" id=title_corr_exp_").concat(order, "><b></b></span>\n                  </div>\n                </div>\n                <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                  <div class=\"actions graph-rp graph-rp-dl\">\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!-- chart in here -->\n            <div class=\"corr_exp_").concat(order, "\" id=corr_exp_").concat(order, " style=\"height: auto;width:auto\"></div>\n          </div>\n        </div>\n        <!-- end col 2  -->\n      </div>\n    </div>\n  </div>\n  <!-- end date1  -->\n  <hr class=\"my-4\" id=ruler_exp_").concat(name, ">\n  ");
    $(".disease_exp").append(html);
    $("#disease_exp0_".concat(name, ",#disease_exp1_").concat(name, ",#date1_exp_").concat(name, ",#ruler_exp_").concat(name)).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  } // create tag climate


  function create_tag_climate_exp(order, name) {
    var html = '';
    html += "<!-- show chart in here  -->\n    <div class=\"product-sales-area mg-tb-30\" id=climate_exp0_".concat(name, ">\n      <div class=\"container-fluid\">\n        <!-- chart in here  -->\n        <div class=\"row\">\n          <!-- col 1  -->\n          <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n            <div class=\"product-sales-chart\">\n              <div class=\"portlet-title\">\n                <div class=\"row\">\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"caption pro-sl-hd\">\n                      <span class=\"caption-subject\" id=climate_exp_").concat(order, "><b></b></span>\n                    </div>\n                  </div>\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"actions graph-rp graph-rp-dl\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- chart in here -->\n              <div id=climate_explore_").concat(order, " class=climate_explore_").concat(order, " style=\"height: auto;width:auto\">\n              </div>\n            </div>\n          </div>\n          <!-- col 2  -->\n          <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n            <div class=\"product-sales-chart\">\n              <div class=\"portlet-title\">\n                <div class=\"row\">\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"caption pro-sl-hd\">\n                      <span class=\"caption-subject\" id=climate_exp_month_").concat(order, "><b></b></span>\n                    </div>\n                  </div>\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"actions graph-rp graph-rp-dl\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- chart in here  -->\n              <div id=climate_explore_month_").concat(order, " class=climate_explore_month_").concat(order, "\n                style=\"height: auto;width:auto\"></div>\n            </div>\n          </div>\n          <!-- end col 2  -->\n        </div>\n      </div>\n    </div>\n    <!--  chart  disease2-->\n    <div class=\"product-sales-area mg-tb-30\" id=climate_exp1_").concat(name, ">\n      <div class=\"container-fluid\">\n        <!-- show chart in here  -->\n        <div class=\"row\">\n          <!-- begin col 1  -->\n          <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n            <div class=\"product-sales-chart\">\n              <div class=\"portlet-title\">\n                <div class=\"row\">\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"caption pro-sl-hd\">\n                      <span class=\"caption-subject\" id=seasonal_analyst_exp_").concat(order, "><b></b></span>\n                    </div>\n                  </div>\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"actions graph-rp graph-rp-dl\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- chart in here -->\n              <div class=\"seasonal_climate_").concat(order, "\" id=seasonal_climate_").concat(order, " style=\"height: auto;width:auto\">\n              </div>\n            </div>\n          </div>\n          <!-- end col 1  -->\n          <div class=\"col-lg-6 col-md-12 col-sm-12 col-xs-12\">\n            <div class=\"product-sales-chart\">\n              <div class=\"portlet-title\">\n                <div class=\"row\">\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"caption pro-sl-hd\">\n                      <span class=\"caption-subject\" id=lag_climate_").concat(order, "><b></b></span>\n                    </div>\n                  </div>\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"actions graph-rp graph-rp-dl\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <!-- chart in here -->\n              <div class=\"lag_chart_climate_").concat(order, "\" id=lag_chart_climate_").concat(order, "\n                style=\"height: auto;width:auto\"></div>\n            </div>\n          </div>\n          <!-- end col 2  -->\n        </div>\n      </div>\n    </div>\n    <!-- end -->\n    <div class=\"product-sales-area mg-tb-30\" id='line_date1_exp1_").concat(name, "'>\n      <div class=\"container-fluid\">\n        <div class=\"row\">\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\n            <div class=\"product-sales-chart\">\n              <div class=\"portlet-title\">\n                <div class=\"row\">\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"caption pro-sl-hd\">\n                      <span class=\"caption-subject\" id=\"title_date1_exp1_").concat(order, "\"><b></b></span>\n                    </div>\n                  </div>\n                  <div class=\"col-lg-6 col-md-6 col-sm-6 col-xs-12\">\n                    <div class=\"actions graph-rp graph-rp-dl\">\n                    </div>\n                  </div>\n                </div>\n              </div>\n              <div class=\"line_date1_exp_").concat(order, "\" id=\"line_date1_exp_").concat(order, "\" style=\"height: auto;width:auto\">\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    <hr class=\"my-4 \" id=ruler_exp0_").concat(name, "> \n    ");
    $(".climate_exp").append(html);
    $("#climate_exp0_".concat(name, ",#climate_exp1_").concat(name, ",#line_date1_exp1_").concat(name, ",#ruler_exp0_").concat(name)).each(function (i) {
      $('[id="' + this.id + '"]').slice(1).remove();
    });
  } // uncheck disease


  function unchecked_disease_exp(name) {
    // $(`#disease_exp_${name}`).remove();
    $("#disease_exp0_".concat(name)).remove();
    $("#disease_exp1_".concat(name)).remove();
    $("#date1_exp_".concat(name)).remove();
    $("#ruler_exp_".concat(name)).attr('class', 'my-4 hidden');
    ;
  } // uncheck climate


  function unchecked_climate_exp(name) {
    $("#climate_exp0_".concat(name)).remove();
    $("#climate_exp1_".concat(name)).remove();
    $("#line_date1_exp1_".concat(name)).remove();
    $("#ruler_exp0_".concat(name)).attr('class', 'my-4 hidden');
  } // chosen_region_disease('Influenza');


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
      success: function success(data) {
        Plotly.newPlot("line_province_".concat(order), data, {});
        $("#disease_explore_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // line month disease

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
      success: function success(data) {
        Plotly.newPlot("line_province_month_".concat(order), data, {});
        $("#disease_exp_month_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // seasonal analyst

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
      success: function success(data) {
        Plotly.newPlot("seasonal_disease_".concat(order), data, {});
        $("#seasonal_".concat(order)).html("Seasonal of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // lag disease region get tag province

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
      success: function success(data) {
        Plotly.newPlot("lag_province_".concat(order), data, {});
        $("#lag_explore_".concat(order)).html("Lag correlation of ".concat(name.split('_').join(' '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // line chart date1 

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
      success: function success(data) {
        Plotly.newPlot("date1_disease_".concat(order), data, {});
        $("#title_date1_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by montly mean from ").concat(begin, "-").concat(end));
      }
    }); // correlation 

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
      success: function success(data) {
        Plotly.newPlot("corr_exp_".concat(order), data, {});
        $("#title_corr_exp_".concat(order)).html("Correlation of ".concat(name.split('_').join('  '), " with climate and disease by yearly mean from ").concat(begin, "-").concat(end));
      }
    });
  }

  ; // run disease region

  function run_region_disease() {
    var disease_exp_array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(disease_exp_array, function (index, value) {
      i++;
      chosen_region_disease(begin, end, value, i);
    });
  }

  ; // chosen region climate

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
      success: function success(data) {
        Plotly.newPlot("climate_explore_".concat(order), data, {});
        $("#climate_exp_".concat(order)).html("Number case of  ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    }); // chosen region month

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
      success: function success(data) {
        Plotly.newPlot("climate_explore_month_".concat(order), data, {});
        $("#climate_exp_month_".concat(order)).html("Number case of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // seasonal analyst

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
      success: function success(data) {
        Plotly.newPlot("seasonal_climate_".concat(order), data, {});
        $("#seasonal_analyst_exp_".concat(order)).html("Seasonal of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // lag correlation

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
      success: function success(data) {
        Plotly.newPlot("lag_chart_climate_".concat(order), data, {});
        $("#lag_climate_".concat(order)).html("Lag correlation of ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    }); // line region 

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
      success: function success(data) {
        Plotly.newPlot("line_date1_exp_".concat(order), data, {});
        $("#title_date1_exp1_".concat(order)).html("Number case of  ".concat(name.split('_').join('  '), " by monthly mean from ").concat(begin, "-").concat(end));
      }
    });
  }

  ;

  function run_region_climate() {
    var climate_exp_array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(climate_exp_array, function (index, value) {
      i++;
      chosen_region_climate(begin, end, value, i);
    });
  }

  ; // check exist data in map Viet Nam

  function exist_data(id) {
    // id data province
    var id_data = [15, 30, 27, 3, 29, 25, 16, 7, 31, 24, 4, 20, 13, 9, 8, 11, 6, 1, 10, 2, 17, 12, 19, 22, 23, 21, 38, 26, 45, 32, 49, 28, 40, 56, 42, 43, 61, 35, 41, 37, 55, 34, 57, 48, 36, 59, 60, 52, 62, 46, 39, 63, 51, 64, 54];

    if (id_data.includes(parseInt(id)) == false) {
      $.confirm({
        title: "Explore Province",
        content: "Data not exist.Please choose another province!",
        buttons: {
          ok: {
            btnClas: "btn-primary"
          },
          cancel: {
            btnClass: "btn-danger"
          }
        }
      });
      return false;
    }

    ;
  }

  ; // ajax to get data result next map

  getData(province_code);

  function getData(id) {
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.ajax({
      type: "GET",
      url: "/explore_response/" + id,
      data: {
        begin: begin,
        end: end
      },
      success: function success(response) {
        $(".showresult").html(response.data);
      },
      error: function error(response) {
        console.log(response);
      }
    });
  }

  ; // get province code climate

  getData_Climate(province_code);

  function getData_Climate(id) {
    var begin = $(".begin").val();
    var end = $(".end").val(); // if (begin > end) {
    //   $.alert({
    //     title: 'Notification!',
    //     content: 'Please chose begin year bigger than end year!',
    //   });
    //   return false;
    // }

    $.ajax({
      type: "GET",
      url: "/exp_climate_response/" + id,
      success: function success(response) {
        $(".showresult_climate").html(response.data);
      },
      data: {
        begin: begin,
        end: end
      },
      error: function error(response) {
        console.log(response);
      }
    });
  }

  ; // get region disease 

  function getData_region(id) {
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.ajax({
      type: "GET",
      url: "/explore_response_region/" + id,
      success: function success(response) {
        $(".showresult").html(response.data);
      },
      data: {
        'name': name_region,
        begin: begin,
        end: end
      },
      error: function error(response) {
        console.log(response);
      }
    });
  }

  ; // get region climate 

  function getData_region_climate(id) {
    var begin = $(".begin").val();
    var end = $(".end").val(); // if (begin > end) {
    //   $.alert({
    //     title: 'Notification!',
    //     content: 'Please chose begin year bigger than end year!',
    //   });
    //   return false;
    // }

    $.ajax({
      type: "GET",
      url: "/explore_region_climate/" + id,
      success: function success(response) {
        $(".showresult_climate").html(response.data);
      },
      data: {
        'name': name_region,
        begin: begin,
        end: end
      },
      error: function error(response) {
        console.log(response);
      }
    });
  }

  ; // correlation data frame province

  var disease_climate = [];
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
      }); // unchecked_disease_exp(this.value);
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
      success: function success(data) {
        Plotly.newPlot("corr_exp_".concat(order), data, {});
        $("#title_corr_exp_".concat(order)).html("Correlation of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    });
  }

  function run_correlation() {
    var disease_climate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(disease_climate, function (index, value) {
      i++;
      correlation(begin, end, value, i);
    });
  }

  ; // correlation region 

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
      success: function success(data) {
        Plotly.newPlot("corr_exp_".concat(order), data, {});
        $("#title_corr_exp_".concat(order)).html("Correlation of ".concat(name.split('_').join('  '), " by yearly mean from ").concat(begin, "-").concat(end));
      }
    });
  }

  function run_correlation_region() {
    var disease_climate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var i = 0;
    var begin = $(".begin").val();
    var end = $(".end").val();
    $.each(disease_climate, function (index, value) {
      i++;
      correlation_region(begin, end, value, i);
    });
  }

  ;
  title_explore(1997, 2019);

  function title_explore(begin, end) {
    $('.title_explore').html("Explore Data In Viet Nam From ".concat(begin, "-").concat(end));
  }
});