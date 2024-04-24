// main.js
$(document).ready(function () {
    var host = "cpsc484-01.stdusr.yale.internal:8888";
    var timeLeft = 3;
    var exerciseStarted = false;
    var start = 0;
    var option = 0;
    var text = ""

    initWebSocket();
    //console.log(exerciseStarted)

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
        while(exerciseStarted) {
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
            if (!exerciseStarted) {
                clearTimeout(timerId);
                endExercise(); 
            }
        } 

        //initWebSocket();
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
            if (data.people.length == 1) {
                console.log(data)
                let person_r_eye = data.people[0].joints[30].position.y
                let person_r_hand = data.people[0].joints[15].position.y
                let person_l_hand = data.people[0].joints[8].position.y
                let right_distance = person_r_hand - person_r_eye
                let left_distance = person_l_hand - person_r_eye
                //console.log(right_distance)
                //console.log(left_distance)
                exerciseStarted = (right_distance < 0) && (left_distance < 0)
                if (exerciseStarted){
                    $('#exerciseTitle').text("Stretch 1: Raise your arms and hold.");
                    $('#timer').text("3 seconds remaining");
                } else {
                    $('#exerciseTitle').text("Raise your hands to start.");
                    $('#timer').text("");
                }
            }
            
        };

        twodSocket.onmessage = function (event) {
            var data = JSON.parse(event.data);
            $('img.twod').attr("src", 'data:image/jpeg;base64,' + data.src);
        };

        

    }
});
