var host = "cpsc484-01.stdusr.yale.internal:8888";

$(document).ready(function () {
    frames.start();
});

var frames = {
    socket: null,

    start: function () {
        var url = "ws://" + host + "/frames";
        frames.socket = new WebSocket(url);
        frames.socket.onmessage = function (event) {
            frames.show(JSON.parse(event.data));
        }
    },

    show: function (frame) {
        console.log(frame);
         if (frame.people.length > 0) {
            let person_r_eye = frame.people[0].joints[30].position.y
            let person_r_hand = frame.people[0].joints[15].position.y
            let person_l_hand = frame.people[0].joints[8].position.y
            let right_distance = person_r_hand - person_r_eye
            let left_distance = person_l_hand - person_r_eye
            let raised = (right_distance > 0) && (left_distance > 0)
        }
    }
};

$(document).ready(function() {
  twod.start();
});

var twod = {
    socket: null,

    // create a connection to the camera feed
    start: function () {
        var url = "ws://" + host + "/twod";
        twod.socket = new WebSocket(url);

        // whenever a new frame is received...
        twod.socket.onmessage = function (event) {

            // parse and show the raw data
            twod.show(JSON.parse(event.data));
        }
    },

    // show the image by adjusting the source attribute of the HTML img object previously created
    show: function (twod) {
        $('img.twod').attr("src", 'data:image/pnjpegg;base64,' + twod.src);
    },
};
