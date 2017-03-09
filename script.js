let count = 10;
let count2= 180;

window.onload = () => {
    let startTimer = document.getElementById("start-timer");
    let gameTimer = document.getElementById("game-timer");
    gameBeginCountDown(count + 1, startTimer);
    gameBeginCountDown2(count2 + 1, gameTimer);
};

let gameBeginCountDown = (count, startTimer) => {
    startTimer.style.transition = "all .4s";
    startTimer.style.opacity = 0;
    //base case
    if (count == 1) {
        //change div
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
    if (count2 == 1) {
        //change div
        return;
    }
    count2--;
    gameTimer.innerHTML = count2;

    setTimeout(function () {

        gameBeginCountDown2(count2, gameTimer);
    }, 1000);
                gameTimer.style.opacity = 1;
}