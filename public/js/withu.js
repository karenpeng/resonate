(function(exports){
  exports.connections = null;
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
    // Receive messages
    /*
      conn.on('data', function(data) {
       console.log("server received", data.a, data.b);
      });

      // Send messages
      var location = {
        a: me.x,
        b: me.y
      };

      conn.send(location);

      console.log("i know my location" + " " + me.x + " " + me.y);
    */
    if(exports.connections){
      return;
    }
    exports.connections = conn;
    //peer.removeListener('connection');

    //});
  });

  $(document).ready(function() {
    // Conect to a peer
    $('#connect').click(function(){
    //c.on('open', function(){

      /*
      c.on('data',function(data){
        console.log('client received', data.a, data.b);
      });

      var position = {
        a: me.x,
        b: me.y
      };

      c.send(position);
      */
      if(exports.connections){
        return;
      }
      c = peer.connect($('#rid').val());
      exports.connections = c;
      //peer.removeListener('connection');

      //});

      c.on('error', function(err){
        alert(err)
      });

    });

  });

  //exports.connections = connections;

})(this)