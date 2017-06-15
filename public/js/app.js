var token = localStorage.getItem('token');

$(document).ready(function() {

	// we get the token!!!


    $('#submitLogin').click(function(event) {
        event.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();


        /// we have to send password and username to the backend.
        $.ajax({
            type: 'POST',
            url: '/api/authenticate',
            data: { username: username, password: password },
            dataType: 'json'
        }).done(function(data) {

            // don't try this at home!
            // we start to store the token
            localStorage.setItem('token', data.token);
            location.href = '/medications';
            // redriect to medications page!

            // missing!
        })
    });


    $('#logout').click(function(event) {
        localStorage.removeItem('token');
        /// change the page to another!!
        location.href = '/'; // takes it to the root or /
    });

    /// click, submit, dbclick, etc.
    // $('#deb').click(function(event){
    // 	event.preventDefault();
    // 	var name = $('#deb-name').val();  // how to extra data from the form input
    // 	alert("hi there! " + name);
    // });

    // other concepts to remeber
    /*
    $.getJSON
    $.ajax
    */

});


// var MOCK_MEDICATION = {
// 	'medications': [
// 	{
// 		'id': '111',
// 		'name': 'drug1',
// 		'dosage': '1',
// 		'composition': 'pill'
// 		'time': 'twice a day'
// 	},
// 	{
// 		'id': '222',
// 		'name': 'drug2',
// 		'dosage': '40 ml',
// 		'time': 'once a day'	
// 	},
// 	{
// 		'id': '333',
// 		'name': 'drug3',
// 		'dosage': '50 ml',
// 		'time': 'every 4-6 hours'
// 	}
// 	]
// };

function getSchedule() {
    //when you click on the med, you should get the Schedule (name, dosage, and time)

}
