let count = 10;
let count2= 180;

window.onload = () => {
    document.getElementById("welcome").style.display = "block"
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
    document.getElementById("results").style.display = "block";
        return;
    }
    count2--;
    gameTimer.innerHTML = count2;

    setTimeout(function () {

        gameBeginCountDown2(count2, gameTimer);
    }, 1000);
                gameTimer.style.opacity = 1;
}