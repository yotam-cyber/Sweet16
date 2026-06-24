import { duckMusic, unduckMusic } from '../music/music.js';

// ===== MEDIA CONFIG =====
// To add your content, just replace the src values below.
// Photos: set src to the image path (e.g. '../../assets/images/photo1.jpg')
// Videos: set src to the video path (e.g. '../../assets/videos/clip1.mp4')
// Audio:  set src to the audio path (e.g. '../../assets/audio/song.mp3')

const SLIDES = [
  { type: 'photo', src: './assets/images/1.jpeg',    caption: 'ניצחון מוחלט חחח' },
  { type: 'photo', src: './assets/images/2.jpeg',    caption: 'יפיפה הנרדמת' },
  { type: 'photo', src: './assets/images/3.jpeg',    caption: 'שחקנית בראול סטארס שלי' },
  { type: 'photo', src: './assets/images/4.jpeg',    caption: 'שמה סדרה ונרדמת' },
  { type: 'photo', src: './assets/images/5.jpeg',    caption: 'שוב עייפה' },
  { type: 'photo', src: './assets/images/6.jpeg',    caption: 'במתחם' },
  { type: 'photo', src: './assets/images/6.5.jpeg',  caption: 'ילדה יפה' },
  { type: 'photo', src: './assets/images/7.jpeg',    caption: 'חיוך ממכר' },
  { type: 'photo', src: './assets/images/8.jpeg',    caption: 'אהבתי' },
  { type: 'photo', src: './assets/images/9.jpeg',    caption: 'איזה דבררר' },
  { type: 'photo', src: './assets/images/10.jpeg',   caption: 'המיקום של היד 10/10' },
  { type: 'photo', src: './assets/images/11.jpeg',   caption: 'מתוקה' },
  { type: 'audio', src: './assets/audio/Ne-Yo - She Knows  ft. Juicy J.mp3', caption: 'השיר שלך' },
  { type: 'photo', src: './assets/images/12.jpeg',   caption: 'הדבר שהכי ריגש אותי' },
  { type: 'photo', src: './assets/images/13.jpeg',   caption: 'אנחנו' },
  { type: 'photo', src: './assets/images/14.jpeg',   caption: 'בהלם במובילנד' },
  { type: 'photo', src: './assets/images/15.jpeg',   caption: 'מכור לשיער שכל הזמן בפה שלי' },
  { type: 'photo', src: './assets/images/16.jpeg',   caption: 'שווה אלף מילים' },
  { type: 'photo', src: './assets/images/16.5.jpeg', caption: 'שעות של אסיפת פרחים' },
  { type: 'video', src: './assets/videos/17.mp4',    caption: 'מתרגשת יותר מנוגה חחח' },
  { type: 'photo', src: './assets/images/18.jpeg',   caption: 'יפיפה הנרדמת 2' },
  { type: 'video', src: './assets/videos/19.mp4',    caption: 'התינוק שלך (ואני)' },
  { type: 'photo', src: './assets/images/20.jpeg',   caption: 'חיפה' },
  { type: 'photo', src: './assets/images/21.jpeg',   caption: 'ההחזקה של היד' },
  { type: 'photo', src: './assets/images/22.jpeg',   caption: 'הילדה הכי יפה בישראל' },
];

export function initTimeline(onComplete) {
  const wheel = document.querySelector('.timeline__wheel');
  const dotsContainer = document.querySelector('.timeline__dots');
  const hint = document.querySelector('.timeline__hint');
  const completeOverlay = document.querySelector('.timeline__complete');

  let current = 0;
  let scrollAccum = 0;
  let finished = false;
  const SCROLL_THRESHOLD = 80;

  // Audio element for the song slide
  let audioEl = null;
  let audioFadeInterval = null;

  const slides = [];

  SLIDES.forEach((item, i) => {
    const slide = document.createElement('div');
    slide.classList.add('timeline__slide');
    slide.dataset.type = item.type;
    slide.dataset.index = String(i);

    const wrapper = document.createElement('div');
    wrapper.classList.add('timeline__photo-wrapper');

    if (item.type === 'photo') {
      buildPhoto(wrapper, item);
    } else if (item.type === 'video') {
      buildVideo(wrapper, item);
    } else if (item.type === 'audio') {
      buildAudio(wrapper, item);
    }

    const caption = document.createElement('div');
    caption.classList.add('timeline__caption');
    caption.textContent = item.caption;
    wrapper.appendChild(caption);

    slide.appendChild(wrapper);
    wheel.appendChild(slide);
    slides.push(slide);
  });

  function buildPhoto(wrapper, item) {
    if (item.src) {
      const img = document.createElement('img');
      img.classList.add('timeline__photo');
      img.src = item.src;
      img.alt = item.caption;
      img.loading = 'lazy';
      img.onload = () => {
        const ratio = img.naturalWidth / img.naturalHeight;
        if (ratio > 1.2) {
          wrapper.style.aspectRatio = `4 / 3`;
        } else if (ratio < 0.75) {
          wrapper.style.aspectRatio = `3 / 4.5`;
        } else {
          wrapper.style.aspectRatio = `3 / 4`;
        }
      };
      wrapper.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.classList.add('timeline__photo-placeholder');
      ph.textContent = item.placeholder || '';
      wrapper.appendChild(ph);
    }
  }

  function buildVideo(wrapper, item) {
    if (item.src) {
      const video = document.createElement('video');
      video.classList.add('timeline__video');
      video.src = item.src;
      video.playsInline = true;
      video.muted = true;
      video.loop = true;
      video.preload = 'metadata';
      wrapper.appendChild(video);
    } else {
      const ph = document.createElement('div');
      ph.classList.add('timeline__photo-placeholder', 'timeline__video-placeholder');
      ph.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>${item.placeholder}</span>`;
      wrapper.appendChild(ph);
    }
  }

  function buildAudio(wrapper, item) {
    const audioSlide = document.createElement('div');
    audioSlide.classList.add('timeline__audio-slide');

    // Waveform bars
    const waveform = document.createElement('div');
    waveform.classList.add('timeline__waveform');
    const barCount = 32;
    for (let b = 0; b < barCount; b++) {
      const bar = document.createElement('div');
      bar.classList.add('timeline__waveform-bar');
      bar.style.animationDelay = `${(b * 0.08) % 1.2}s`;
      // Varying heights for visual interest
      const h = 20 + Math.sin(b * 0.6) * 30 + Math.random() * 25;
      bar.style.setProperty('--bar-h', `${h}%`);
      waveform.appendChild(bar);
    }
    audioSlide.appendChild(waveform);

    // Track line (progress)
    const trackLine = document.createElement('div');
    trackLine.classList.add('timeline__track-line');
    const trackProgress = document.createElement('div');
    trackProgress.classList.add('timeline__track-progress');
    trackLine.appendChild(trackProgress);
    audioSlide.appendChild(trackLine);

    // Song info — show actual song name from src
    const songName = item.src ? decodeURIComponent(item.src.split('/').pop().replace(/\.[^.]+$/, '')) : '';
    const info = document.createElement('div');
    info.classList.add('timeline__audio-info');
    info.innerHTML = `<span class="timeline__audio-icon">&#9835;</span><span>${songName}</span>`;
    audioSlide.appendChild(info);

    if (item.src) {
      audioEl = new Audio(item.src);
      audioEl.preload = 'metadata';
      audioEl.loop = true;
    }

    wrapper.appendChild(audioSlide);
    wrapper.classList.add('timeline__audio-wrapper');
  }

  // Build counter
  const counter = document.createElement('span');
  counter.classList.add('timeline__counter');
  counter.textContent = `1 / ${SLIDES.length}`;
  dotsContainer.appendChild(counter);

  // ===== SLIDE POSITIONING =====
  function positionSlides() {
    slides.forEach((slide, i) => {
      const offset = i - current;

      if (Math.abs(offset) > 2) {
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
        slide.style.transform = `translateX(${offset > 0 ? 120 : -120}%) scale(0.6)`;
        return;
      }

      const translateX = offset * 70;
      const rotateY = offset * -35;
      const scale = 1 - Math.abs(offset) * 0.15;
      const z = -Math.abs(offset) * 100;
      const opacity = 1 - Math.abs(offset) * 0.35;

      slide.style.transform = `translateX(${translateX}%) rotateY(${rotateY}deg) translateZ(${z}px) scale(${scale})`;
      slide.style.opacity = String(Math.max(0, opacity));
      slide.style.zIndex = String(10 - Math.abs(offset));
      slide.style.pointerEvents = offset === 0 ? 'auto' : 'none';
    });

    counter.textContent = `${current + 1} / ${SLIDES.length}`;
  }

  // ===== MEDIA CONTROL =====
  function handleMediaChange(prevIndex, newIndex) {
    // Pause previous video
    const prevSlide = slides[prevIndex];
    if (prevSlide) {
      const vid = prevSlide.querySelector('video');
      if (vid) vid.pause();
    }

    // Play current video if centered
    const newSlide = slides[newIndex];
    if (newSlide) {
      const vid = newSlide.querySelector('video');
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }

    // Audio: fade in/out based on whether we're on the audio slide
    const audioSlideIndex = SLIDES.findIndex(s => s.type === 'audio');
    const waveform = document.querySelector('.timeline__waveform');

    if (newIndex === audioSlideIndex && audioEl) {
      // Duck background music, play Ne-Yo
      duckMusic();
      clearInterval(audioFadeInterval);
      audioEl.volume = 0;
      audioEl.play().catch(() => {});
      if (waveform) waveform.classList.add('playing');

      audioFadeInterval = setInterval(() => {
        if (audioEl.volume < 0.95) {
          audioEl.volume = Math.min(1, audioEl.volume + 0.05);
        } else {
          audioEl.volume = 1;
          clearInterval(audioFadeInterval);
        }
      }, 50);
    } else if (prevIndex === audioSlideIndex && audioEl && !audioEl.paused) {
      // Stop Ne-Yo, resume background music
      clearInterval(audioFadeInterval);
      audioEl.pause();
      audioEl.currentTime = 0;
      audioEl.volume = 0;
      if (waveform) waveform.classList.remove('playing');
      unduckMusic();
    }
  }

  // ===== NAVIGATION =====
  function goTo(index) {
    if (index < 0 || index >= SLIDES.length || finished) return;
    const prev = current;
    current = index;
    positionSlides();
    handleMediaChange(prev, current);

    if (hint && current > 0) hint.classList.add('hidden');

    if (current === SLIDES.length - 1 && !finished) {
      finished = true;
      setTimeout(() => {
        completeOverlay.classList.add('visible');
        if (onComplete) onComplete();
      }, 800);
    }
  }

  function handleScroll(deltaY) {
    if (finished) return;
    scrollAccum += deltaY;

    if (scrollAccum > SCROLL_THRESHOLD) {
      scrollAccum = 0;
      goTo(current + 1);
    } else if (scrollAccum < -SCROLL_THRESHOLD) {
      scrollAccum = 0;
      goTo(current - 1);
    }
  }

  // Mouse wheel
  wheel.closest('.timeline').addEventListener('wheel', (e) => {
    e.preventDefault();
    handleScroll(e.deltaY);
  }, { passive: false });

  // Touch
  let touchStartY = 0;
  let touching = false;

  wheel.closest('.timeline').addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touching = true;
    scrollAccum = 0;
  }, { passive: true });

  wheel.closest('.timeline').addEventListener('touchmove', (e) => {
    if (!touching) return;
    e.preventDefault();
    const dy = touchStartY - e.touches[0].clientY;
    handleScroll(dy);
    touchStartY = e.touches[0].clientY;
  }, { passive: false });

  wheel.closest('.timeline').addEventListener('touchend', () => {
    touching = false;
    scrollAccum = 0;
  });

  // Init
  positionSlides();
}
