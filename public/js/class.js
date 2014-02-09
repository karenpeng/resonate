  (function (exports) {
    'use strict';

    var Potato = function (x, y, n, p) {

      this.x = x;
      this.y = y;
      this.n = n;
      this.processing = p;
      this.direction = 'right';
      this.c1 = this.processing.random(255);
      this.c2 = this.processing.random(255);
      this.c3 = this.processing.random(255);
    };

    Potato.prototype.jump = function (min, max) {

      if (pitchDetector.pitch) {

        var heit;

        if (pitchDetector.pitch === 11025) {
          heit = this.processing.height - 40;
        } else {
          heit = this.processing.map(pitchDetector.pitch, min, max, this.processing
            .height - this.n, this.n);
        }

        var disY = heit - this.y;
        this.y += disY * 0.1;
        this.y = this.processing.constrain(this.y, this.n, this.processing.height -
          this.n);
      }

    };

    Potato.prototype.paint = function () {

      this.processing.fill(this.c1, this.c2, this.c3);
      this.processing.noStroke();
      this.processing.ellipse(this.x, this.y, this.n, this.n);
      this.processing.fill(0);
      this.processing.ellipse(this.x - 3, this.y - 3, 3, 3);
      this.processing.ellipse(this.x + 3, this.y - 3, 3, 3);
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var Bullet = function (x, y, p, v, direction, a, b, c) {
      this.x = x;
      this.y = y;
      this.vel = 0;
      this.acc = 2;
      this.processing = p;
      this.v = v;
      this.direction = direction;
      this.c1 = a;
      this.c2 = b;
      this.c3 = c;
    };

    Bullet.prototype.update = function () {
      //this.v --;
      this.vel += this.acc;
      if (this.direction === 'right') {
        this.x += this.vel;
      } else {
        this.x -= this.vel;
      }

      if (this.v > 8) {
        this.v -= this.v / 8;
      } else {
        this.v -= 0.4;
      }
    };

    Bullet.prototype.shoot = function (x, y) {
      var bulletCheck = this.processing.dist(this.x, this.y, x, y);
      if (bulletCheck < 2) {
        this.v = 0;
      }
    };

    Bullet.prototype.show = function (string) {
      this.processing.fill(this.c1, this.c2, this.c3, 200);
      this.processing.noStroke();
      if (string === 'right') {
        this.processing.ellipse(this.x + 10, this.y, this.v, this.v);
      } else {
        this.processing.ellipse(this.x - 10, this.y, this.v, this.v);
      }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    var Monster = function (y, power, p, speed) {
      this.y = y;
      this.power = power;
      this.processing = p;
      this.x = this.processing.width + this.power / 2;
      this.speed = speed;
      this.fixed = false;
    };

    Monster.prototype.fly = function () {
      if (!this.fixed) {
        this.x -= this.speed;
      }
    };

    Monster.prototype.fight = function (x, y, r) {
      if (!this.fixed) {
        var bulletCheck = this.processing.dist(this.x, this.y, x, y);
        if (bulletCheck < (this.power + r) / 2) {
          this.power -= 5;
        }
      }
    };

    Monster.prototype.buildWall = function () {
      if (this.x < -this.power / 2) {
        this.fixed = true;
        this.x = wall;
        wall += this.power;
      }
    };

    Monster.prototype.display = function () {
      if (!this.fixed) {
        this.processing.noFill();
        this.processing.stroke(255);
        this.processing.rect(this.x - this.power / 2, this.y - this.power / 2,
          this.power, this.power);
      } else {
        this.processing.fill(255);
        this.processing.rect(this.x, 0,
          this.power, this.processing.height);
      }
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    exports.Potato = Potato;
    exports.Bullet = Bullet;
    exports.Monster = Monster;
    /*
    console.log(exports===this);
    console.log(exports===window);
    console.log('exec this function');
    */
  })(this);