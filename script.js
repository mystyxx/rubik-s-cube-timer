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
}

function ao5(index) {
    let s = 0;
    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    // check there are at leat 5 times
    if (index < 5 || index > sessionTimes.length) {
        return "--";
    }

    // calculate average of 5 (`index` element included)
    const startIndex = Math.max(0, index - 5); // start of the 5 times frame
    const endIndex = index - 1; // end of the 5 times frame

    for (let i = endIndex; i >= startIndex; i--) {
        s += parseFloat(sessionTimes[i]);
    }

    return Math.round((s / Math.min(5, endIndex - startIndex + 1)) * 100) / 100;
}


function globalAverage() {
    let s = 0;
    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    for (let i = 0; i < sessionTimes.length; i++) {
        s += parseFloat(sessionTimes[i]);
    }

    return Math.round((s / sessionTimes.length) * 100) / 100;
}

function updateTimes() {
    const timeList = document.getElementById("timeList");
    timeList.innerHTML = ""; // erase timelist entierly

    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    for (let i = sessionTimes.length-1; i >= 0; i--) {
        const time = sessionTimes[i];
        const timeDiv = document.createElement('div');
        timeDiv.innerHTML = `<p style="
        grid-column: 1;
        display: inline;
        padding: 10px;
        outline-width: 2px;
        outline-color: black;
        outline-style: solid;">${i + 1}</p>

        <p style="
        grid-column: 2;
        display: inline;
        padding: 10px;
        outline-width: 2px;
        outline-color: black;
        outline-style: solid;">${time}</p>
        
        <p style="
        grid-column: 2;
        display: inline;
        padding: 10px;
        outline-width: 2px;
        outline-color: black;
        outline-style: solid;">${ao5(i+1)}</p>`;
        timeList.appendChild(timeDiv);

    }
    // average calculations
    document.querySelector("#ao5").innerText = `current ao5 : ${ao5(sessionTimes.length)}`;
    document.querySelector("#average").innerText = `average : ${globalAverage()}`;
}


//add selection option for the current session
for(let i = 1; i<=times.length; i++) {
    let temp = create(`<option value=\"${i}\">${i}</option>`);
    sessionSelect.appendChild(temp);
}
sessionSelect.value = times.length.toString();

updateTimes()

document.getElementById("sessionSelect").addEventListener("change", (createNewSession) => {
    if (createNewSession.target.value === "new session") {
        times.push([]);
        localStorage.setItem("times", JSON.stringify(times));
        sessionSelect.appendChild(create(`<option value=${times.length}>${times.length}</option>`));
        sessionSelect.value = times.length.toString();
    }
    updateTimes()
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
            updateTimes() // Afficher les temps enregistrés
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
