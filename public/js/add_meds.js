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
				if (data.message){
                console.log('error');
                $('.error').html(data.message);
                $('#logged').addClass('has-error');

                var $inputs = $(".add_med input");
                $inputs.on("input", function() {
                    var $filled = $inputs.filter(function() {return this.value.trim().length > 0;});
                $('#logged').toggleClass('has-error', $filled.length > 0);
                $('#addMed').click(function() {
                    $inputs.val('').trigger('input');
                });
                });
            } else {
							location.href = '/medications';
            }
			})
	})
})