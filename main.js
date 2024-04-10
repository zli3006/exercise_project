// main.js
$(document).ready(function () {
    var host = "cpsc484-01.stdusr.yale.internal:8888";
    var timeLeft = 30;
    var exerciseStarted = false;

    $("#startButton").click(function () {
        if (!exerciseStarted) {
            startExercise();
            exerciseStarted = true;
            $(this).hide();
            $('.exercise').show();
        }
    });

    function startExercise() {
        var timerId = setInterval(function() {
            if (timeLeft == -1) {
                clearTimeout(timerId);
                endExercise();
            } else {
                $('#timer').text(timeLeft + ' seconds remaining');
                timeLeft--;
            }
        }, 1000);

        initWebSocket();
    }

    function endExercise() {
        $('#exerciseTitle').text("Well done!");
        $('#timer').text("Exercise complete.");
    }

    function initWebSocket() {
        var framesSocket = new WebSocket("ws://" + host + "/frames");
        var twodSocket = new WebSocket("ws://" + host + "/twod");

        framesSocket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            // Logic to evaluate exercise performance goes here
        };

        twodSocket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            $('img.twod').attr("src", 'data:image/jpeg;base64,' + data.src);
        };
    }
});
