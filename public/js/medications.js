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
        $("#inputName").val("asprin");
        $("#inputDose").val("200ml");
        $("#inputTiming").val("twice a day");
        $("#inputDescription").val("white");


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

        });

    });

});
