  (function (exports){
    'use strict';

    var Potato = function (x, y, n, p){

      this.x = x;
      this.y = y;
      this.n = n;
      this.processing = p;
      this.direction = 'right';
    };

    Potato.prototype.jump = function(min, max){

      if(pitchDetector.pitch){

        var heit;

        if(pitchDetector.pitch === 11025){
         heit = this.processing.height / 2;
        }
        else{
         heit = this.processing.map(pitchDetector.pitch, min, max, this.processing.height - this.n, this.n);
        }

        var disY = heit - this.y;
        this.y += disY * 0.1;
        this.y = this.processing.constrain(this.y, this.n, this.processing.height - this.n);
      }

    };

    Potato.prototype.paint = function(){

      this.processing.fill(255);
      this.processing.noStroke();
      this.processing.ellipse(this.x,this.y,this.n,this.n);
      this.processing.fill(0);
      this.processing.ellipse(this.x - 3, this.y - 3, 3, 3);
      this.processing.ellipse(this.x + 3, this.y - 3, 3, 3);
    };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var Bullet = function(x, y, p){
      this.x = x;
      this.y = y;
      this.processing = p;
      this.life = 100;
    };

    Bullet.prototype.update = function(string, v){
      //this.v --;
      if(string === 'right'){
        this.x+=2;
      }
      else{
        this.x-=2;
      }
      this.v = v;
      this.life --;
    };

    Bullet.prototype.shoot = function(x, y){
      var bulletCheck = this.processing.dist(this.x, this.y, x, y);
      if(bulletCheck < 2){
        this.v = 0;
      }
    };

    Bullet.prototype.show = function(string){
      this.processing.fill(255);
      this.processing.noStroke();
      if(string === 'right'){
        this.processing.ellipse(this.x + 10, this.y, this.v, this.v);
      }
      else{
        this.processing.ellipse(this.x - 10, this.y, this.v, this.v);
      }
    };

////////////////////////////////////////////////////////////////////////////////////////////////////////
    var Monster = function(x, y, power, p){
      this.x = x;
      this.y = y;
      this.power = power;
      this.processing = p;
    };

    Monster.prototype.fly = function(randomX, randomY){
      this.x += randomX;
      this.y += randomY;
    };

    Monster.prototype.fight = function(x, y){
      var bulletCheck = this.processing.dist(this.x, this.y, x, y);
      if(bulletCheck < 2){
        power --;
      }
    };

    Monster.prototype.display = function(){
      this.processing.fill(255);
      this.processing.noStroke();
      this.processing.ellipse(this.x, this.y, this.power, this.power);
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