var peer = new Peer({key: '6vs0jb4y7a2zw7b9'});
peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
});
var conn = peer.connect('dest-peer-id');
peer.on('connection', function(conn) {
  console.log("hello!");
});

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
