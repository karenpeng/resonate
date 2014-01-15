(function (exports) {
  var canvas = document.getElementById("myCanvas");
  var p = new Processing(canvas, sketchProc);

  // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var n = 20;
    var balls = [];
    processing.setup = function () {
      processing.size(1201, 700);
      //processing.frameRate(18);
      processing.smooth();
      balls.push(new Ball(processing.width / 2, processing.height / 2, n, processing));
    };

    processing.draw = function () {
      processing.background(0);
      processing.stroke(255);
      processing.line(0, processing.height / 2, processing.width, processing.height / 2);

      balls[0].paint();
      if (note) {
       jump();
      }
    };

    processing.mousePressed = function(){
      var disX = processing.mouseX - balls[0].x;
      balls[0].x += disX * 0.1;
    };

    //maybe jump is a property of Ball
    function jump() {
      var heit;
      if (pitch === 11025) {
        heit = processing.height / 2;
      } else {
        heit = processing.map(pitch, 40, 500, processing.height - n, n);
      }

      var disY = heit - balls[0].y;
      balls[0].y += disY * 0.1;
      balls[0].y = processing.constrain(balls[0].y, n, processing.height - n);
    }
  }
}(this));
