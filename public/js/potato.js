(function () {
  "use strict";
    // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {
    var p                     = processing,
      n                       = 20,
      balls                   = [];
	  
      
	function ball(x,y){
				
		this.x=x;
		this.y=y;

		this.paint = function(){
			
			p.fill(255);
      p.noStroke();
      p.ellipse(this.x,this.y,n,n);
      p.fill(0);
      p.ellipse(this.x-3,this.y-3,3,3);
      p.ellipse(this.x+3,this.y-3,3,3);
		};

    }


	
    p.setup = function () {

      p.size(1201, 700);
      //p.frameRate(18);
      p.smooth();

      balls.push(new ball(p.width/2,p.height/2));

    };


  p.draw = function () {

      p.background(0);

      p.stroke(255);
      p.line(0,p.height/2,p.width,p.height/2);

      balls[0].paint();
      console.log(pitch);

      if(note!=undefined){

       jump();
      }
	};

  p.mousePressed = function(){

    var disX=p.mouseX-balls[0].x;
   
    balls[0].x+=disX*.1;

  };

function jump(){

    var heit;
    /*
    if(note==125){
      heit=p.height/2;
    }
    else{
      heit= p.map(note,40,80,p.height-n,n);
    }
    */
    if(pitch==11025){
      heit=p.height/2;
    }
    else{
      heit= p.map(pitch,40,500,p.height-n,n);
    }
    var disY = heit-balls[0].y;
    balls[0].y+=disY*.1;
    balls[0].y=p.constrain(balls[0].y,n,p.height-n);

  };


  }

  var canvas = document.getElementById("myCanvas"),
    p = new Processing(canvas, sketchProc);
 
}());