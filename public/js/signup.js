$(document).ready(function(){
	$('#signUp').click(function(event){
		event.preventDefault();
		var username = $('#username').val();
		var password = $('#password').val();

		$.ajax({
			type: 'POST',
			url: '/api/signup',
			data: { username: username, password: password},
			dataType: 'json'
		}).done(function(data){
			location.href = '/medications';
		})
	});	
});