let tasks = JSON.parse(localStorage.getItem('aether_tasks')) || [];
let timeLeft = 1500;
let timerId = null;
const circle = document.getElementById('timer-progress');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateClock() {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

function toggleTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('play-btn').innerHTML = '<i data-lucide="play"></i>';
    } else {
        timerId = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                document.getElementById('timer-val').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                setProgress((timeLeft / 1500) * 100);
            } else {
                confetti();
                resetTimer();
            }
        }, 1000);
        document.getElementById('play-btn').innerHTML = '<i data-lucide="pause"></i>';
    }
    lucide.createIcons();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 1500;
    document.getElementById('timer-val').innerText = "25:00";
    setProgress(100);
    document.getElementById('play-btn').innerHTML = '<i data-lucide="play"></i>';
    lucide.createIcons();
}

function addTask() {
    const input = document.getElementById('task-input');
    if (!input.value) return;
    tasks.push({ id: Date.now(), text: input.value, done: false });
    input.value = '';
    render();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, done: !t.done} : t);
    if (tasks.find(t => t.id === id).done) confetti();
    render();
}

function render() {
    localStorage.setItem('aether_tasks', JSON.stringify(tasks));
    const list = document.getElementById('task-list');
    list.innerHTML = tasks.map(t => `
        <li class="${t.done ? 'done' : ''}" onclick="toggleTask(${t.id})">
            <span>${t.text}</span>
            <i data-lucide="chevron-right"></i>
        </li>
    `).join('');
    document.getElementById('task-count').innerText = `${tasks.filter(t => t.done).length}/${tasks.length}`;
    lucide.createIcons();
}

render();
setProgress(100);
