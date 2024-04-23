// main.js
$(document).ready(function () {
    var host = "cpsc484-01.stdusr.yale.internal:8888";
    var timeLeft = 3;
    var exerciseStarted = false;
    var start = 0;
    var option = 0;
    var text = ""

    $("#startButton").click(function () {
        if (!exerciseStarted) {
            startExercise();
            exerciseStarted = true;
            $(this).hide();
            $('.exercise').show();
        }
    });

    function startExercise() {
        option = option % 4
        switch (option) {
            case 0:
                text = "Stretch 1: Raise your arms and hold."
                break;
            case 1:
                text = "Stretch 2"
                break;
            case 2:
                text = "Stretch 3"
                break;
            case 3:
        }
        $('#exerciseTitle').text("Stretch 1: Raise your arms and hold.");
        $('#timer').text("3 seconds remaining");
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
        $('.exercise').hide();
        $("#startButton").show();
        exerciseStarted = false;
        timeLeft = 3
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
