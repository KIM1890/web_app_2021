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