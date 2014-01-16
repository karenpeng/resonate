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
  var peer = new Peer({key: '6vs0jb4y7a2zw7b9', debug: true});
  peer.on('open', function(id){
    $('#pid').text(id);
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

  });

  //exports.connections = connections;

})(this)