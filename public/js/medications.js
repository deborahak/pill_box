$(document).ready(function() {
    var token = localStorage.getItem("token");


    /// if there is no token, (a.k.a. logged out)
    /// redirect the person to the login page!!!!
    $.getJSON('/api/medications?token=' + token, function(data) {
    	// check for the data property error being true!
    	// if it is true, redirect the individual to login page!
    	// and for sanity's sake, delete the token
        // console.log(data);
        if (data.error === true ){
        	// remove the old token
        	localStorage.removeItem('token');
        	location.href = '/login';
        }

        for (i = 0; i < data.medications.length; i++) {
        	// append the title to the unordered list
        	$('ul#medications').append('<li class="list-group-item">' + data.medications[i].name +'</li>');
        }

    })
});
