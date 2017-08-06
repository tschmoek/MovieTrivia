var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var port = process.env.PORT || 3000;

var guessManager = require('./guessManager')

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

io.on('connection', function (socket) {
  console.log('connection from clientid: ' + socket.id);

  socket.emit('client id', {
    clientid: socket.id
  });

  socket.on('join game', function (data) {

    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined){
      io.to(data.clientid).emit('error', {
        message: "something went wrong with id's"
      });
      return;
    }
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
        break;
      case 1:
        nextWhoPicks = data.clientid;
        players.add(data.clientid);
        io.to(data.clientid).emit('join game', {
          joined: true
        });
        break;
      default:
        io.to(data.clientid).emit('error', {
          message: 'game is full!'
        });
        return;
    }

    if (gameStarted == false && players.size == 2) {
      gameStarted = true;
      for (let clientid of players.values()) {
        var yourTurn;
        if (clientid == whoPicks) yourTurn = true;
        else yourTurn = false;
        io.to(clientid).emit('start game', {
          yourTurn: yourTurn
        });
      }
    }
  });

  socket.on('select movie', function (data) {
    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined) return;
    if (!gameStarted) {
      console.log('game is not started')
      io.to(data.clientid).emit('error', {
        message: 'game is not started'
      });
      return;
    }
    if (!players.has(data.clientid)) {
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
    if (whoPicks != data.clientid) {
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

    request('http://www.omdbapi.com/?i='+data.imdbId+"&apikey=1dd6a07c", function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        if (info.Response == false) {
          io.to(data.clientid).emit('error', {
            message: 'you must send a valid imdbId!'
          });
          return;
        }

        if(!guessManager.alreadyGuessed(info.imdbID)){
          guessManager.addGuess(info,data.clientid)
        }

        roundStarted = true;
        io.emit('start round', {
          movie: info,
          timer: 120,
          imdbId: data.imdbId
        })
          let temp = whoPicks;
          whoPicks = nextWhoPicks;
          nextWhoPicks = temp;
      }
    });
  });

  socket.on('guess movie', function (data) {
    //validation
    if (data == undefined || data.clientid == undefined || io.sockets.connected[data.clientid] == undefined) return;
    if (!gameStarted) {
      io.to(data.clientid).emit('error', {
        message: 'game is not started'
      });
      return;
    }
    if (!players.has(data.clientid)) {
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
    if (data.movie == undefined) {
      io.to(data.clientid).emit('error', {
        message: 'you must send a movie!'
      });
      return;
    }
    if(!guessManager.alreadyGuessed(data.movie.imdbID)){
        if(guessManager.addGuess(data.movie,data.clientid)){
          io.sockets.emit('guess added', {
            player : data.clientid,
            title : data.movie.Title,
            imdbId : data.movie.imdbID
          })
        }
        else{
          socket.emit('noncompliant')
        }
    }
    else{
      socket.emit('already guessed')
    }

  });

  socket.on('round end',function() {
      let totals = guessManager.calcTotals();
      socket.emit('points',totals);
  });


  });
http.listen(port, function () {
  console.log('listening on *:' + port);
});
