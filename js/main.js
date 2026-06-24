import { initLanding } from '../features/landing/landing.js';
import { initTimeline } from '../features/timeline/timeline.js';
import { initMemory } from '../features/memory/memory.js';
import { initBalloons } from '../features/balloons/balloons.js';
import { initQuiz } from '../features/quiz/quiz.js';
import { initProof } from '../features/proof/proof.js';
import { initLetter } from '../features/letter/letter.js';
import { initFinale } from '../features/finale/confetti.js';
import { initMusic } from '../features/music/music.js';

const app = document.getElementById('app');
const musicToggle = document.getElementById('music-toggle');

// Section order: each game gates the next sections
const FLOW = ['timeline', 'memory', 'balloons', 'quiz', 'proof', 'letter', 'finale'];

const games = {
  timeline: { started: false, completed: false },
  memory:   { started: false, completed: false },
  balloons: { started: false, completed: false },
  quiz:     { started: false, completed: false },
};

// ===== REVEAL =====
// Reveal a section by adding .revealed (overrides .gated display:none)
function reveal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('revealed');
}

// On game complete: show overlay
function onGameComplete(id) {
  const game = games[id];
  if (!game) return;
  game.completed = true;

  const section = document.getElementById(id);
  const overlay = section.querySelector(
    '.timeline__complete, .memory__complete, .balloons__complete, .quiz__complete'
  );
  if (overlay) overlay.classList.add('visible');
}

// Continue button: reveal next section, scroll to it
document.querySelectorAll('[data-continue]').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('.section');
    if (!section) return;

    const idx = FLOW.indexOf(section.id);
    if (idx < 0) return;

    // Reveal next section(s) — if the next ones aren't games, reveal them all
    for (let i = idx + 1; i < FLOW.length; i++) {
      const id = FLOW[i];
      reveal(id);
      if (games[id] && !games[id].completed) break;
    }

    const nextId = FLOW[idx + 1];
    if (nextId) {
      // Init proof when it gets revealed
      if (nextId === 'proof') initProof();
      setTimeout(() => {
        document.getElementById(nextId).scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  });
});

// ===== GAME AUTO-START =====
const gameObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.intersectionRatio < 0.3) return;

    const id = entry.target.id;
    const game = games[id];
    if (!game || game.started) return;

    game.started = true;
    startGame(id);
  });
}, { threshold: [0.3] });

// Only observe sections that are game sections
FLOW.forEach(id => {
  if (games[id]) {
    const el = document.getElementById(id);
    if (el) gameObserver.observe(el);
  }
});

function startGame(id) {
  switch (id) {
    case 'timeline':
      initTimeline(() => onGameComplete('timeline'));
      break;
    case 'memory':
      initMemory(() => onGameComplete('memory'));
      break;
    case 'balloons':
      initBalloons(() => onGameComplete('balloons'));
      break;
    case 'quiz':
      initQuiz(() => onGameComplete('quiz'));
      break;
  }
}

// ===== FINALE =====
let finaleStarted = false;
const finaleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !finaleStarted) {
      finaleStarted = true;
      initFinale();
    }
  });
}, { threshold: 0.3 });

const finaleEl = document.getElementById('finale');
if (finaleEl) finaleObserver.observe(finaleEl);

// ===== LANDING =====
function onLandingOpen() {
  app.hidden = false;
  musicToggle.hidden = false;

  // Reveal first game section (timeline)
  reveal('timeline');
  initLetter();
  initMusic();
}

initLanding(onLandingOpen);
