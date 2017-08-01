$(document).ready(function() {
    // to paint up the clock!

    //  placing the med name and times.
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
        for (var i = 1; i < 25; i++) {
            // append the "hour"
            if (i < 12) {
                var time = i + "am";
                $('#agenda-hours').append('<tr><td id="' + time + '" class="agenda-time">' + time + '</td><td class="agenda-events"><div class="agenda-event"></div></td></tr>')
            } else if (i === 12) {
                var time = i + "pm";
                $('#agenda-hours').append('<tr><td id="' + time + '" class="agenda-time">' + time + '</td><td class="agenda-events"><div class="agenda-event"></div></td></tr>')

            }
            // else if (i === 0) {
            // $('#agenda-hours').append('<tr><td id="agenda-hours" class="agenda-time">' + i + " am" + '</td><td class="agenda-events"><div class="agenda-event"></div></td></tr>')
            // }
            else if (i === 24) {
                var time = (i - 12) + "am";
                $('#agenda-hours').append('<tr><td id="' + time + '" class="agenda-time">' + time + '</td><td class="agenda-events"><div class="agenda-event"></div></td></tr>')

            } else if (i > 12) {
                var time = (i - 12) + "pm";
                $('#agenda-hours').append('<tr><td id="' + time + '" class="agenda-time">' + time + '</td><td class="agenda-events"><div class="agenda-event"></div></td></tr>')

            }
        }

        for (var i = 0; i < data.medications.length; i++) {
            // append the title to the unordered list
            // locate the specific "time" on the page as well as time in the object we get from data.medications[i]

            var time = data.medications[i].timing[0].replace(/\s/g, '');
            var splitTime = time.split(',');
            //loop (assume that splitTime - > [ 0, 1, 2 ])
            for (var x = 0; x < splitTime.length; x++) {
                $('#' + splitTime[x]).css('color', 'red');
                $('#' + splitTime[x]).siblings().append(data.medications[i].name + '</br>');
                $('#' + splitTime[x]).siblings().css('color', '#678bb0');
            }

        }
    });
});