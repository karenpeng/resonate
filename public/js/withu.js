(function(exports){
  var conn;
  var c;
  exports.connections = null;
  exports.mediaStream = null;
  exports.connectAlready = false;
  exports.iAmShooting = false;

  var counter = 0;
  var keyCounter = 0;
  var hisVoice = document.getElementById("somebodyVoice");
  var readyCallback = function(){};

  exports.connectionReady = function(callback){
    readyCallback = callback;
  };

  function setConnection(conn){
    exports.connections = conn;
    readyCallback();
  }

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

  function onConnection(){
    exports.connections.on('open',function(){

      exports.connectAlready = true;

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
            hisBullets.push(
              new Bullet(message.data.bulletX, message.data.bulletY, otherP, message.data.bulletVolume, message.data.bulletDirection)
              );
            break;

          case 'heIsShooting':
            if(message.data.heShoots){
              console.log("play");
              hisVoice.play();
            }
            else{
              console.log("pause");
              hisVoice.pause();
            }
            break;

          default:
            console.log('unknow message type:', message.type);
        }

      });

    });
  }
  connectionReady(onConnection);


  peer.on('connection',function(conn){
    if(exports.connections){
      return;
    }
    //peer.removeListener('connection');
    setConnection(conn);
  });

  peer.on('error', function(err){
      alert(err.message);
  });

  peer.on('call',function(call){
    call.answer(pitchDetector.audioStream);
    call.on('stream',function(stream){
      $('#somebodyVoice').prop('src', URL.createObjectURL(stream));
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

      var call = peer.call($('#rid').val(), audioStream);

      c.on('error', function(err){
        alert(err);
      });

    });

    $(window).keydown(function(event){
        if(event.which === 32 ){
          keyCounter ++;
          event.preventDefault();
          exports.iAmShooting = true;
          if(exports.connectAlready && keyCounter < 2 ){
            var heIsShootingData = {
              heShoots: exports.iAmShooting
            };
            sendWithType('heIsShooting', heIsShootingData);
          }
        }
    });

    $(window).keyup(function(event){
        exports.iAmShooting = false;
        keyCounter = 0;
        if(exports.connectAlready){
          var heIsShootingData = {
            heShoots: exports.iAmShooting
          };
          sendWithType('heIsShooting', heIsShootingData);
        }
    });

  });

exports.sendWithType = sendWithType;
})(this);