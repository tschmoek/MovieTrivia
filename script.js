let count = 10;

window.onload = () => {
    let startTimer = document.getElementById("start-timer");
    gameBeginCountDown(count + 1, startTimer);
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


