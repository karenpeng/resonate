(function (exports) {
  var conn;
  var c;
  exports.connections = null;
  exports.mediaStream = null;
  exports.connectAlready = false;
  exports.iAmShooting = false;
  var reStartCount = 0;

  var counter = 0;
  var keyCounter = 0;
  var hisVoice = document.getElementById("somebodyVoice");
  var readyCallback = function () {};

  exports.connectionReady = function (callback) {
    readyCallback = callback;
  };

  function setConnection(conn) {
    exports.connections = conn;
    readyCallback();
  }

  var sendWithType = function (type, data) {
    if (!exports.connections) {
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

  peer.on('open', function (id) {
    $('#pid').text(id);
    exports.myId = peer.id;
  });

  function onConnection() {
    exports.connections.on('open', function () {

      exports.connectAlready = true;
      if (reStartCount === 0) {
        reStart();
        reStartCount = 1;
      }

      exports.connections.on('data', function (message) {

        switch (message.type) {

        case 'upData':
          //console.log(message.data.hh);
          mashes[1].goUp(message.data.hh);
          break;

        case 'rightData':
          mashes[1].addF(right);
          break;

        default:
          console.log('unknow message type:', message.type);
        }

      });

    });
  }
  connectionReady(onConnection);

  peer.on('connection', function (conn) {
    if (exports.connections) {
      return;
    }
    //peer.removeListener('connection');
    setConnection(conn);
  });

  peer.on('error', function (err) {
    alert(err.message);
  });

  peer.on('call', function (call) {
    call.answer(pitchDetector.audioStream);
    call.on('stream', function (stream) {
      $('#somebodyVoice').prop('src', URL.createObjectURL(stream));
    });
  });

  $(document).ready(function () {

    $('#connect').click(function () {
      if (exports.connections) {
        return;
      }
      c = peer.connect($('#rid').val());
      //peer.removeListener('connection');
      setConnection(c);

      iAmInit = true;

      var call = peer.call($('#rid').val(), pitchDetector.audioStream);
      // call.on('stream', function (stream) {
      //   $('#somebodyVoice').prop('src', URL.createObjectURL(stream));
      // });

      c.on('error', function (err) {
        alert(err);
      });

    });

    $(window).keydown(function (event) {
      if (event.which === 32) {
        keyCounter++;
        event.preventDefault();
        exports.iAmShooting = true;
        if (exports.connectAlready && keyCounter < 2) {
          var heIsShootingData = {
            heShoots: exports.iAmShooting
          };
          sendWithType('heIsShooting', heIsShootingData);
        }
      }
    });

    $(window).keyup(function (event) {
      exports.iAmShooting = false;
      keyCounter = 0;
      if (exports.connectAlready) {
        var heIsShootingData = {
          heShoots: exports.iAmShooting
        };
        sendWithType('heIsShooting', heIsShootingData);
      }
    });

  });

  exports.sendWithType = sendWithType;
})(this);