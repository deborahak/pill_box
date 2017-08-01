$(document).ready(function() {
    /// if there is no token, (a.k.a. logged out)
    /// redirect the person to the login page!!!!
    $.getJSON('/api/medications?token=' + token, function(data) {
        // check for the data property error being true!
        // if it is true, redirect the individual to login page!
        // and for sanity's sake, delete the token
        // console.log(data);
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
        var medName = $('#inputName').val();
        var medDose = $('#inputDose').val();
        var medTime = $('#inputTiming').val();
        var medDescription = $('#inputDescription').val();
        var id = $('#medication-id').val();

        $.ajax({
            type: 'PUT',
            url: '/api/medications/' + id + '?token=' + token,
            data: { name: medName, 
                dose: medDose, 
                timing: [medTime], 
                description: medDescription },
            dataType: 'json'
        }).done(function(data) {
            location.href = '/medications';
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

    /// When an a tag is clicked, can we get a simple alert to show up!
    // hints: (refresher)
    // use the click listener!
    // when data is dynamic, meaning it just gets to exist later (even by a second)
    // $(WAHT ExISTs).on(HANDLER/event, "target", FUNCTION)
    $('ul#medications').on('click', '.list-group-item a', function(event) {
        event.preventDefault();
        // we load the modal!!!

        var id = this.id;
        $("#myModalHorizontal").modal();
        
        $.getJSON('/api/medications/' + id + '?token=' + token, function(data) {
            // check for the data property error being true!
            // if it is true, redirect the individual to login page!
            // and for sanity's sake, delete the token
            console.log(data);
            // if (data.error === true) {
            //     // remove the old token
            //     localStorage.removeItem('token');
            //     location.href = '/login';
            // }
            $("#inputName").val(data.name);
            $("#inputDose").val(data.dose);
            $("#inputTiming").val(data.timing);
            $("#inputDescription").val(data.description);
            // input --> hidden!!!
            $("#medication-id").val(id);

        });

    });


});
