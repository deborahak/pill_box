$(document).ready(function(){

	$('#addMed').on('click', function(event){
		event.preventDefault();
		console.log(event);
		var medName = $('#medName').val();
		var medDose = $('#medDose').val();
		var medTime = $('#medTime').val();
		var medDescription = $('#medDescription').val();

		$.ajax({
			type: 'POST',
			url: '/api/medications?token=' + token,
			data: { name: medName, dose: medDose, timing: [medTime], description: medDescription},
			dataType:'json'
		}).done(function(data){
				console.log(data);
				if (data.message){
      		console.log('error');
      		console.log(data);
      		$('.error').html('*Required');
      		$('#add').addClass('has-error');
      	


      	} else {
			  location.href = '/medications';
		  	}
		 })
	})
})