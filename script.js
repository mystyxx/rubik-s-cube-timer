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
let times = [[]];

if (timesStr) {
    try {
        times = JSON.parse(timesStr);
    } catch (error) {
        console.error("Erreur lors de l'analyse des données JSON:", error);
        times = [[]];
    }
}
let a = 0;
let testIsReady = false;
let testIsRunning = false;
let timerIntervalId;
let sessionSelect = document.getElementById("sessionSelect");
document.getElementById("scramble").innerText = scramble(20);


function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

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

// function showTimes(timesIndex) {
//     for(let i = 0; i>times[timesIndex])
// }

//add selection option for the current session
for(let i = 1; i<=times.length; i++) {
    let temp = create(`<option value=\"${i}\">${i}</option>`);
    sessionSelect.appendChild(temp);
}
sessionSelect.value = times.length.toString();

document.getElementById("sessionSelect").addEventListener("change", (createNewSession) => {
    console.log(createNewSession.target.value)
    if (createNewSession.target.value === "new session") {
        times.push([]);
        localStorage.setItem("times", JSON.stringify(times));
        sessionSelect.appendChild(create(`<option value=${times.length}>${times.length}</option>`));
        sessionSelect.value = times.length.toString();
    }
});

addEventListener("keydown", (timerReady) => {
    if (timerReady.keyCode == 32) {
        if (testIsRunning) {
            // stop the test
            clearInterval(timerIntervalId);
            testIsRunning = false;
            
            // add current times to global times list
            times[sessionSelect.options[sessionSelect.selectedIndex].value-1].push(document.getElementById("currentTime").innerText);
            localStorage.setItem("times", JSON.stringify(times));
            document.getElementById("scramble").innerText = scramble(20);
            // alert(JSON.stringify(times)); // Afficher les temps enregistrés
        }
        a += 1;
        if (a >= 15) {
            testIsReady = true;
            document.getElementById("currentTime").style.color = 'green';
        }
        else{if(!testIsRunning){document.getElementById("currentTime").style.color = 'red';}}
    }
});

addEventListener("keyup", (timerStart) => {
    if (timerStart.keyCode == 32) {
        a = 0;
        document.getElementById("currentTime").style.color = 'black';
        if (testIsReady) {
            document.getElementById("currentTime").innerText = '0';
            testIsReady = false;
            testIsRunning = true;
            timerIntervalId = setInterval(timer, 10);
        }
    }
});
