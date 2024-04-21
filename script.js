/*
_ _ _
  /_/_/_/\
 /_/_/_/\/\
/_/_/_/\/\/\
\_\_\_\/\/\/
 \_\_\_\/\/
  \_\_\_\/
RUBIK'S CUBE TIMER BY MYSTYXX*/

// get back data from localStorage or init an empty array if empty or invalid
let timesStr = localStorage.getItem("times");
let times = [];

if (timesStr) {
    try {
        times = JSON.parse(timesStr);
    } catch (error) {
        console.error("Erreur lors de l'analyse des données JSON:", error);
        times = [];
    }
}

let a = 0;
let testIsReady = false;
let testIsRunning = false;
let timerIntervalId;
document.getElementById("scramble").innerText = scramble(20);


function scramble(length) {
    const moves = ['F', 'B', 'R', 'L', 'U', 'D']; // Rubik's cube sides
    const turns = ['', "'", '2']; // types of rotation

    let sequence = [];
    let lastSide = ''; // last side turned

    for (let i = 0; i < length; i++) {
        let side;
        do {
            side = moves[Math.floor(Math.random() * moves.length)]; // randomly picking a side
        } while (side === lastSide); // check if the last side was picked last time

        const turn = turns[Math.floor(Math.random() * turns.length)]; // randomly picking the rotation
        const move = side + turn; // combining side and rotation

        sequence.push(move);
        lastSide = side; // update last Side
    }

    return sequence.join(' ');
}


function timer() {
    let ms = parseFloat(document.getElementById("currentTime").innerText) + 0.01;
    document.getElementById("currentTime").innerText = Math.round(ms * 100) / 100;
    console.log(testIsReady);
}

addEventListener("keydown", (timerReady) => {
    if (timerReady.keyCode == 32) {
        if (testIsRunning) {
            // stop the test
            testIsRunning = false;
            clearInterval(timerIntervalId);
            // add current times to global times list
            times.push(document.getElementById("currentTime").innerText);
            localStorage.setItem("times", JSON.stringify(times));
            document.getElementById("scramble").innerText = scramble(20);
            // alert(JSON.stringify(times)); // Afficher les temps enregistrés
        }
        a += 1;
        if (a >= 26) {
            testIsReady = true;
        }
    }
});

addEventListener("keyup", (timerStart) => {
    if (timerStart.keyCode == 32) {
        a = 0;
        if (testIsReady) {
            document.getElementById("currentTime").innerText = '0';
            testIsReady = false;
            testIsRunning = true;
            timerIntervalId = setInterval(timer, 10);
        }
    }
});
