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
