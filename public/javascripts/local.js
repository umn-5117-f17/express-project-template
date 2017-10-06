$(function() {

  $('#theinputfield').change(function() {
    console.log('picked file', $('#theinputfield')[0].files[0]);

    $('#fn').html( $('#theinputfield')[0].files[0].name );
  });

  // $('#theform').submit(function(e) {
  //   console.log('form submit')
  //   e.preventDefault();
  // });

  $('#theAjaxButton').click(function(e) {
    // how to select the file itself
    var f = $('#theinputfield')[0].files[0];
    if (!f) {
      alert('pick a file');
      return;
    }

    // create the
    var fd = new FormData();
    fd.append('ajaxfile', f);

    $.ajax({
      url: '/upload-file-ajax',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(data) {
        console.log('data', data);
        $('#ajaxResponse').html(JSON.stringify(data));
      }
    });

  });
})
