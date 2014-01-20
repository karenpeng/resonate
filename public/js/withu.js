(function(exports){
  exports.connections = null;

  pitchDetector.startLiveInput();

  var readyCallback = function(){};

  exports.connectionReady = function(callback){
    readyCallback = callback;
  };

  function setConnection(conn){
    exports.connections = conn;
    readyCallback();
  }

  var conn;
  var c;
  exports.myId = null;
  exports.otherId = null;
  exports.mediaStream = null;
  exports.iAmShooting = null;
  var counter = 0;
  var ifHeIsShooting = false;

  var sendWithType = function (type, data) {
    if(!exports.connections){
      console.warn('do not init connection');
      return;
    }
    exports.connections.send({
      type: type,
      data: data
    });
  };

  var peer = new Peer({
    host: 'resonate-peer-server.herokuapp.com',
    port: 80
  });
  peer.on('open', function(id){
    $('#pid').text(id);
    exports.myId = peer.id;
  });


  peer.on('connection',function(conn){
    if(exports.connections){
      return;
    }
    //peer.removeListener('connection');
    setConnection(conn);
  });

  function onConnection(){
    exports.connections.on('open',function(){

      connectAlready = true;

      var initPositionData = {
        initX: potatoes[0].x,
        initY: potatoes[0].y
      };
      sendWithType('initPosition', initPositionData);

      exports.connections.on('data',function(message){

        switch(message.type){
          case 'initPosition':
            if(counter === 0){
              potatoes.push(new Potato(message.data.initX, message.data.initY, otherN, otherP));
              counter = 1;
            }
            break;

          case 'potatoInfo':
            potatoes[1].x = message.data.potatoX;
            potatoes[1].y = message.data.potatoY;
            potatoes[1].direction = message.data.potatoDirection;
            break;

          case 'bulletInfo':
            hisBullets.push( new Bullet(message.data.bulletX, message.data.bulletY, otherP));
            break;

          case 'heIsShooting':
            ifHeIsShooting = message.data.heShoots;
            console.log(ifHeIsShooting);
            break;

          default:
            console.log('unknow message type:', message.type);
        }

/*
        if(counter === 0 && data.initX !== undefined && data.initY !== undefined){
          potatoes.push(new Potato(data.initX, data.initY, otherN, otherP));
          counter = 1;
        }

        if(data.potatoX !== undefined && data.potatoY !== undefined && data.potatoDirection !== undefined){
          potatoes[1].x = data.potatoX;
          potatoes[1].y = data.potatoY;
          potatoes[1].direction = data.potatoDirection;
        }
        if(data.bulletX !== undefined && data.bulletY !== undefined){
          hisBullets.push( new Bullet(data.bulletX, data.bulletY, otherP));
        }

        if(data.heShoots !== undefined){
          ifHeIsShooting = data.heShoots;
          console.log(ifHeIsShooting);
        }
*/
      });

    });
  }
  connectionReady(onConnection);


  peer.on('error', function(err){
      alert(err.message);
  });

  peer.on('call',function(call){

    call.answer(pitchDetector.audioStream);
    call.on('stream',function(stream){
      if(ifHeIsShooting){
        console.log("ok");
        $('#somebodyVoice').prop('src', URL.createObjectURL(stream));
      }
      else{
        console.log('waht?');
        $('#somebodyVoice').prop();
      }
    });
  });

  $(document).ready(function() {

    $('#connect').click(function(){

      if(exports.connections){
        return;
      }
      c = peer.connect($('#rid').val());
      //peer.removeListener('connection');
      setConnection(c);

      var call = peer.call($('#rid').val(), pitchDetector.audioStream);

      c.on('error', function(err){
        alert(err);
      });
    });

    $(window).keypress(function(event){
      if(event.which === 32 ){
        event.preventDefault();
        exports.iAmShooting = true;
        if(connectAlready){
          var heIsShootingData = {
            heShoots: exports.iAmShooting
          };
          sendWithType('heIsShooting', heIsShootingData);
        }
      }
    });

    $(window).keyup(function(event){
      exports.iAmShooting = false;
      if(connectAlready){
          var heIsShootingData = {
            heShoots: exports.iAmShooting
          };
          sendWithType('heIsShooting', heIsShootingData);
      }
    });

  });

//exports.iAmShooting = iAmShooting;
exports.sendWithType = sendWithType;
})(this);