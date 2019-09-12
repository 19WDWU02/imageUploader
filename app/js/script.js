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
        console.log(`${url}/allImages`);
        $.ajax({
            url: `${url}/allImages`,
            type: 'GET',
            success: function(images){
                for (var i = 0; i < images.length; i++) {
                    $('#allImages').append(`<div class="card" data-id="${images[i]._id}">
                            <img class="img-fluid" src="${url}/${images[i].imgUrl}" alt="${images[i].imgTitle}">
                        </div>`)
                }
            },
            error: function(err){
                console.log(err);
                console.log('error with getting all the images');
            }
        })
    }

    $('#customFile').change(function(e){
        console.log(e.target.files.length);
        if(e.target.files.length > 0){
            const fileName = e.target.files[0].name;
            $('.custom-file-label').text(fileName);
            $('.hidden').fadeIn();
        }
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
            fd.append('imageName', imageTitle);

            $.ajax({
                url: `${url}/upload`,
                method: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success:function(data){
                    $('#allImages').append(`<div class="card" data-id="${data._id}">
                            <img class="img-fluid" src="${url}/${data.imgUrl}" alt="${data.imgTitle}">
                        </div>`)
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

    $(document).on('click', '.card', function(){
        const id = $(this).data('id');
        const card = $(this);
        $.ajax({
            url: `${url}/${id}`,
            method: 'delete',
            success: function(result){
                card.remove();
                console.log(result);
            },
            error: function(err){
                console.log(err);
                console.log('something went wrong with deleteing the item');
            }
        })
    });

});
