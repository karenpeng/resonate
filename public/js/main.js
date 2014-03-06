(function (exports) {

  var gravity, left, right;
  var threshold;
  var invisibleSpring;
  var counter;
  var mashes = [];
  var blocks = [];
  var bullets = [];
  var wat = 0.01;
  hit = 0;
  var blockCounter = 0;
  var getTextCounter = 0;
  var theta = 0;
  var connectCount;
  exports.iAmInit;
  exports.reBegin;

  function beCenter(w, selector) {
    var windowWidth = window.innerWidth;
    var gap = (windowWidth - w) / 2;
    var gapString = gap.toString();
    var gapCss = gapString + 'px';
    $(selector).css("margin-left", gapCss);
  }

  $(window).resize(function () {
    if (width) {
      beCenter(width, "canvas");
    }
  });

  exports.setup = function () {
    createGraphics(1204, 620);
    beCenter(width, "canvas");
    exports.width = width;
    exports.iAmInit = false;
    connectCount = 0;
    exports.reBegin = false;

    smooth();
    gravity = new PVector(0, 6);
    left = new PVector(-50, 0);
    right = new PVector(50, 0);

    mashes.push(new Mash(19, 4, 50, width / 2, height / 4));
    invisible = 30;
    invisibleSpring = [];
    counter = 0;
  };

  exports.reStart = function () {
    mashes = [];
    if (exports.iAmInit) {
      mashes[0] = new Mash(19, 4, 50, width / 4, height / 4);
      mashes[1] = new Mash(19, 4, 50, width * 3 / 4, height / 4);
    } else {
      mashes[0] = new Mash(19, 4, 50, width * 3 / 4, height / 4);
      mashes[1] = new Mash(19, 4, 50, width / 4, height / 4);
    }
    bullets = [];
    exports.reBegin = true;
  }

  exports.draw = function () {
    background(255);
    mashes.forEach(function (item) {
      item.renew();
      item.show();
      item.getCenter();
      if (!item.up) {
        item.addF(gravity);
      }
    });
    mashes[0].goUp(mapPitch(pitchDetector.pitch));

    if (wat >= 1) {
      wat -= 0.00001;
    }

    // if (connectAlready) {
    //   if (theta === 0) {
    //     reStart();
    //   }
    //if (map(cos(theta), -1, 1, 0, 1) < wat) {
    if (connectCount * connectCount % 1000 === 0) {
      var result = getText();
      if (result.t) {
        blocks.push(new Block(result.t, theta));
      }
      wat += 0.00001;
      theta++;
      connectCount++;
    }

    for (var i = blocks.length - 1; i > -1; i--) {
      blocks[i].die();
      if (blocks[i].isDead) {
        blocks.splice(i, 1);
      } else {
        blocks[i].move();
        blocks[i].show();
        blocks[i].check(mashes[0]);
      }
    }
    //mash.addF(right);
    //mash.addF(left);
    //jumper.renew();
    /*
  mash.b.forEach(function (item) {
    jumper.b.forEach(function (key) {
      var sub = PVector.sub(item.loc, key.loc);
      var dis = sub.mag();
      if (!item.check && !key.check && dis < invisible && abs(item.loc.x -
        key.loc.x) < 10) {
        invisibleSpring.push(new Spring(item, key));
        item.check = true;
        key.check = true;
      }
    });
  });
*/
    /*
  for (var j = 0; j < mash.b.length; j++) {
    for (var k = 0; k < jumper.b.length; k++) {
      var sub = PVector.sub(mash.b[j].loc, jumper.b[k].loc);
      var dis = sub.mag();
      if (!mash.b[j].check && !jumper.b[k].check && dis <= invisible && abs(
        mash
        .b[j].loc.x -
        jumper.b[k].loc.x) < 10) {
        invisibleSpring.push(new Spring(mash.b[j], jumper.b[k]));
        mash.b[j].check = true;
        jumper.b[k].check = true;
        invisibleSpring[counter].b1Num = j;
        invisibleSpring[counter].b2Num = k;
        invisibleSpring[counter].max *= 0.8;
        invisibleSpring[counter].min *= 1.2;
        counter++;
      }
    }
  }
  */
    /*
  //for (var i = invisibleSpring.length - 1; i > -1; i--) {
  for (var i = 0; i < invisibleSpring.length; i++) {
    invisibleSpring[i].connect();
    invisibleSpring[i].displayLine();
    invisibleSpring[i].constrainLength();
    var sub1 = PVector.sub(invisibleSpring[i].b1.loc, invisibleSpring[i].b2.loc);
    var dis1 = sub1.mag();
    if (dis1 > invisible) {
      mash.b[invisibleSpring[i].b1Num].check = false;
      jumper.b[invisibleSpring[i].b2Num].check = false;
      invisibleSpring.splice(i, 1);
    }
  }
*/
    for (var j = bullets.length - 1; j > -1; j--) {
      bullets[j].die();
      if (bullets[j].isDead) {
        bullets.splice(j, 1);
      } else {
        bullets[j].update();
        bullets[j].show();
        blocks.forEach(function (item) {
          bullets[j].check(item);
        })
      }
    }

    if (mashes[0].hurt) {
      hit += 0.6;
    }
    drawBoundary();

    if (hit >= height / 2) {
      textSize(60);
      fill(255);
      text("GAMEOVER", width / 2 - 180, height / 2);
      noLoop();
    }

    fill(0);
    var c = connectCount.toString();
    text(c, width / 2, height / 2);
    text(mashes.length, width / 2, height / 2 + 20);

  }

  function mapPitch(input) {
    var pitch;
    if (input < 10 || input > 1000) {
      pitch = 0;
    } else {
      pitch = map(input, 40, 700, 0, 30);
      pitch = constrain(pitch, 0, 30);
    }
    return pitch;
  }

  function mapVolume(input) {
    var volume;
    if (input < 127 || input > 140) {
      volume = 0;
    } else {
      volume = map(input, 127, 140, 0, 60);
      volume = constrain(volume, 0, 60);
    }
    return volume;
  }

  function getText() {
    if (blockCounter === 0) {
      getNYTimesData();
    }
    var t = articleObj[blockCounter];
    //if (t) {
    blockCounter++;
    //}
    if (blockCounter > 9) {
      blockCounter = 0;
    }
    return {
      t: t
    };
  }

  function drawBoundary() {
    fill(34);
    noStroke();
    rect(0, 0, width, hit);
    rect(0, height - hit, width, hit);
    rect(0, 0, hit, height);
    rect(width - hit, 0, hit, height);
  }

  /////////////////////////////////////////////////////////////////

  $(window).keydown(function (event) {
    event.preventDefault();
    if (event.which === 32) {
      if (!mashes[0].hurt) {
        var r = mapVolume(pitchDetector.volume);
        bullets.push(new Bullet(mashes[0].center.x, mashes[0].center[0].y,
          r));
      }
    }
  });

  $(window).keydown(function (event) {
    event.preventDefault();
    if (event.which === 37) {
      mashes[0].addF(left);
      if (connectAlready) {
        var leftData = {
          left: true
        };
        sendWithType('leftData', left);
      }
    }
  });

  $(window).keydown(function (event) {
    event.preventDefault();
    if (event.which === 39) {
      mashes[0].addF(right);
      if (connectAlready) {
        var rightData = {
          right: true
        };
        sendWithType('rightData', right);
      }
    }
  });

  exports.mashes = mashes;
  exports.hit = hit;
})(this);