var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

let players = new Map();
let started = false;
let whoStarts;

io.on('connection', function (socket) {
  console.log('connection acquired');
  console.log(socket.id);

  socket.emit('client id', {
    clientid : socket.id
  });

  socket.on('join game', function (data) {
    console.log('join game request');
    console.log(data);

    if (players.size < 2) {
      players.set(data.clientid, data);
      io.sockets.connected[data.clientid].emit('join game', {
        joined: true
      });
    } else {
      io.to(data.clientid).emit('join game', {
        joined: false
      });
    }

    if (players.size == 1) {
      whoStarts = data.clientid;
    }

    if (started == false && players.size == 2) {
      started = true;
      let nextRoundStart;
      for (var [clientid, data] of players.entries()) {
        if(clientid == whoStarts) {
          io.to(clientid).emit('start game', {
            yourTurn : true
          });
        } else {
          nextRoundStart = clientid;
          io.to(clientid).emit('start game', {
            yourTurn : false
          })
        }
      }
      whoStarts = nextRoundStart;
    }
  });

  socket.on('select movie', function () {
    
  });

  socket.on('guess movie', function () {

  });

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
  });

});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
