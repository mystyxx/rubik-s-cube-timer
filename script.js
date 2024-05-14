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
        this.time = secondsToMinutesAndSeconds((Math.round(splitSeconds(time) * 100) / 100).toFixed(2));
        this.scramble = scramble;
        this.ao5 = secondsToMinutesAndSeconds(Math.round((Math.round(ao(5, times[parseInt(sessionSelect.value)-1].length) * 100) / 100)).toFixed(2));
        this.ao12 = secondsToMinutesAndSeconds(Math.round(Math.round(ao(12, times[parseInt(sessionSelect.value)-1].length) * 100) / 100).toFixed(2));
        this.ao50 = secondsToMinutesAndSeconds(Math.round(Math.round(ao(50, times[parseInt(sessionSelect.value)-1].length) * 100) / 100).toFixed(2));
        this.ao100 = secondsToMinutesAndSeconds(Math.round(Math.round(ao(100, times[parseInt(sessionSelect.value)-1].length) * 100) / 100).toFixed(2));
        this.ao1000 = secondsToMinutesAndSeconds(Math.round(Math.round(ao(1000, times[parseInt(sessionSelect.value)-1].length) * 100) / 100).toFixed(2));
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

function splitSeconds(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string.');
    }

    if(input == '--') {return '--'}

    // Regular expression patterns to match different formats
    const minutesSecondsPattern = /^(\d+):(\d{1,2})$/;
    const secondsCentisecondsPattern = /^(\d+)\.(\d{1,2})$/;
    const secondsPattern = /^\d+$/;
    const centisecondsOnlyPattern = /^\d{3}$/;

    if (minutesSecondsPattern.test(input)) {
        // Format: m:ss
        const [minutes, seconds] = input.split(':');
        const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
        if (parseInt(seconds, 10) >= 60) {
            throw new Error('Seconds must be less than 60 in the m:ss format.');
        }
        return totalSeconds;
    } else if (secondsCentisecondsPattern.test(input)) {
        // Format: s.centièmes (seconds and centiseconds)
        const [seconds, centiseconds] = input.split('.');
        const totalSeconds = parseInt(seconds, 10) + parseInt(centiseconds, 10) / 100;
        if (parseInt(seconds, 10) >= 60) {
            throw new Error('Seconds must be less than 60 in the s.centiseconds format.');
        }
        return totalSeconds;
    } else if (secondsPattern.test(input)) {
        // Format: seconds (simple seconds)
        const totalSeconds = parseInt(input, 10);
        if (totalSeconds >= 60) {
            const totalSeconds = parseInt(input, 10) / 100;
            return totalSeconds;
        }
        return totalSeconds;
    } else if (centisecondsOnlyPattern.test(input)) {
        // Format: centiseconds only (e.g., "564" for 5.64 seconds)
        const totalSeconds = parseInt(input, 10) / 100;
        return totalSeconds;
    } else {
        throw new Error('Unsupported time format.');
    }
}

function secondsToMinutesAndSeconds(input) {
    if(isNaN(input)) {return '--'}

    if(input>60) {
        return `${parseInt(input/60)}:${input%60}`;
    }
    else {return input}
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
    if(ms>6000) {document.getElementById("currentTime").innerText = parseInt(ms/60) + ':' + ((Math.round(ms * 100) / 100)%60).toFixed(2);}
    else {document.getElementById("currentTime").innerText = ((Math.round(ms * 100) / 100)%60).toFixed(2);}
    
}

function ao(x, index) {
    let s = 0;
    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    // check there are at leat x times
    if (index < x-1 || index > sessionTimes.length) {
        return "--";
    }

    const startIndex = Math.max(0, index - x); // start of the x times frame
    const endIndex = index - 1; // end of the x times frame

    // find the biggest and the smallest values
    let minTime = -Infinity;
    let maxTime = Infinity;
    for(let i = startIndex; i<=endIndex; i++) {
        let currentTime = splitSeconds(sessionTimes[i].time);
        if (currentTime < minTime) {
            minTime = currentTime;
        }
        if (currentTime > maxTime) {
            maxTime = currentTime;
        }
    }

    for (let i = endIndex; i >= startIndex; i--) {
        if(splitSeconds(sessionTimes[i].time)!==maxTime && splitSeconds(sessionTimes[i].time)!==minTime) {
            s += splitSeconds(sessionTimes[i].time);
        }
    }

    return secondsToMinutesAndSeconds(Math.round(Math.round(s / Math.min(x, endIndex - startIndex + 1)) * 100) / 100);
}


function pb(startIndex, endIndex) {
    let sessionTimes = times[parseInt(sessionSelect.value) - 1];
    let pb = splitSeconds(sessionTimes[0].time);
    for(let i= endIndex; i>=startIndex; i--) {
        if(pb>splitSeconds(sessionTimes[i].time)) {
            pb = splitSeconds(sessionTimes[i].time);
        }
    }
    return secondsToMinutesAndSeconds(pb);
}

function pbao(x, startIndex, endIndex) {
    let pb = ao(x, endIndex)

    for(let i = startIndex; i<endIndex; i++) {
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
        times[sessionSelect.options[sessionSelect.selectedIndex].value-1].push(new solve(document.getElementById("currentTime").innerText, document.getElementById("scramble").innerText));
    }
    // add current times to global times list

    if(!isNaN(parseFloat(document.getElementById("manualInput").value))) {
        times[sessionSelect.options[sessionSelect.selectedIndex].value-1].push(new solve(document.getElementById("manualInput").value, document.getElementById("scramble").innerText));
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
    localStorage.setItem("times", JSON.stringify(times));
    const timeList = document.getElementById("timeList");
    timeList.innerHTML = ""; // erase timelist entierly

    const sessionIndex = parseInt(sessionSelect.value) - 1;
    const sessionTimes = times[sessionIndex];

    for (let i = sessionTimes.length-1; i >= 0; i--) {
        const time = sessionTimes[i].time;
        const timeDiv = document.createElement('tr');
        timeDiv.innerHTML = `
            <td class="timeGrid" onclick='deleteTime(${i})'>${i + 1}.</td>
            <td class="timeGrid" onclick='alert(exportTimes(${i}, ${i}))'>${time}</td>
            <td class="timeGrid" onclick='alert(exportTimes(${i-4}, ${i}))'>${sessionTimes[i].ao5}</td>`;
        timeList.appendChild(timeDiv);

    }
    // average calculations
    if(sessionTimes.length>0) {
        document.getElementById("ao5").innerText = `current ao5 : ${sessionTimes[sessionTimes.length-1].ao5}`;
        document.getElementById("average").innerText = `average : ${ao(sessionTimes.length, sessionTimes.length)}`;
        document.getElementById("ao12").innerText = ` current ao12 : ${sessionTimes[sessionTimes.length-1].ao12}`;
    }

    document.getElementById("pb").innerText = `session best single : ${pb()}`;
    
}

function exportTimes(startIndex, endIndex) {
    let exportstr = '';
    timenb = endIndex-startIndex;
    if(timenb>=0) {exportstr = `meilleur single : ${pb(startIndex, endIndex)}\n`;}

    if(timenb >= 4) {exportstr += `moyenne élaguée sur 5 :
    en cours : ${ao(5, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(5, startIndex, endIndex)}\n`}

    if(timenb >=12) {exportstr += `moyenne élaguée sur 12 :
    en cours : ${ao(12, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(12, startIndex, endIndex)}\n`}

    if(timenb >= 100) {exportstr+=`moyenne élaguée sur 100 :
    en cours :${ao(100, times[parseInt(sessionSelect.value)-1].length)}
    meilleure : ${pbao(100, startIndex, endIndex)}\n`}

    exportstr+='\n';
    for(let i = startIndex; i<=endIndex; i++) {
        exportstr += `${i+1}.(${times[parseInt(sessionSelect.value)-1][i].time}) ${times[parseInt(sessionSelect.value)-1][i].scramble}\n`;
    }


    return exportstr;
}

function deleteSession(index) {
    localStorage.setItem("times", JSON.stringify(times.splice(index-1, 1)));
    updateSessions();
    updateTimes();
} 

function updateSessions() {
    //add selection option for the current session
    document.getElementById("sessionSelect").innerHTML = '<option id="newSession">new session</option>';
    for(let i = 1; i<=times.length; i++) {
        let temp = create(`<option value=\"${i}\">${i}</option>`);
        sessionSelect.appendChild(temp);
    }
    sessionSelect.value = times.length.toString();
}
updateSessions();
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
