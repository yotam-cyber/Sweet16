// ===== BACKGROUND MUSIC =====
// Plays "Risk It All" on loop. Mute/unmute toggle in corner.
// Ducks (pauses) when the timeline audio slide plays.

const BG_TRACK = './assets/audio/Risk It All.mp3';

let audio = null;
let muted = false;
let ducked = false;

export function initMusic() {
  audio = new Audio(BG_TRACK);
  audio.loop = true;
  audio.volume = 0.4;
  audio.preload = 'auto';

  const toggle = document.getElementById('music-toggle');
  const iconOff = toggle.querySelector('.music-toggle__icon--off');
  const iconOn = toggle.querySelector('.music-toggle__icon--on');

  function updateIcons() {
    if (muted) {
      iconOff.hidden = false;
      iconOn.hidden = true;
    } else {
      iconOff.hidden = true;
      iconOn.hidden = false;
    }
  }

  toggle.addEventListener('click', () => {
    muted = !muted;
    if (muted) {
      audio.pause();
    } else if (!ducked) {
      audio.play().catch(() => {});
    }
    updateIcons();
  });

  updateIcons();
  audio.play().catch(() => {});
}

// Called by timeline when Ne-Yo starts playing
export function duckMusic() {
  ducked = true;
  if (audio && !audio.paused) {
    audio.pause();
  }
}

// Called by timeline when Ne-Yo stops
export function unduckMusic() {
  ducked = false;
  if (audio && !muted) {
    audio.play().catch(() => {});
  }
}
