(function (exports) {
  var canvas = document.getElementById("myCanvas");

  //var me;
  //var openAlready;
  exports.connectAlready = null;
  var potatoes = [];
  var otherX, otherY, otherN, otherP;
  /*
  exports.otheX = null;
  exports.otherY = null;
  exports.otherN = null;
  exports.otherP = null;
  */

  var p = new Processing(canvas, sketchProc);
    // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var n                   = 20;
    var prePosition         = [];

    processing.setup = function () {

      processing.size(1201, 700);
      processing.frameRate(20);
      processing.smooth();
      potatoes.push(new Potato(processing.width / 2, processing.height / 2, n, processing));
      //potatoes[0] = new Potato( processing.width / 2, processing.height / 2, n, processing );
      otherX = processing.width / 2;
      otherY = processing.height / 2;
      otherN = n;
      otherP = processing;
      /*
      exports.otherX = processing.width / 2;
      exports.otherY = processing.height / 2;
      exports.otherN = n;
      exports.otherP = processing;
      */

      prePosition = [processing.width / 2, processing.height / 2];
      //me = potatoes[0];
      exports.connectAlready = false;
    };

    processing.draw = function () {

      processing.background(0);
      processing.stroke(255);
      processing.line(0, p.height / 2, p.width, p.height / 2);

      potatoes.forEach(function(item){
        item.paint();
      });

      potatoes[0].jump(40, 500);

      if(exports.connectAlready){

        if( processing.dist( prePosition[0], prePosition[1], potatoes[0].x, potatoes[0].y ) > 6 ){
          var position = {
            a:potatoes[0].x,
            b:potatoes[0].y
          }
          connections.send(position);

          prePosition[0] = potatoes[0].x;
          prePosition[1] = potatoes[0].y;
        }
      }
	  };

    processing.mousePressed = function(){
      var disX = p.mouseX - potatoes[0].x;
      if(disX < 0){
        potatoes[0].direction = "left";
      }
      else{
        potatoes[0].direction = "right";
      }
      potatoes[0].x += disX * 0.1;
    };

  }

  //exports.me = me;
  exports.connectAlready = connectAlready;
  exports.potatoes = potatoes;
  exports.otherX = otherX;
  exports.otherY = otherY;
  exports.otherN = otherN;
  exports.otherP = otherP;

})(this);