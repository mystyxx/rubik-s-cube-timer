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

if(!localStorage.getItem("inputMethod")) {
    localStorage.setItem("inputMethod", "automatic")
}

class solve {
    constructor(time, scramble) {
        this.time = time;
        this.scramble = scramble;
        this.ao5 = ao(5, times[parseInt(sessionSelect.value)-1].length);
        this.ao12 = ao(12, times[parseInt(sessionSelect.value)-1].length);
        this.ao50 = ao(50, times[parseInt(sessionSelect.value)-1].length);
        this.ao100 = ao(100, times[parseInt(sessionSelect.value)-1].length);
        this.ao1000 = ao(1000, times[parseInt(sessionSelect.value)-1].length);
    }
}

function quicksort(liste) {
    if(liste.length==1 || liste.length==0) {
        return liste
    }
    else{
        pivot = liste[0]    
        let listegauche = [];
        let listedroite = [];
        for(let i = 1; i<liste.length; i++) {
            if(liste[i] < pivot) {
                 listegauche.push(liste[i]);
            }
            else{
                 listedroite.push(liste[i]);
            }
        }
        return [...quicksort(listegauche).concat([pivot], ...quicksort(listedroite))]
    }
}

function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

function switchInputMethod() {
    let inputMethod = localStorage.getItem("inputMethod");
    console.log(inputMethod)
    if(inputMethod === "manual") {
        localStorage.setItem("inputMethod", "automatic");
        document.getElementById("manualInput").style.display = 'none';
        document.getElementById("currentTime").style.display = 'block';
    }
    if(inputMethod === 'automatic') {
        localStorage.setItem("inputMethod", "manual");
        document.getElementById("manualInput").style.display = 'block';
        document.getElementById("currentTime").style.display = 'none';
    }
}

function scramble(length) {
    const moves = ['F', 'B', 'R', 'L', 'U', 'D']; // Rubik's cube sides
    const turns = ['', "'", '2']; // types of rotation

    let sequence = [];
    let lastSide = ''; // last side turned
    let lastOppositeCount = 0; 

    for (let i = 0; i < length; i++) {
        let side;
        do {
            side = moves[Math.floor(Math.random() * moves.length)]; // randomly picking a side
        } while (side === lastSide || // Check if the new side is the same as the last side
        side === oppositeSide(lastSide) || // Check if the new side is opposite to the last side
        (lastOppositeCount >= 2 && side === moves[Math.floor(Math.random() * moves.length)]) // Avoid repeating opposite sides too many times
        ); // check if the last side was picked last time

        const turn = turns[Math.floor(Math.random() * turns.length)]; // randomly picking the rotation
        const move = side + turn; // combining side and rotation

        sequence.push(move);

        // Update last opposite count
        if (side === oppositeSide(lastSide)) {
            lastOppositeCount++;
        } else {
            lastOppositeCount = 0;
        }

        lastSide = side; // update last side
    }

    return sequence.join(' ');
}

function oppositeSide(side) {
    switch (side) {
        case 'F':
            return 'B';
        case 'B':
            return 'F';
        case 'R':
            return 'L';
        case 'L':
            return 'R';
        case 'U':
            return 'D';
        case 'D':
            return 'U';
        default:
            return ''; 
    }
}

function timer() {
    let ms = parseFloat(document.getElementById("currentTime").innerText) + 0.01;
    document.getElementById("currentTime").innerText = Math.round(ms * 100) / 100;
}

function ao(x, index) {
    let s = 0;
    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    // check there are at leat x times
    if (index < x || index > sessionTimes.length) {
        return "--";
    }

    const startIndex = Math.max(0, index - x); // start of the x times frame
    const endIndex = index - 1; // end of the x times frame

    // find the biggest and the smallest values
    let minTime = -Infinity;
    let maxTime = Infinity;
    for(let i = startIndex; i<=endIndex; i++) {
        let currentTime = parseFloat(sessionTimes[i].time);
        if (currentTime < minTime) {
            minTime = currentTime;
        }
        if (currentTime > maxTime) {
            maxTime = currentTime;
        }
    }

    for (let i = endIndex; i >= startIndex; i--) {
        if(parseFloat(sessionTimes[i].time)!==maxTime && parseFloat(sessionTimes[i].time)!==minTime) {
            s += parseFloat(sessionTimes[i].time);
        }
    }

    return Math.round((s / Math.min(x, endIndex - startIndex + 1)) * 100) / 100;
}


function pb() {
    let sessionTimes = times[parseInt(sessionSelect.value) - 1];
    let pb = sessionTimes[0].time;
    for(let i= sessionTimes.length-1; i>=0; i--) {
        if(pb>parseFloat(sessionTimes[i].time)) {
            pb = parseFloat(sessionTimes[i].time);
        }
    }
    return(pb);
}

function pbao(x) {
    let sessionTimes = times[parseInt(sessionSelect.value) - 1];
    let pb = ao(x, x)

    for(let i = x; i<sessionTimes.length+1; i++) {
        console.log(i)
        if(pb>ao(x, i)) {
            pb = ao(x, i);
        }
    }
    return pb;
}

function submitTime(event) {
    if(localStorage.getItem("inputMethod") === "manual") {
        if(event.key !== "Enter") {
            return;
        }
    }
    else {
        times[sessionSelect.options[sessionSelect.selectedIndex].value-1].push(new solve(parseFloat(document.getElementById("currentTime").innerText), document.getElementById("scramble").innerText));
    }
    // add current times to global times list

    if(!isNaN(parseFloat(document.getElementById("manualInput").value))) {
        times[sessionSelect.options[sessionSelect.selectedIndex].value-1].push(new solve(Math.abs(document.getElementById("manualInput").value), document.getElementById("scramble").innerText));
        document.getElementById("scramble").innerText = scramble(20);
    }
    document.getElementById("manualInput").value = '';
    updateTimes()
}

function deleteTime(i) {
    if(confirm(`are you sure you want to delete your ${times[parseInt(sessionSelect.value)-1][i].time} solve ?`)){
        times[parseInt(sessionSelect.value)-1].splice(i, 1);
        updateTimes();
    }
}

function updateTimes() {
    if(times[parseInt(sessionSelect.value)-1][0] == undefined) {return;}
    localStorage.setItem("times", JSON.stringify(times));
    const timeList = document.getElementById("timeList");
    timeList.innerHTML = ""; // erase timelist entierly

    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    for (let i = sessionTimes.length-1; i >= 0; i--) {
        const time = sessionTimes[i].time;
        const timeDiv = document.createElement('tr');
        timeDiv.innerHTML = `
            <td class="timeGrid">${i + 1}.</td>
            <td class="timeGrid" ondblclick='deleteTime(${i})' onclick='alert(exportTimes(${i}, ${i}, true))'>${time}</td>
            <td class="timeGrid">${sessionTimes[i].ao5}</td>`;
        timeList.appendChild(timeDiv);

    }
    // average calculations
    document.querySelector("#ao5").innerText = `current ao5 : ${sessionTimes[i].ao5}`;
    document.getElementById("ao12").innerText = ` current ao12 : ${sessionTimes[i].ao12}`;
    document.querySelector("#average").innerText = `average : ${ao(sessionTimes.length, sessionTimes.length)}`;

    document.getElementById("pb").innerText = `session best single : ${pb()}`
}

function exportTimes(startIndex, endIndex, single) {
    let exportstr = '';
    if(!single) {exportstr = `meilleur single : ${pb()}\n`;}
    timenb = endIndex-startIndex;

    if(timenb >= 5) {exportstr += `moyenne élaguée sur 5 :
    en cours : ${ao(5, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(5)}\n`}

    if(timenb >=12) {exportstr += `moyenne élaguée sur 12 :
    en cours : ${ao(12, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(12)}\n`}

    if(timenb >= 100) {exportstr+=`moyenne élaguée sur 100 :
    en cours :${ao(100, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(100)}\n`}

    for(let i = startIndex; i<=endIndex; i++) {
        exportstr += `${i+1}.(${times[parseInt(sessionSelect.value)-1][i].time}) ${times[parseInt(sessionSelect.value)-1][i].scramble}\n`;
    }


    return exportstr;
}

//add selection option for the current session
for(let i = 1; i<=times.length; i++) {
    let temp = create(`<option value=\"${i}\">${i}</option>`);
    sessionSelect.appendChild(temp);
}
sessionSelect.value = times.length.toString();

updateTimes()

if(localStorage.getItem("inputMethod")==='manual') {
    document.getElementById("manualInput").style.display = 'block';
    document.getElementById("currentTime").style.display = 'none';
}
else {
    document.getElementById("manualInput").style.display = 'none';
    document.getElementById("currentTime").style.display = 'block';
}


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
            
            submitTime();

            if(document.getElementById("currentTime").innerText==pb()) {
                document.getElementById("currentTime").style.textDecoration = 'underline';
            }
            else{document.getElementById("currentTime").style.textDecoration = 'none'}
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
    if(localStorage.getItem("inputMethod")==='automatic') {
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
    }
});
