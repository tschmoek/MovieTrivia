let count = 4;
let count2= 75;
let player1points = 0;
let player2points = 0;
let guessli = [];
let pl1guess = []
let pl2guess = []
var socket = io();
var clientid;


$(function () {
    var turn;
    $("#joinGame").click(function(){
      socket.emit('join game', {
        clientid : clientid
      });
      return false;
    });
    socket.on('client id', function(data) {
      clientid = data.clientid;
    });

    socket.on('join game', function(data){
      if(data['joined'] === true){
        console.log('JOINED GAME')  
      }
    });

    socket.on('start game', function(data) {
      if(data['yourTurn'] === true){
        gameStartPlayer1();
      }else{
        gameStartPlayer2();
      }
    });

   $('#selection').click(function(){
    let response = getwithTitle($('#select-search-bar').val());
    if(response){
      socket.emit('select movie', {
      clientid : clientid,
      imdbId: response.imdbID
      });
    }
    else{
        alert('Movie not found');
        return;
    }

   });

    socket.on('start round',function(data){
      console.log("START ROUND")
      $('#movie-header').html(data.movie.Title);
      $("#poster-img").attr("src", data.movie.Poster);
      console.log(data.timer)
    });

    $('#guesses').click(function(){
    let response = getwithTitle($('#guess-search-bar').val());
    if(!response){
      alert('Movie not found')
      return;
    }
    else{
      socket.emit('guess movie',{
          clientid : clientid,
          movie : response
      });
    }
  });

  socket.on('guess added',function(data){
    if(data.player == clientid){
      $('#player1-results').append('<tr><td>'+data.title);
    }
    else{
      $('#player2-results').append('<tr><td>'+data.title);
    }
  });

  socket.on('already guessed',function(data){
    alert('Already Guessed that one..')
  });

  socket.on('noncompliant',function(data){
    alert('No corresponding actors')
  });

  socket.on('error',function(data){
    alert(data.message)
  });

  if($('body').find("#after-game").is(":visible"))
  {
    console.log('You may begin calculating results')
  }
});
  
window.onload = () => {
    document.getElementById("welcome").style.display = "block"
};

 let getwithTitle = function(title) {
  if(title){
  var url = "http://www.omdbapi.com/?t="+title+"&apikey=1dd6a07c";
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  return response;
  }else{
    return false;
  }
};

 let getwithId = function(imdbId) {
  var url = "http://www.omdbapi.com/?i=" + imdbId + "&apikey=1dd6a07c";
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  return response;
};

let gameStartPlayer1 = function () { 
    document.getElementById("welcome").style.display = "none";
    $('#welcome').css({display: 'none'})
    document.getElementById("selectMovie").style.display = "block";
    let startTimer = document.getElementById("start-timer");
    gameBeginCountDown(count + 1, startTimer);
 };

 let gameStartPlayer2 = function () { 
    document.getElementById("welcome").style.display = "none";
    document.getElementById("wait").style.display = "block";
    let startTimer = document.getElementById("start-timer");
    gameBeginCountDown(count + 1, startTimer);

 };

let gameBeginCountDown = (count, startTimer) => {
    startTimer.style.transition = "all .4s";
    startTimer.style.opacity = 0;
    //base case
    if (count === 0) {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("wait").style.display = "none";
    document.getElementById("selectMovie").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("player1-bar").style.opacity = "1";
    document.getElementById("player2-bar").style.opacity = "1";


    let gameTimer = document.getElementById("game-timer");
    EndGameCount(count2 + 1, gameTimer);                 
        return;
    }
    count--;
    startTimer.innerHTML = count;

    setTimeout(function () {
        gameBeginCountDown(count, startTimer);
    }, 1000);
    startTimer.style.opacity = 1;
}

let EndGameCount = (count2, gameTimer) => {
    gameTimer.style.transition = "all .4s";
    gameTimer.style.opacity = 0;
    //base case
    if (count2 === 0) {
      document.getElementById("search").style.display = "none";
      document.getElementById("final-score").style.display = "block";
      socket.emit('round end');
      socket.on('points',function(totals){
        if(totals.firstId == clientid){
          $("#player1score").append('<h2>'+totals.firstPoints+'</h2');
          $("#player2score").append('<h2>'+totals.secondPoints+'</h2');
        }else{
          $("#player1score").append('<h2>'+totals.secondPoints+'</h2');
          $("#player2score").append('<h2>'+totals.firstPoints+'</h2');
        }
      });
      return;
    }
    count2--;
    gameTimer.innerHTML = count2;

    setTimeout(function () {
        console.log('SET TIMEOUT CALLBACK')
        EndGameCount(count2, gameTimer);
    }, 1000);
    gameTimer.style.opacity = 1;
}