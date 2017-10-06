$(function() {
  console.log('file-upload.js ready');

  $('#theinputfield').change(function() {
    var f = $('#theinputfield')[0].files[0];
    $('#fn').html( f.name );
  });

  $('#theAjaxButton').click(function(e) {
    // how to select the file itself
    var f = $('#theinputfield')[0].files[0];
    if (!f) {
      alert('pick a file');
      return;
    }

    // send post http request to the server
    var fd = new FormData();
    fd.append('ajaxfile', f);

    $.ajax({
      url: '/upload/upload-file-ajax',
      data: fd,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function(res) {
        console.log('response', res);
        $('#ajaxResponse').html(JSON.stringify(res));
      }
    });
  });

});
