// main.js

$(document).ready(function () {
    var host = "cpsc484-01.stdusr.yale.internal:8888";
    var timeLeft = 30;
    var exerciseStarted = false;
    var option = 0;
    var text = "";
  
    $("#startButton").click(function () {
      if (!exerciseStarted) {
        startExercise();
        exerciseStarted = true;
        $(this).hide();
        $('.exercise').show();
      }
    });
  
    function startExercise() {
      switch (option) {
        case 0:
          text = "Stretch 1: Raise your arms above your head and hold.";
          break;
        case 1:
          text = "Stretch 2: Stretch your arms to the side and hold.";
          break;
        default:
          endExercise();
          return;
      }
  
      $('#exerciseTitle').text(text);
      $('#timer').text(timeLeft + " seconds remaining");
  
      var timerId = setInterval(function () {
        if (timeLeft == -1) {
          clearTimeout(timerId);
          option++;
          timeLeft = 30;
          startExercise();
        } else {
          $('#timer').text(timeLeft + ' seconds remaining');
          timeLeft--;
        }
      }, 1000);
  
      initWebSocket();
    }
  
    function endExercise() {
      $('#exerciseTitle').text("Thank you for completing the stretching routine!");
      $('#timer').text("");
      $('.exercise').hide();
      $("#startButton").show();
      exerciseStarted = false;
      option = 0;
      timeLeft = 30;
    }
  
    function initWebSocket() {
      var framesSocket = new WebSocket("ws://" + host + "/frames");
      var twodSocket = new WebSocket("ws://" + host + "/twod");
  
      framesSocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        var joints = data.bodies[0].joints;
  
        if (option === 0 && !isHandsAboveHead(joints)) {
          $('#reminder').text("Please keep your hands above your head.");
        } else if (option === 1 && !isHandsToSide(joints)) {
          $('#reminder').text("Please keep your arms stretched to the side.");
        } else {
          $('#reminder').text("");
        }
      };
  
      twodSocket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        $('img.twod').attr("src", 'data:image/jpeg;base64,' + data.src);
      };
    }
  
    function isHandsAboveHead(joints) {
      var headJoint = joints.find(joint => joint.jointType === "Head");
      var leftHandJoint = joints.find(joint => joint.jointType === "HandLeft");
      var rightHandJoint = joints.find(joint => joint.jointType === "HandRight");
  
      if (headJoint && leftHandJoint && rightHandJoint) {
        return leftHandJoint.position.y > headJoint.position.y && rightHandJoint.position.y > headJoint.position.y;
      }
  
      return false;
    }
  
    function isHandsToSide(joints) {
      var leftShoulderJoint = joints.find(joint => joint.jointType === "ShoulderLeft");
      var rightShoulderJoint = joints.find(joint => joint.jointType === "ShoulderRight");
      var leftHandJoint = joints.find(joint => joint.jointType === "HandLeft");
      var rightHandJoint = joints.find(joint => joint.jointType === "HandRight");
  
      if (leftShoulderJoint && rightShoulderJoint && leftHandJoint && rightHandJoint) {
        var shoulderDistance = Math.abs(leftShoulderJoint.position.x - rightShoulderJoint.position.x);
        var handDistance = Math.abs(leftHandJoint.position.x - rightHandJoint.position.x);
  
        return handDistance > shoulderDistance * 1.5;
      }
  
      return false;
    }
  });