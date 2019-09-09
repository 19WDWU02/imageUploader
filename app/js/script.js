let url;

$(document).ready(function(){
    $.ajax({
      url: 'config.json',
      type: 'GET',
      dataType: 'json',
      success:function(keys){
        url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
      },
      error: function(){
        console.log('cannot find config.json file, cannot run application');
      }
    });

    $('#customFile').change(function(e){
        const fileName = e.target.files[0].name;
        $('.custom-file-label').text(fileName);
        $('.hiddenBtn').fadeIn();
    });

    $('#cancelBtn').click(function(){
        $('.custom-file-label').text('Choose file');
        $('#customFile').val('');
        $('.hiddenBtn').fadeOut();
    })

    $('#imageUploader').submit(function(){
        event.preventDefault();

        let fd = new FormData();
        const file = $('#customFile')[0].files[0];
        fd.append('uploadedImage', file);

        $.ajax({
            url: `${url}/upload`,
            method: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success:function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        })
    });
    
})
