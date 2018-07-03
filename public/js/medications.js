$(document).ready(function() {
    $.getJSON('/api/medications?token=' + token, function(data) {
        if (data.error === true) {
            // remove the old token
            localStorage.removeItem('token');
            location.href = '/login';
        }

        for (i = 0; i < data.medications.length; i++) {
            // append the title to the unordered list
            $('ul#medications').append('<li class="list-group-item"> <a id="' + data.medications[i]._id + '" href="#"> ' + data.medications[i].name + '</a></li>');
        }

    });

    $('#save-med').on('click', function(event) {
        event.preventDefault();
        console.log(event);
        var medName = $('#inputName').val();
        var medDose = $('#inputDose').val();
        var medTime = $('#inputTiming').val();
        var medDescription = $('#inputDescription').val();
        var id = $('#medication-id').val();

        $.ajax({
            type: 'PUT',
            url: '/api/medications/' + id + '?token=' + token,
            data: { name: medName, dose: medDose, timing: [medTime], description: medDescription},
            dataType:'json'
        }).done(function(data) {
            console.log(data);            
            if (data.message){
                console.log('error');
                console.log(data);
                $('.error').html('*Required');
                $('#add').addClass('has-error');

                var $inputs = $(".form-horizontal input");
                $inputs.on("input", function() {
                    var $filled = $inputs.filter(function() {return this.value.trim().length > 0;});
                    $('#edit').toggleClass('has-error', $filled.length > 0);
                    $('#save-med').click(function() {
                        $inputs.trigger('input');
                    });
                });       
            } else {
            location.href = '/medications';
            }
        })
    });

    $('#delete-med').on('click', function(event){
        event.preventDefault();
        var id = $('#medication-id').val();
        $.ajax({
            type: 'DELETE',
            url: '/api/medications/' + id +'?token=' + token,
            dataType: 'json'
        }).done(function(data){
            location.href = '/medications';
        })
    });

    $('ul#medications').on('click', '.list-group-item a', function(event) {
        event.preventDefault();
        // we load the modal

        var id = this.id;
        $("#myModalHorizontal").modal();
        
        $.getJSON('/api/medications/' + id + '?token=' + token, function(data) {

            console.log(data);
 
            $("#inputName").val(data.name);
            $("#inputDose").val(data.dose);
            $("#inputTiming").val(data.timing);
            $("#inputDescription").val(data.description);
            // input --> hidden!!!
            $("#medication-id").val(id);

        });

    });

});
