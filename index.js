var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let players = new Set();
let gameStarted = false;
let whoPicks;
let nextWhoPicks;
let curMovie;
let roundStarted = false;
let guesses = [];

io.on('connection', function (socket) {
  console.log('connection from clientid: ' + socket.id);

  socket.emit('client id', {
    clientid: socket.id
  });

  socket.on('join game', function (data) {
    console.log('join game event');
    console.log(data);

    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined) return;
    if (gameStarted) {
      io.to(data.clientid).emit('error', {
        message: 'game already started'
      });
      return;
    }

    switch (players.size) {
      case 0:
        whoPicks = data.clientid;
        players.add(data.clientid);
        io.to(data.clientid).emit('join game', {
          joined: true
        });
      case 1:
        nextWhoPicks = data.clientid;
        players.add(data.clientid);
        io.to(data.clientid).emit('join game', {
          joined: true
        });
      default:
        io.to(data.clientid).emit('error', {
          message: 'game is full!'
        });
        return;
    }

    if (gameStarted == false && players.size == 2) {
      gameStarted = true;
      for (let clientid of mySet.values()) {
        var yourTurn;
        if (clientid == whoStarts) yourTurn = true;
        else yourTurn = false;
        io.to(clientid).emit('start game', {
          yourTurn: yourTurn
        });
      }
    }
  });

  socket.on('select movie', function (data) {
    console.log('select movie event');
    console.log(data);

    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined) return;
    if (!gameStarted) {
      io.to(data.clientid).emit('error', {
        message: 'game is not started'
      });
      return;
    }
    if (players[data.clientid] == undefined) {
      io.to(data.clientid).emit('error', {
        message: 'you are not part of this game!'
      });
      return;
    }
    if (roundStarted == true) {
      io.to(data.clientid).emit('error', {
        message: 'round already started!'
      });
      return;
    }
    if (whoStarts != data.clientid) {
      io.to(data.clientid).emit('error', {
        message: 'it is not your turn to pick!'
      });
      return;
    }
    if (data.imdbId == undefined) {
      io.to(data.clientid).emit('error', {
        message: 'you must send an imdbId!'
      });
      return;
    }

    request('http://www.omdbapi.com/?i=' + data.imdbId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)

        var info = JSON.parse(body);
        if (info.Response == false) {
          io.to(data.clientid).emit('error', {
            message: 'you must send a valid imdbId!'
          });
          return;
        }

        roundStarted = true;
        guesses = [];
        io.emit('start round', {
          timer: 120,
          imdbId: data.imdbId
        })

        setTimeout(function () {
          io.emit('round end', {
            //TODO: calculate points
          });

          let temp = whoPicks;
          whoPicks = nextWhoPicks;
          nextWhoPicks = temp;

          setTimeout(function () {
            //TODO: start next round
          }, 30000);

        }, 120000);
      }
    });
  });

  socket.on('guess movie', function (data) {
    console.log('guess movie event');
    console.log(data);

    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined) return;
    if (!gameStarted) {
      io.to(data.clientid).emit('error', {
        message: 'game is not started'
      });
      return;
    }
    if (players[data.clientid] == undefined) {
      io.to(data.clientid).emit('error', {
        message: 'you are not part of this game!'
      });
      return;
    }
    if (roundStarted != true) {
      io.to(data.clientid).emit('error', {
        message: 'round has not started!'
      });
      return;
    }
    if (data.imdbId == undefined) {
      io.to(data.clientid).emit('error', {
        message: 'you must send an imdbId!'
      });
      return;
    }

    request('http://www.omdbapi.com/?i=' + data.imdbId, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body)

        var info = JSON.parse(body);
        if (info.Response == false) {
          io.to(data.clientid).emit('error', {
            message: 'you must send a valid imdbId!'
          });
          return;
        }

        for (let clientid of mySet.values()) {
          var yourGuess;
          if (clientid == data.clientid) yourGuess = true;
          else yourGuess = false;

          var guessedFirst = true;
          for (var i = 0; i < guesses.length; i++) {
            if (guesses.imdbId == data.imdbId) {
              guessedFirst = false;
              break;
            }
          }

          io.to(clientid).emit('guess result', {
            yourGuess: yourGuess,
            imdbId: data.imdbId,
            guessedFirst: guessedFirst
          });
        }

        guesses.add({
          clientid: data.clientid,
          imdbId: data.imdbId
        });
      }
    });

  });

});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
