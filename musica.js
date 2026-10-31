// ==========================================
// MOTOR DE AUDIO Y MÚSICA CHIPTUNE (music.js)
// ==========================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let bgmInterval = null;
let currentStep = 0;
let isPlaying = false;
let currentTrack = 'menu'; // 'menu' o 'battle'

// TABLA DE FRECUENCIAS EN HERTZ (Hz) PARA NOTAS MUSICALES
const NOTES = {
    C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
    OFF: 0
};

// SECUENCIA DE NOTAS PARA EL MENÚ (Melodía alegre y tranquila)
const MENU_MELODY = [
    { note: NOTES.C4, duration: 0.15 }, { note: NOTES.E4, duration: 0.15 }, { note: NOTES.G4, duration: 0.15 },
    { note: NOTES.C5, duration: 0.25 }, { note: NOTES.B4, duration: 0.15 }, { note: NOTES.G4, duration: 0.15 },
    { note: NOTES.A4, duration: 0.15 }, { note: NOTES.F4, duration: 0.15 }, { note: NOTES.D4, duration: 0.25 },
    { note: NOTES.G4, duration: 0.15 }, { note: NOTES.E4, duration: 0.15 }, { note: NOTES.C4, duration: 0.30 }
];

// SECUENCIA DE NOTAS PARA LA BATALLA (Ritmo dinámico y de combate)
const BATTLE_MELODY = [
    { note: NOTES.E4, duration: 0.10 }, { note: NOTES.E4, duration: 0.10 }, { note: NOTES.G4, duration: 0.10 },
    { note: NOTES.B4, duration: 0.10 }, { note: NOTES.A4, duration: 0.10 }, { note: NOTES.G4, duration: 0.10 },
    { note: NOTES.E4, duration: 0.10 }, { note: NOTES.D4, duration: 0.10 }, { note: NOTES.F4, duration: 0.10 },
    { note: NOTES.A4, duration: 0.10 }, { note: NOTES.C5, duration: 0.15 }, { note: NOTES.B4, duration: 0.15 }
];

// FUNCIÓN QUE EJECUTA CADA PASO DE LA SECUENCIA MUSICAL
function playNoteStep() {
    if (!isPlaying) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const playlist = (currentTrack === 'battle') ? BATTLE_MELODY : MENU_MELODY;
    const currentItem = playlist[currentStep % playlist.length];
    
    if (currentItem.note !== NOTES.OFF) {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Onda cuadrada/sierra para ese toque clásico de videojuego retro
        osc.type = (currentTrack === 'battle') ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(currentItem.note, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + currentItem.duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + currentItem.duration);
    }

    currentStep++;
}

// CONTROLADOR DEL BOTÓN DE MÚSICA EN EL HTML
function toggleMusic() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const btn = document.getElementById('bgm-toggle');

    if (isPlaying) {
        isPlaying = false;
        clearInterval(bgmInterval);
        if (btn) {
            btn.innerText = "🎵 MÚSICA: OFF";
            btn.className = "px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded border-2 border-amber-300 transition-all active:translate-y-0.5";
        }
    } else {
        isPlaying = true;
        currentStep = 0;
        const speed = (currentTrack === 'battle') ? 120 : 150;
        bgmInterval = setInterval(playNoteStep, speed);
        if (btn) {
            btn.innerText = "⏸️ MÚSICA: ON";
            btn.className = "px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded border-2 border-emerald-300 transition-all active:translate-y-0.5";
        }
    }
}

// CAMBIAR ENTRE MODO MENÚ Y MODO BATALLA AUTOMÁTICAMENTE
function setTrackMode(mode) {
    currentTrack = mode;
    currentStep = 0;
    if (isPlaying) {
        clearInterval(bgmInterval);
        const speed = (currentTrack === 'battle') ? 120 : 150;
        bgmInterval = setInterval(playNoteStep, speed);
    }
}

// EFECTOS DE SONIDO RETRO (SFX)
function playRetroSFX(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
    } else if (type === 'super-effective') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'heal') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
    }
}
