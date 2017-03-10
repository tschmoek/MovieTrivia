let count = 10;
let count2= 180;

  $(function () {
    var socket = io();
    var clientid;
    var turn;
    $("#joinGame").click(function(){
      console.log("This worked");
      socket.emit('join game', {
        clientid : clientid
      });
      return false;
    });
    socket.on('client id', function(data) {
      clientid = data.clientid;
      console.log(data);
      console.log('CLIENT ID on client side..',clientid);
    });

    socket.on('join game', function(data){
      console.log(data);
      console.log('JOIN GAME on client side..',data);
      if(data['joined'] === true){
        console.log('JOINED GAME')
      }
    });

    socket.on('start game', function(data) {
      console.log(data);
      if(data['yourTurn'] === true){
        console.log('MY TURN');
        turn = true;
        
      }else{
        console.log('THEIR TURN');
      }
    });
   
    socket.emit('select movie', {      
          clientid : clientid,
          imbId: 1
        });
  });

window.onload = () => {
    document.getElementById("welcome").style.display = "block"
};


document.getElementById("joinGame").onclick = function () { 
    //Join game, move to next screen for selecting movie
 };


document.getElementById("startButton").onclick = function () { 
    document.getElementById("welcome").style.display = "none";
    document.getElementById("poster").style.display = "block";
    let startTimer = document.getElementById("start-timer");
    gameBeginCountDown(count + 1, startTimer);
    if(document.getElementById("start-timer").innerHTML=== "0")
    {
        console.log("This worked!");
    }
 };

let gameBeginCountDown = (count, startTimer) => {
    startTimer.style.transition = "all .4s";
    startTimer.style.opacity = 0;
    //base case
    if (count === 0) {
    document.getElementById("poster").style.display = "none";
    document.getElementById("search").style.display = "block";
    document.getElementById("player1-bar").style.opacity = "1";
    document.getElementById("player2-bar").style.opacity = "1";

    let gameTimer = document.getElementById("game-timer");
    gameBeginCountDown2(count2 + 1, gameTimer);                 
        return;
    }
    count--;
    startTimer.innerHTML = count;

    setTimeout(function () {

        gameBeginCountDown(count, startTimer);
    }, 1000);
                startTimer.style.opacity = 1;
}

let gameBeginCountDown2 = (count2, gameTimer) => {
    gameTimer.style.transition = "all .4s";
    gameTimer.style.opacity = 0;
    //base case
    if (count2 === 0) {
    document.getElementById("search").style.display = "none";
    document.getElementById("after-game").style.display = "block";
    let pointItems = document.getElementsByClassName('points'), i1 = pointItems.length;
    while(i1--) {
        pointItems[i1].style.opacity = "1";
    }
    let totalItems = document.getElementsByClassName('total'), i2 = totalItems.length;
    while(i2--) {
        totalItems[i2].style.opacity = "1";
    }
        return;
    }
    count2--;
    gameTimer.innerHTML = count2;

    setTimeout(function () {

        gameBeginCountDown2(count2, gameTimer);
    }, 1000);
                gameTimer.style.opacity = 1;
}