(function (exports) {
  var canvas = document.getElementById("myCanvas");

  //var me;
  exports.openAlready = null;
  var balls = [];
  var otheX, otherY, otherN, otherP;

  var p = new Processing(canvas, sketchProc);
    // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var n                   = 20;
    //var balls               = [];
    var prePosition         = [];

    processing.setup = function () {

      processing.size(1201, 700);
      processing.frameRate(20);
      processing.smooth();
      balls.push(new Ball(processing.width / 2, processing.height / 2, n, processing));
      //balls[0] = new Ball( processing.width / 2, processing.height / 2, n, processing );
      otherX = processing.width / 2;
      otherY = processing.height / 2;
      otherN = n;
      otherP = processing;

      prePosition = [processing.width / 2, processing.height / 2];
      //me = balls[0];
      exports.openAlready = false;
    };

    processing.draw = function () {

      processing.background(0);
      processing.stroke(255);
      processing.line(0, p.height / 2, p.width, p.height / 2);

      balls.forEach(function(item){
        item.paint();
      });

      balls[0].jump(40, 500);
      //console.log(note+" "+pitch);

      if(openAlready){

        if( processing.dist( prePosition[0], prePosition[1], balls[0].x, balls[0].y ) > 6 ){
          var position = {
            a:balls[0].x,
            b:balls[0].y
          }
          connections.send(position);

          prePosition[0] = balls[0].x;
          prePosition[1] = balls[0].y;
        }

        //balls[1].paint();

      }

	  };

    processing.mousePressed = function(){

      var disX = p.mouseX - balls[0].x;
      balls[0].x += disX * 0.1;

    };

  }

  //exports.me = me;

  function onConnection(){
    connections.on('open',function(){

      exports.openAlready = true;
      var idCard = { myIdCard : myId };
      connections.send(idCard);
      console.log(idCard)
      //balls[1] = new Ball ( otherX, otherY, otherN, otherP );
      balls.push(new Ball(otherX, otherY, otherN, otherP));

      connections.on('data',function(data){
        otherId = data.myIdCard;
        console.log(otherId);
        if(data.a != null && data.b != null){
          balls[1].x = data.a;
          balls[1].y = data.b;
        }
      });

    });
  }
  connectionReady(onConnection);
  //exports.openAlready = openAlready;

})(this);