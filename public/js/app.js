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

            localStorage.setItem('token', data.token);
            location.href = '/medications';
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
