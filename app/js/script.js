let url;

$(document).ready(function(){
    $.ajax({
      url: 'config.json',
      type: 'GET',
      dataType: 'json',
      success:function(keys){
        url = `${keys['SERVER_URL']}:${keys['SERVER_PORT']}`;
        getImages();
      },
      error: function(){
        console.log('cannot find config.json file, cannot run application');
      }
    });

    getImages = () => {
        $.ajax({
            url: `${url}/allImages`,
            type: 'GET',
            dataType: 'json',
            success: function(images){
                console.log(images);
            },
            error: function(err){
                console.log(err);
                console.log('error with getting all the images');
            }
        })
    }

    $('#customFile').change(function(e){
        const fileName = e.target.files[0].name;
        $('.custom-file-label').text(fileName);
        $('.hidden').fadeIn();
    });

    $('#cancelBtn').click(function(){
        clearForm();
    })

    $('#imageUploader').submit(function(){
        event.preventDefault();
        $('#imageTitle').removeClass('is-invalid').parent().find('.invalid-feedback').remove();
        const imageTitle = $('#imageTitle').val();

        if(imageTitle.length === 0){
            $('#imageTitle').addClass('is-invalid').parent().append(`<div class="invalid-feedback">Please enter a title for the image.</div>`);
        } else {
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
                    clearForm();
                },
                error: function(err){
                    console.log(err);
                }
            })
        }
    });

    clearForm = () => {
        $('.custom-file-label').text('Choose file');
        $('#customFile').val('');
        $('.hidden').fadeOut();
        $('#imageTitle').val('').removeClass('is-invalid').parent().find('.invalid-feedback').remove();
    }
})
