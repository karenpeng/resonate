  (function (exports){
    "use strict";

    var Ball = function (x,y,n,p){

    this.x = x;
    this.y = y;
    this.n = n;
    this.processing = p;
  };

    Ball.prototype.paint = function(){

      this.processing.fill(255);
      this.processing.noStroke();
      this.processing.ellipse(this.x,this.y,this.n,this.n);
      this.processing.fill(0);
      this.processing.ellipse(this.x - 3, this.y - 3, 3, 3);
      this.processing.ellipse(this.x + 3, this.y - 3, 3, 3);
    };

    Ball.prototype.jump = function(min,max){

      if(note != undefined){

        var heit;

        if(pitch === 11025){
         heit = this.processing.height / 2;
        }
        else{
         heit = this.processing.map(pitch, min, max, this.processing.height - this.n, this.n);
        }

        var disY = heit - this.y;
        this.y += disY * 0.1;
        this.y = this.processing.constrain(this.y, this.n, this.processing.height - this.n);
      }

    };

    exports.Ball = Ball;
    /*
    console.log(exports===this);
    console.log(exports===window);
    console.log('exec this function');
    */
    })(this);