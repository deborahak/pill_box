var token = localStorage.getItem('token');

$(document).ready(function() {

    $('#submitLogin').click(function(event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/api/authenticate',
            data: { username: username, password: password },
            dataType: 'json'
        }).done(function(data) {
            if (data.message){
                console.log('error');
                $('.error').html(data.message);
                $('#logged').addClass('has-error');

                var $inputs = $(".form-login input");
                $inputs.on("input", function() {
                    var $filled = $inputs.filter(function() {return this.value.trim().length > 0;});
                $('#logged').toggleClass('has-error', $filled.length > 0);
                $('#submitLogin').click(function() {
                    $inputs.val('').trigger('input');
                });
                });
            } else {
              localStorage.setItem('token', data.token);
              location.href = '/medications';
            }
        })
    });


    $('#logout').click(function(event) {
        localStorage.removeItem('token');
        location.href = '/'; 
    });

});


// function getSchedule() {
//     //when you click on the med, you should get the Schedule (name, dosage, and time)

// }
