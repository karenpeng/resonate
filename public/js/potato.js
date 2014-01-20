(function (exports) {
  var canvas = document.getElementById("myCanvas");

  exports.connectAlready = null;
  var potatoes = [];
  var otherN, otherP;
  var myBullets  = [];
  var hisBullets = [];

  var p = new Processing(canvas, sketchProc);
    // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var n, connectFrameCounter, shootCounter;
    var prePosition = [];
    var monsters  = [];

    processing.setup = function () {
      n = 20;
      connectFrameCounter  = 0;
      shootCounter = 0;
      processing.size(1201, 700);
      processing.frameRate(20);
      processing.smooth();
      potatoes.push(new Potato(processing.width / 2, processing.height / 2, n, processing));
      //potatoes[0] = new Potato( processing.width / 2, processing.height / 2, n, processing );
      otherN = n;
      otherP = processing;

      prePosition = [processing.width / 2, processing.height / 2];
      exports.connectAlready = false;
    };

    processing.draw = function () {

      processing.background(0);
      processing.stroke(255);
      processing.line(0, processing.height / 2, processing.width, processing.height / 2);

      potatoes[0].jump(40, 500);
      potatoes.forEach(function(item){
        item.paint();
      });

      if(exports.connectAlready){

        if( processing.dist( prePosition[0], prePosition[1], potatoes[0].x, potatoes[0].y ) > 6 ){
          var potatoInfo = {
            potatoX: potatoes[0].x,
            potatoY: potatoes[0].y,
            potatoDirection: potatoes[0].direction
          }
          connections.send(potatoInfo);
          prePosition[0] = potatoes[0].x;
          prePosition[1] = potatoes[0].y;
        }

        connectFrameCounter ++;
      }

      if( connectFrameCounter != 0 && connectFrameCounter % 100 === 0 ){
        var monsterX = processing.map( processing.sin(connectFrameCounter), 0, 1, 0, processing.width );
        var monsterY = processing.map( processing.cos(connectFrameCounter  ), 0, 1, 0, processing.height );
        monsters.push(new Monster( monsterX, monsterY, 30, processing));
      }
      monsters.forEach(function(item){
        item.fly();
        for(var i=0; i< myBullets.length; i++){
          item.fight(myBullets[i].x, myBullets[i].y);
        }
        for(var j=0; j< hisBullets.length; j++){
          item.fight(hisBullets[j].x, hisBullets[j].y);
        }
        item.display();
      })

      if(iAmShooting){
        if(shootCounter % 4 == 0){
          myBullets.push(new Bullet(potatoes[0].x, potatoes[0].y, processing));
          if(connectAlready){
            //how many bullets are here?
            var bulletInfo = { bulletX:potatoes[0].x , bulletY:potatoes[0].y };
            connections.send(bulletInfo);
          }
        }
        shootCounter++;
      }

      myBullets.forEach(function(item){
        item.update(potatoes[0].direction, Math.random()*2+4);
        for(var k=0; k< monsters.length; k++){
          item.shoot(monsters[k].x, monsters[k].y);
        }
        item.show(potatoes[0].direction);
      });

      hisBullets.forEach(function(item){
        item.update(potatoes[1].direction, Math.random()*4+4);
        for(var m=0; m< monsters.length; m++){
          item.shoot(monsters[m].x, monsters[m].y);
        }
        item.show(potatoes[1].direction);
      });


      for(var n=0; n<myBullets.length; n++){
        if(myBullets[n].v < 1 || myBullets[n].x < 0 || myBullets[n].x > processing.width || myBullets[n].life < 0){
          myBullets.splice(n,1);
        }
      }
      for(var o=0; o<hisBullets.length; o++){
        if(hisBullets[o].v < 1 || hisBullets[o].x < 0 || hisBullets[o].x > processing.width || hisBullets[o].life < 0){
          hisBullets.splice(o,1);
        }
      }
      for(var p=0; p<monsters.length; p++){
        if(monsters[p].power <= 0 || monsters[p].x < 0 || monsters[p].x > processing.width){
          monsters.splice(p,1);
        }
      }

	  };

    processing.mousePressed = function(){
      var disX = processing.mouseX - potatoes[0].x;
      if(disX < 0){
        potatoes[0].direction = "left";
      }
      else{
        potatoes[0].direction = "right";
      }
      potatoes[0].x += disX * 0.1;
    };

  }

  exports.connectAlready = connectAlready;
  exports.potatoes = potatoes;
  exports.otherN = otherN;
  exports.otherP = otherP;
  exports.myBullets = myBullets;
  exports.hisBullets = hisBullets;

})(this);