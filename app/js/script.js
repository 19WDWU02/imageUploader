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
        $.ajax({
            url: `${url}/upload`,
            method: 'post',
            success:function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        })
    })
})
