// main.js
$(document).ready(function () {
    var host = "cpsc484-01.stdusr.yale.internal:8888";
    var exerciseStarted = false;
    $('#timer').hide();
    initWebSocket();

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
                console.log(right_distance)
                console.log(left_distance)
                exerciseStarted = (right_distance < 0) && (left_distance < 0)
                console.log(exerciseStarted)
                if (exerciseStarted){
                    $('#exerciseTitle').text("Stretch 1: Raise your arms and hold.");
                    $('#timer').show();
                } 
            }
            
        };      

    }
});
