$(document).ready(function(){

	$('#addMed').on('click', function(event){
		event.preventDefault();
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
			location.href = '/medications';
		})
	})
})