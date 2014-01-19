  (function (exports){
    "use strict";

    var Potato = function (x,y,n,p){

      this.x = x;
      this.y = y;
      this.n = n;
      this.processing = p;
      this.direction = "right";
    };

    Potato.prototype.paint = function(){

      this.processing.fill(255);
      this.processing.noStroke();
      this.processing.ellipse(this.x,this.y,this.n,this.n);
      this.processing.fill(0);
      this.processing.ellipse(this.x - 3, this.y - 3, 3, 3);
      this.processing.ellipse(this.x + 3, this.y - 3, 3, 3);
    };

    Potato.prototype.jump = function(min,max){

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

    var Bullet = function(Potato,v){
      this.x = Potato.x;
      this.y = Potato.y;
      this.v = v;
    };

    Bullet.prototype.update = function(){
      this.v --;
      if(Potato.direction === "right"){
        this.x+=2;
      }
      else{
        this.x-=2;
      }
    };

    Bullet.prototype.show = function(){
      this.processing.fill(255);
      this.processing.noStroke();
      if(Potato.direction === "right"){
        this.processing.ellipse(this.x + Potato.n, this.y, this.v, this.v);
      }
      else{
        this.processing.ellipse(this.x - Potato.n, this.y, this.v, this.v);
      }
    }

    exports.Potato = Potato;
    exports.Bullet = Bullet;
    /*
    console.log(exports===this);
    console.log(exports===window);
    console.log('exec this function');
    */
    })(this);