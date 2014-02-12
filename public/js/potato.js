(function (exports) {

  var canvas = document.getElementById("myCanvas");
  var potatoes = [];
  var otherN, otherP;
  var myBullets = [];
  var hisBullets = [];
  exports.wall = 0;

  var p = new Processing(canvas, sketchProc);
  // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var n, connectFrameCounter, shootCounter;
    var prePosition = [];
    var monsters = [];
    //exports.wall = 0;

    processing.setup = function () {
      n = 20;
      connectFrameCounter = 0;
      shootCounter = 0;
      processing.size(1201, 680);
      processing.frameRate(20);
      processing.smooth();
      $("#over").hide();

      potatoes.push(new Potato(processing.width / 2, processing.height - 40,
        n, processing));
      //potatoes[0] = new Potato( processing.width / 2, processing.height / 2, n, processing );
      otherN = n;
      otherP = processing;

      prePosition = [processing.width / 2, processing.height / 2];
      exports.connectAlready = false;
    };

    processing.draw = function () {

      processing.background(0);

      if (wall >= processing.width - potatoes[0].n) {
        $("#over").show();
        console.log("game over");
        processing.noLoop();
      }

      processing.stroke(255);
      processing.line(0, processing.height - 40, processing.width, processing
        .height - 40);

      potatoes[0].x = processing.constrain(potatoes[0].x, exports.wall +
        potatoes[0].n / 2,
        processing.width -
        potatoes[0].n / 2);

      potatoes[0].jump(40, 560);
      potatoes.forEach(function (item) {
        item.paint();
      });

      if (connectAlready) {

        if (processing.dist(prePosition[0], prePosition[1], potatoes[0].x,
          potatoes[0].y) > 6) {
          var potatoInfoData = {
            potatoX: potatoes[0].x,
            potatoY: potatoes[0].y,
            potatoDirection: potatoes[0].direction,
            potatoColor: [
              potatoes[0].c1, potatoes[0].c2, potatoes[0].c3
            ]
          };
          sendWithType('potatoInfo', potatoInfoData);
          prePosition[0] = potatoes[0].x;
          prePosition[1] = potatoes[0].y;
        }

        connectFrameCounter++;
      }

      if (connectFrameCounter !== 0) {
        //var time = map(Math.sq(connectFrameCounter / 10), 0, 10000000000000, 1, 10000);
        if ((connectFrameCounter * connectFrameCounter) % 1000 === 0) {
          var power = Math.sin(connectFrameCounter) * 30 + 46;
          var speed = Math.sin(connectFrameCounter * 10) * 4 + 4.2;
          var monsterY = processing.map(Math.sin(connectFrameCounter * 4), -1,
            1,
            power,
            processing.height - 40 - power);

          monsters.push(new Monster(monsterY, power, processing, speed));
        }
      }
      monsters.forEach(function (item) {
        item.fly();
        item.buildWall();
        for (var i = 0; i < myBullets.length; i++) {
          item.fight(myBullets[i].x, myBullets[i].y, myBullets[i].v);
        }
        for (var j = 0; j < hisBullets.length; j++) {
          item.fight(hisBullets[j].x, hisBullets[j].y, hisBullets[j].v);
        }
        item.display();
      });

      if (iAmShooting) {
        //console.log(pitchDetector.getAverageVolume());
        var myVolume = processing.map(pitchDetector.getAverageVolume(), 126,
          138, 2, 40);
        if (shootCounter % 2 === 0) {
          myBullets.push(new Bullet(potatoes[0].x, potatoes[0].y,
            processing,
            myVolume, potatoes[0].direction, potatoes[0].c1, potatoes[0].c2,
            potatoes[0].c3));
          if (connectAlready) {
            //how many bullets are here?
            var bulletInfoData = {
              bulletX: potatoes[0].x,
              bulletY: potatoes[0].y,
              bulletVolume: myVolume,
              bulletDirection: potatoes[0].direction
            };
            sendWithType('bulletInfo', bulletInfoData);
          }
        }
        shootCounter++;
      }

      myBullets.forEach(function (item) {

        item.update();
        for (var k = 0; k < monsters.length; k++) {
          item.shoot(monsters[k].x, monsters[k].y);
        }
        item.show(potatoes[0].direction);
      });

      hisBullets.forEach(function (item) {
        item.update(potatoes[1].direction);
        for (var m = 0; m < monsters.length; m++) {
          item.shoot(monsters[m].x, monsters[m].y);
        }
        item.show(potatoes[1].direction);
      });

      for (var n = 0; n < myBullets.length; n++) {
        if (myBullets[n].v < 1 || myBullets[n].x < -myBullets[n].v / 2 ||
          myBullets[n].x > processing.width + myBullets[n].v / 2 ||
          myBullets[
            n].life < 0) {
          myBullets.splice(n, 1);
        }
      }
      for (var o = 0; o < hisBullets.length; o++) {
        if (hisBullets[o].v < 2 || hisBullets[o].x < wall - hisBullets[o].v /
          2 ||
          hisBullets[o].x > processing.width + hisBullets[o].v / 2) {
          hisBullets.splice(o, 1);
        }
      }
      for (var p = 0; p < monsters.length; p++) {
        if (monsters[p].power <= 8) {
          monsters.splice(p, 1);
        }
      }

    };

    $(window).keydown(function (event) {
      if (event.which === 37) {
        potatoes[0].direction = 'left';
        potatoes[0].x -= 16;
      }
      if (event.which === 39) {
        potatoes[0].direction = 'right';
        potatoes[0].x += 16;
      }
      potatoes[0].x = processing.constrain(potatoes[0].x, exports.wall +
        potatoes[0].n / 2,
        processing.width -
        potatoes[0].n / 2);
    });

  }

  exports.potatoes = potatoes;
  exports.otherN = otherN;
  exports.otherP = otherP;
  exports.myBullets = myBullets;
  exports.hisBullets = hisBullets;

})(this);