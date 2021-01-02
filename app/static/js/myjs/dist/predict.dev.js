"use strict";

$(document).ready(function () {
  var currentURL = $(location).attr('pathname');

  if (currentURL != '/prediction') {
    return false;
  }

  var province_code = 15;
  $(".option_".concat(province_code)).attr('selected', 'selected'); // form search

  $(".search_province").change(function (event) {
    province_code = $('#province').val();
    var begin = $(".begin").val();
    var end = $(".end").val(); // getData(disease_climate_array, begin, end, province_code);
    // getDataInfo(disease_climate_array, begin, end, province_code);
    // getcorrFeature(disease_climate_array, begin, end, province_code);
    // linear_model(disease_array, climate_array, begin, end, province_code);

    get_model(disease_array, begin, end, province_code); // get_linear(disease_array,begin,end,province_code);
    // get_info_model(disease_array,begin,end,province_code);
  }); // selection option 

  var number = ''; // predict 

  $(".algorithm").change(function (event) {
    number = $("#algorithm").val();
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
  }); // create modal linear regression 

  function create_modal_regression() {
    var html = "";
    html += "<div class=\"modal\" id=\"exampleModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\" role=\"document\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">LinearRegression</h5>\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <!-- form to predict  -->\n          <form id='form_regression'>\n            <!-- Vaporation  -->\n            <div class=\"form-group\">\n              <label for=\"recipient-name\" class=\"col-form-label\">Vaporation:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Vaporation\">\n            </div>\n            <!-- Temperature  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Temperature:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Temperature\">\n            </div>\n            <!-- Rain  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Rain:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Rain\">\n            </div>\n            <!-- humidity  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Humidity:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Humidity\">\n            </div>\n            <!-- sun hour  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Sun hour:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Sun_hour\">\n            </div>\n            <!-- Date  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Date:</label>\n              <input type=\"date\" class=\"form-control\" id=\"recipient-Date\">\n            </div>\n            <button type=\"submit\" class=\"btn btn-primary submit\">Submit</button>\n          </form>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Close</button>\n          <button type=\"button\" class=\"btn btn-primary process\">Save Change</button>\n        </div>\n      </div>\n    </div>\n  </div>";
    $('.modal_regression').append(html);
    $('.process').click(function () {
      form_regression();
    });
  } // create modal SARIMA 


  function create_modal_sarima() {
    var html = "";
    html += "<div class=\"modal\" id=\"exampleSarima\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"exampleModalLabel\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\" role=\"document\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h5 class=\"modal-title\" id=\"exampleModalLabel\">SARIMA</h5>\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n        </div>\n        <div class=\"modal-body\">\n          <!-- form to predict  -->\n          <form>\n            <!-- Vaporation  -->\n            <div class=\"form-group\">\n              <label for=\"recipient-name\" class=\"col-form-label\">Vaporation:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Vaporation\">\n            </div>\n            <!-- Temperature  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Temperature:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Temperature\">\n            </div>\n            <!-- Rain  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Rain:</label>\n              <input type=\"text\" class=\"form-control\" id=\"recipient-Rain\">\n            </div>\n            <!-- Date  -->\n            <div class=\"form-group\">\n              <label for=\"message-text\" class=\"col-form-label\">Date:</label>\n              <input type=\"date\" class=\"form-control\" id=\"recipient-Date\">\n            </div>\n          </form>\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Close</button>\n          <button type=\"button\" class=\"btn btn-primary\">Process</button>\n        </div>\n      </div>\n    </div>\n    </div>";
    $('.modal_sarima').append(html);
  } // processing form 


  function form_regression() {
    $('#form_regression').on('submit', function (event) {
      event.preventDefault();
      $.ajax({
        url: "/predict",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: 'JSON',
        data: $('form').serialize(),
        success: function success(res) {
          $('.result_model').html(res.prediction_text);
        },
        error: function error(res) {
          console.log(res);
        }
      });
    });
  } //  add para 
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