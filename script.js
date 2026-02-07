const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progressContainer = document.getElementById('progressContainer');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const lyricsPanel = document.getElementById('lyricsPanel');

// 1. Decoration Background
function initBackground() {
    const icons = ['☁️', '✨', '💍', '💍', '🌻', '💍'];
    for (let i = 0; i < 15; i++) {
        const floaty = document.createElement('div');
        floaty.innerText = icons[Math.floor(Math.random() * icons.length)];
        floaty.style.position = 'absolute';
        floaty.style.left = Math.random() * 100 + 'vw';
        floaty.style.top = Math.random() * 100 + 'vh';
        floaty.style.opacity = '0.4';
        floaty.style.fontSize = '24px';
        floaty.style.zIndex = '1';
        floaty.animate([{ transform: 'translateY(0)' }, { transform: `translateY(-30px)` }, { transform: 'translateY(0)' }], { duration: 3000 + Math.random() * 2000, iterations: Infinity });
        document.body.appendChild(floaty);
    }
}
initBackground();

// 2. Music Player Logic
let isSeeking = false;
playBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); playBtn.innerText = '⏸'; }
    else { audio.pause(); playBtn.innerText = '▶'; }
});
audio.addEventListener('timeupdate', () => {
    if (!isSeeking) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.innerText = formatTime(audio.currentTime);
        if(audio.duration) durationEl.innerText = formatTime(audio.duration);
    }
});

const handleSeek = (e) => {
    const rect = progressContainer.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    let percentage = (clientX - rect.left) / rect.width;
    percentage = Math.max(0, Math.min(percentage, 1));
    progressBar.style.width = `${percentage * 100}%`;
    if (audio.duration) audio.currentTime = percentage * audio.duration;
};

progressContainer.addEventListener('mousedown', (e) => { isSeeking = true; handleSeek(e); });
progressContainer.addEventListener('touchstart', (e) => { isSeeking = true; handleSeek(e); });
window.addEventListener('mouseup', () => isSeeking = false);
window.addEventListener('touchend', () => isSeeking = false);

function formatTime(t) {
    const m = Math.floor(t / 60); const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}
function toggleLyrics() {
    lyricsPanel.classList.toggle('open');
    document.getElementById('lyricsToggleBtn').innerText = lyricsPanel.classList.contains('open') ? 'Hide Lyrics' : 'Show Lyrics';
}

// 3. Unlock Logic
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
let yesSize = 20;

const moveNoBtn = () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
    yesSize += 10;
    yesBtn.style.fontSize = `${yesSize}px`;
    yesBtn.style.padding = `${yesSize / 2}px ${yesSize}px`;
};

noBtn.addEventListener('mouseover', moveNoBtn);
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoBtn(); });
yesBtn.addEventListener('click', unlock);

function createHeart(isBurst) {
    const heart = document.createElement('div');
    heart.className = 'heart'; 
    heart.innerHTML = '💍';
    heart.style.left = Math.random() * 100 + 'vw';
    const duration = isBurst ? (Math.random() * 1 + 1) : 3;
    heart.style.animationDuration = duration + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), duration * 1000);
}

function unlock() {
    const stage1 = document.getElementById('stage1');
    if (stage1.classList.contains('hidden')) return;
    
    const flash = document.createElement('div');
    flash.className = 'transition-flash';
    document.body.appendChild(flash);
    flash.animate([{ opacity: 0 }, { opacity: 0.6 }, { opacity: 0 }], { duration: 400 });
    
    for(let i=0; i<15; i++) createHeart(true);
    
    stage1.style.opacity = '0';
    setTimeout(() => { 
        stage1.classList.add('hidden'); 
        document.getElementById('stage2').classList.remove('hidden'); 
        flash.remove(); 
        setInterval(() => createHeart(false), 500);
    }, 400);
}