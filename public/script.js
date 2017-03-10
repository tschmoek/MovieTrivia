let count = 10;
let count2= 180;

  $(function () {
    var socket = io();
    var clientid;
    var turn;
    $("#joinGame").click(function(){
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
      console.log('STARTING NEW GAME')
      if(data['yourTurn'] === true){
        console.log('MY TURN');
        gameStart();
        
      }else{
        console.log('THEIR TURN');
        gameStart2();

      }
    });
   $('#choose').click(function(){
    let imbdid = api();

    socket.emit('select movie', {      
          clientid : clientid,
          imbId: imbdid.id
        });
    socket.emit('start round',function(data){

    });
   });
   
   socket.emit('guess movie',function(data){
        imbdid = api().id;
        clientid : clientid
    });
    

  });

window.onload = () => {
    document.getElementById("welcome").style.display = "block"
};

 let api = function() {
  var title = document.getElementById("search-bar").value;
  var url = "http://www.omdbapi.com/?t=" + title;
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", url, false);
  xhttp.send();
  var response = JSON.parse(xhttp.responseText);
  console.log('response: ', response);
  console.log('actors: ', response.Actors);
  return response;
  // var playerTable = document.getElementById('player1-results');
  // var row = playerTable.insertRow(playerTable.rows.length);
  // var movieTitle = row.insertCell(0);
  // var point = row.insertCell(1);
  // movieTitle.innerHTML = response.Title;
  // point.innerHTML = "1"; //dummy point
};


let gameStart = function () { 
    document.getElementById("welcome").style.display = "none";
    document.getElementById("selectMovie").style.display = "block";
    let startTimer = document.getElementById("start-timer");
    gameBeginCountDown(count + 1, startTimer);
    if(document.getElementById("start-timer").innerHTML=== "0")
    {
        console.log("This worked!");
    }
 };

 let gameStart2 = function () { 
    document.getElementById("welcome").style.display = "none";
    document.getElementById("wait").style.display = "block";
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