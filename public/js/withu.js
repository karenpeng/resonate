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

      var initPosition = {
        initX: potatoes[0].x,
        initY: potatoes[0].y
      }
      exports.connections.send(initPosition);

      exports.connections.on('data',function(data){

        if(counter === 0 && data.initX != null && data.initY != null){
          potatoes.push(new Potato(data.initX, data.initY, otherN, otherP));
          counter = 1;
        }

        if(data.potatoX != null && data.potatoY != null && data.potatoDirection != null){
          potatoes[1].x = data.potatoX;
          potatoes[1].y = data.potatoY;
          potatoes[1].direction = data.potatoDirection;
        }
        if(data.bulletX != null && data.bulletY != null){
          hisBullets.push( new Bullet(data.bulletX, data.bulletY, otherP));
        }
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
      if(0===0){
        $('#somebodyVoice').prop('src', URL.createObjectURL(stream));
        console.log('omg i display your stream');
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
        alert(err)
      });
    });

    $(window).keypress(function(event){
      if(event.which === 32 ){
        event.preventDefault();
        exports.iAmShooting = true;
      }
    });

    $(window).keyup(function(event){
      exports.iAmShooting = false;
    });

  });

//exports.iAmShooting = iAmShooting;
})(this)