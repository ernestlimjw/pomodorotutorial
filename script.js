let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isWorkMode = true;
let sessionsCompleted = 0;
let totalFocusTime = 0;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('startPause');
const resetButton = document.getElementById('reset');
const modeButton = document.getElementById('mode');
const sessionsDisplay = document.getElementById('sessions-completed');
const totalTimeDisplay = document.getElementById('total-focus-time');
const workTimeInput = document.getElementById('workTime');
const restTimeInput = document.getElementById('restTime');

// Progress ring setup
const circle = document.querySelector('.progress-ring-circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

function setProgress(percent) {
    const offset = circumference - (percent / 100 * circumference);
    circle.style.strokeDashoffset = -offset;
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.textContent = String(minutes).padStart(2, '0');
    secondsDisplay.textContent = String(seconds).padStart(2, '0');
    
    // Calculate and set progress
    const totalTime = isWorkMode ? 
        workTimeInput.value * 60 : 
        restTimeInput.value * 60;
    const progress = (timeLeft / totalTime) * 100;
    setProgress(progress);
}

function updateButtonStates() {
    const startPauseIcon = startPauseButton.querySelector('.material-icons');
    startPauseIcon.textContent = timerId === null ? 'play_arrow' : 'pause';
    startPauseButton.classList.toggle('paused', timerId !== null);
    
    // Update button colors based on mode
    startPauseButton.style.background = isWorkMode ? 
        'var(--work-gradient)' : 
        'var(--rest-gradient)';
    
    const modeEmoji = document.querySelector('#mode .emoji-mode');
    modeEmoji.textContent = isWorkMode ? '😴' : '🏃';
    
    modeButton.title = isWorkMode ? 'Switch to Rest' : 'Switch to Work';
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                
                if (isWorkMode) {
                    sessionsCompleted++;
                    totalFocusTime += parseInt(workTimeInput.value);
                    updateStats();
                    celebrateCompletion();
                }
                
                switchMode();
            }
        }, 1000);
        updateButtonStates();
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    updateButtonStates();
}

function switchMode() {
    isWorkMode = !isWorkMode;
    const workMinutes = parseInt(workTimeInput.value);
    const restMinutes = parseInt(restTimeInput.value);
    timeLeft = isWorkMode ? workMinutes * 60 : restMinutes * 60;
    
    // Toggle rest-mode class on the circle element directly
    document.querySelector('.progress-ring-circle').classList.toggle('rest-mode', !isWorkMode);
    
    // Update emoji based on mode
    const emojiContainer = document.querySelector('.emoji-container');
    emojiContainer.textContent = isWorkMode ? '🧘' : '☕';
    
    // Update mode text
    document.getElementById('mode-text').textContent = isWorkMode ? 'Focus Mode' : 'Rest Mode';
    
    updateButtonStates();
    updateDisplay();
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    const workMinutes = parseInt(workTimeInput.value);
    const restMinutes = parseInt(restTimeInput.value);
    timeLeft = isWorkMode ? workMinutes * 60 : restMinutes * 60;
    updateDisplay();
    updateButtonStates();
}

function updateStats() {
    sessionsDisplay.textContent = `Focus Sessions: ${sessionsCompleted}`;
    totalTimeDisplay.textContent = `Total Focus Time: ${totalFocusTime} min`;
}

function celebrateCompletion() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#ff8e8e', '#ffa0a0']
    });
}

startPauseButton.addEventListener('click', () => {
    if (timerId === null) {
        startTimer();
    } else {
        pauseTimer();
    }
});

resetButton.addEventListener('click', resetTimer);
modeButton.addEventListener('click', switchMode);

// Add event listeners for the inputs
workTimeInput.addEventListener('change', handleTimeChange);
restTimeInput.addEventListener('change', handleTimeChange);

// Initialize display and background
updateDisplay();
updateButtonStates();

// Initialize mode text
document.getElementById('mode-text').textContent = isWorkMode ? 'Focus Mode' : 'Rest Mode';

function handleTimeChange() {
    if (timerId !== null) {
        resetTimer();
    }
    
    const workMinutes = parseInt(workTimeInput.value) || 25;
    const restMinutes = parseInt(restTimeInput.value) || 5;
    
    // Ensure values are within bounds
    workTimeInput.value = Math.min(Math.max(workMinutes, 1), 60);
    restTimeInput.value = Math.min(Math.max(restMinutes, 1), 60);
    
    timeLeft = isWorkMode ? workMinutes * 60 : restMinutes * 60;
    updateDisplay();
}

function createFloatingEmoji(emoji) {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        animation: floatUp 3s ease-out forwards;
        left: ${Math.random() * 100}vw;
        top: 100vh;
        z-index: 1000;
    `;
    document.body.appendChild(emojiElement);
    
    setTimeout(() => {
        document.body.removeChild(emojiElement);
    }, 3000);
}

function showSleepyEmojis() {
    const emojis = ['🦥', '💤', '😴'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 300);
    }
}

// Add this after your other constant declarations at the top
const statsToggle = document.querySelector('.stats-toggle');
const statsContent = document.querySelector('.stats-content');

// Add this after your other event listeners
statsToggle.addEventListener('click', () => {
    statsContent.classList.toggle('hidden');
    statsToggle.classList.toggle('active');
});

// Add after your other constant declarations
const settingsToggle = document.querySelector('.settings-toggle');
const settingsContent = document.querySelector('.settings-content');

// Add after your other event listeners
settingsToggle.addEventListener('click', () => {
    settingsContent.classList.toggle('hidden');
    settingsToggle.classList.toggle('active');
});