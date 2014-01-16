  // Connect to PeerJS, have server assign an ID instead of providing one
  var conn;
  var peer = new Peer({key: '6vs0jb4y7a2zw7b9', debug: true});
  peer.on('open', function(id){
    $('#pid').text(id);
  });
  // Await connections from others

  peer.on('connection',connect);

  function connect(c){
    conn=c;
    conn.on('open', function() {
    // Receive messages
      conn.on('data', function(data) {
       console.log("omg i received", data);
      });

      // Send messages
      var location = {
        a: me.x,
        b: me.y
      };
      //conn.send(location);
      conn.send('hello');
      console.log("i know my location"+" "+me.x+" "+me.y);
    });
  }

$(document).ready(function() {
    // Conect to a peer
  $('#connect').click(function(){
    var c = peer.connect($('#rid').val());

    c.on('open', function(){
        connect(c);
    });
    c.on('error', function(err){
      alert(err)
    });

  });

});

/*
var peer1 = new Peer({ key: '6vs0jb4y7a2zw7b9', debug: 3});
    // Create another Peer with our demo API key to connect to.
var peer2 = new Peer({ key: '6vs0jb4y7a2zw7b9', debug: 3});

    // The `open` event signifies that the Peer is ready to connect with other
    // Peers and, if we didn't provide the Peer with an ID, that an ID has been
    // assigned by the server.
peer1.on('open', function(id){
  var peerId1 = id;
  var c = peer2.connect(peerId1);
  c.on('data', function(data) {
        // When we receive 'Hello', send ' world'.
    $('#helloworld').append(data);
    c.send(' peer');
  });
});

    // Wait for a connection from the second peer.
peer1.on('connection', function(connection) {
      // This `connection` is a DataConnection object with which we can send
      // data.
      // The `open` event firing means that the connection is now ready to
      // transmit data.
  connection.on('open', function() {
        // Send 'Hello' on the connection.
    connection.send('Hello,');
  });
      // The `data` event is fired when data is received on the connection.
  connection.on('data', function(data) {
        // Append the data to body.
    $('#helloworld').append(data);
  });
});
*/

/*
var obj = {
  a: 1,
  b: 2,
  c: 3
}
for (var key in obj) {
  console.log(key, obj[key]);
}

var arr = [1, 2, 3];

arr.forEach(function (item) {
  console.log(item);
});

var newArr = arr.map(function (item) {
  return item * 2;
});

console.log(newArr);
*/