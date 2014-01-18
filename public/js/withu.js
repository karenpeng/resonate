(function(exports){
  exports.connections = null;

  var readyCallback = function(){};

  exports.connectionReady = function(callback){
    readyCallback = callback;
  };

  function setConnection(conn){
    exports.connections = conn;
    readyCallback();
  }
  // Connect to PeerJS, have server assign an ID instead of providing one
  var conn;
  var c;
  exports.myId = null;
  exports.otherId = null;
  exports.mediaStream = null;

  pitchDetector.startLiveInput();

/*
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;
  navigator.getUserMedia({ audio: true, video: false}, function(stream){
    $(window).prop('src', URL.createObjectURL(stream));
      window.localStream = stream;
  });
*/
  var peer = new Peer({
    //key: '6vs0jb4y7a2zw7b9', debug: true
    host: 'resonate-peer-server.herokuapp.com',
    port: 80
  });
  peer.on('open', function(id){
    $('#pid').text(id);
    exports.myId = peer.id;
  });
  // Await connections from others

  peer.on('connection',function(conn){
    //conn = c;
    //conn.on('open', function() {

    if(exports.connections){
      return;
    }
    //exports.connections = conn;
    //peer.removeListener('connection');
    setConnection(conn);
    //});
    //peer.disconnect(alert("Hey your peer is gone!"));
  });

  peer.on('error', function(err){
      alert(err.message);
  });

  peer.on('call',function(call){
    console.log("omg i receive your call");
    //call.answer(pitchDetector.mediaStreamSource);
    call.on('stream',function(stream){
      $('#their-video').prop('src', URL.createObjectURL(stream));
      //pitchDetector.mediaStreamSource = stream;
      console.log('omg i receive your stream');
    });
  });

  $(document).ready(function() {
    // Conect to a peer
    $('#connect').click(function(){
    //c.on('open', function(){

      if(exports.connections){
        return;
      }
      c = peer.connect($('#rid').val());
      //exports.connections = c;
      //peer.removeListener('connection');
      setConnection(c);
      //});
      c.on('error', function(err){
        alert(err)
      });

    });


    $(window).keypress(function(event){
      if(event.which === 32){
        event.preventDefault();
        console.log(window.otherId);
/*
        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia;
        navigator.getUserMedia({ audio: true, video: false}, function(stream){
          $(window).prop('src', URL.createObjectURL(stream));
          window.localStream = stream;
        });
*/
        var call = peer.call(window.otherId, window.localStream);
        $('#my-video').prop('src', URL.createObjectURL(pitchDetector.mediaStreamSource));
        window.localStream = pitchDetector.mediaStreamSource;
      }
    });


  });

  //exports.connections = connections;
  //console.log( "here is the val before export", myId, otherId);
  //exports.myId = myId;
  //exports.otherId = otherId;
})(this)