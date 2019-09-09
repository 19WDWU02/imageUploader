$(document).ready(function(){
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
            url: 'http://localhost:3000/upload',
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
