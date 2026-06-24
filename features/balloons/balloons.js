// ===== SENTENCES CONFIG =====
// Each sentence gets its own balloon. Add or remove as you like.
// Set 'image' to a path to put a picture on that balloon (e.g. Stitch, Nick Wilde, a dog, etc.)

const SENTENCES = [
  { text: 'את הדבר הכי יפה שקרה לי',  image: 'https://kh.wiki.gallery/images/2/24/Nick_Wilde_KHUX.png', colorIndex: 5 },
  { text: 'החיוך שלך מאיר את כל החדר',  image: '/assets/images/smile.jpeg' },
  { text: 'אין עלייך בשום מקום בעולם והייתי בהרבה מקומות',  image: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Stitch_%28Lilo_%26_Stitch%29.svg/250px-Stitch_%28Lilo_%26_Stitch%29.svg.png', colorIndex: 1 },
  { text: 'כל רגע איתך שווה הכל',  image: '/assets/images/moment.jpeg' },
  { text: 'מגיע לך הכל',  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhurGlU0MrCQ21kaWm2G2qRd9yp_ZmgwHDUKXSJips-Q&s=10', colorIndex: 3 },
  { text: 'אני מתגעגע אלייך כל דקה',  image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/54/ca/fe/caption.jpg?w=1100&h=1100&s=1' },
  { text: 'איתך אני מרגיש הכי בבית',  image: 'https://matkonimil.co.il/wp-content/uploads/2018/09/WhatsApp-Image-2018-09-16-at-22.12.15-e1537125353325.jpeg' },
  { text: 'את חמודה מאודדדד',  image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/108b3722-09ff-4187-8a71-aab33b0eb774/da36u23-33e00d2e-0662-42c3-8dc0-bf78beb21cd9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8xMDhiMzcyMi0wOWZmLTQxODctOGE3MS1hYWIzM2IwZWI3NzQvZGEzNnUyMy0zM2UwMGQyZS0wNjYyLTQyYzMtOGRjMC1iZjc4YmViMjFjZDkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RyTce8tYq3nkF-9KGrbcd4gS3NiEHSSaTTneFX9IrgA', colorIndex: 7 },
  { text: 'יום הולדת שמח לילדה הכי מדהימה',  image: 'https://media.tenor.com/6LrsYVynKNgAAAAe/milk-and-mocha-bears-hugs.png' },
  { text: 'תודה לך על כל האוכל',  image: 'https://chef-lavan.co.il/wp-content/uploads/old-storage/uploads/images/0cab7ad38d802377ce66bd5734bf2815.jpg' },
];

// Which balloon indices get character images (Stitch, Nick, dog, etc.)
// Just set the 'image' field above to a file path and it shows on the balloon.
// Example: { text: 'You are amazing!', image: '../../assets/images/stitch.png' }

const COLORS = [
  { base: '#F472B6', light: '#F9A8D4', dark: '#DB2777' },
  { base: '#60A5FA', light: '#93C5FD', dark: '#2563EB' },
  { base: '#A78BFA', light: '#C4B5FD', dark: '#7C3AED' },
  { base: '#FBBF24', light: '#FDE68A', dark: '#D97706' },
  { base: '#34D399', light: '#6EE7B7', dark: '#059669' },
  { base: '#FB923C', light: '#FDBA74', dark: '#EA580C' },
  { base: '#F87171', light: '#FCA5A5', dark: '#DC2626' },
  { base: '#818CF8', light: '#A5B4FC', dark: '#4F46E5' },
];

export function initBalloons(onComplete) {
  const canvas = document.querySelector('.balloons__canvas');
  const arena = document.querySelector('.balloons__arena');
  const flash = document.querySelector('.balloons__flash');
  const sentenceEl = document.querySelector('.balloons__sentence');
  const completeOverlay = document.querySelector('.balloons__complete');
  const resultTitle = document.querySelector('.balloons__result-title');
  const resultBody = document.querySelector('.balloons__result-body');
  const scoreDisplay = document.querySelector('.balloons__caught-count');

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let balloons = [];
  let popped = [];
  let missed = [];
  let paused = false;
  let gameOver = false;
  let animId = null;
  let lastTime = 0;
  let clouds = [];
  let particles = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = arena.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * width,
        y: 30 + Math.random() * (height * 0.4),
        w: 60 + Math.random() * 80,
        speed: 3 + Math.random() * 5,
      });
    }
  }

  // Preload images
  const loadedImages = new Map();

  function preloadImages() {
    return Promise.all(SENTENCES.map((s, i) => {
      if (!s.image) return Promise.resolve();
      return new Promise(resolve => {
        const img = new Image();
        img.onload = () => { loadedImages.set(i, img); resolve(); };
        img.onerror = () => resolve();
        img.src = s.image;
      });
    }));
  }

  function createBalloon(index, delay) {
    const hasImg = !!SENTENCES[index].image;
    const radius = hasImg ? 40 + Math.random() * 6 : 32 + Math.random() * 10;
    return {
      index,
      x: 35 + Math.random() * (width - 70),
      y: height + radius + delay,
      radius,
      color: COLORS[SENTENCES[index].colorIndex ?? (index % COLORS.length)],
      hasImage: !!SENTENCES[index].image,
      speed: 55 + Math.random() * 25,
      wobbleAmp: 3 + Math.random() * 4,
      wobbleSpeed: 0.3 + Math.random() * 0.2,
      wobbleOffset: Math.random() * Math.PI * 2,
      rotation: (Math.random() - 0.5) * 0.1,
      alive: true,
      sentence: SENTENCES[index].text,
      time: 0,
    };
  }

  // ===== DRAWING =====

  function drawBackground(dt) {
    clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > width + c.w) c.x = -c.w;
      drawCloud(c.x, c.y, c.w);
    });
  }

  function drawCloud(x, y, w) {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = '#FFFFFF';
    const h = w * 0.35;
    ctx.beginPath();
    ctx.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x - w * 0.25, y + h * 0.1, w * 0.3, h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.28, y + h * 0.05, w * 0.28, h * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function balloonGradient(x, y, r, color) {
    const grad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x + r * 0.1, y + r * 0.2, r * 1.1);
    grad.addColorStop(0, color.light);
    grad.addColorStop(0.5, color.base);
    grad.addColorStop(1, color.dark);
    return grad;
  }

  function addShine(x, y, r) {
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.05, x - r * 0.3, y - r * 0.35, r * 0.45);
    grad.addColorStop(0, 'rgba(255,255,255,0.65)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x - r * 0.25, y - r * 0.3, r * 0.3, r * 0.4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - r * 0.15, y - r * 0.45, r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  }

  function drawBalloon(b) {
    const wobbleX = Math.sin(b.time * b.wobbleSpeed * Math.PI * 2 + b.wobbleOffset) * b.wobbleAmp;
    const drawX = b.x + wobbleX;
    const r = b.radius;

    ctx.save();
    ctx.translate(drawX, b.y);
    ctx.rotate(Math.sin(b.time * 0.5 + b.wobbleOffset) * b.rotation);
    ctx.translate(-drawX, -b.y);

    // String
    ctx.beginPath();
    ctx.moveTo(drawX, b.y + r);
    ctx.quadraticCurveTo(drawX + 3, b.y + r + 16, drawX - 2, b.y + r + 28);
    ctx.strokeStyle = b.color.dark;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Balloon body
    ctx.beginPath();
    ctx.ellipse(drawX, b.y, r * 0.88, r, 0, 0, Math.PI * 2);
    ctx.fillStyle = balloonGradient(drawX, b.y, r, b.color);
    ctx.fill();

    // Knot
    ctx.beginPath();
    ctx.moveTo(drawX - 3, b.y + r);
    ctx.lineTo(drawX, b.y + r + 5);
    ctx.lineTo(drawX + 3, b.y + r);
    ctx.closePath();
    ctx.fillStyle = b.color.dark;
    ctx.fill();

    // Character image (clipped circle on the balloon)
    const img = loadedImages.get(b.index);
    if (img) {
      const imgR = r * 0.78;
      ctx.save();
      ctx.beginPath();
      ctx.arc(drawX, b.y - r * 0.03, imgR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, drawX - imgR, b.y - r * 0.03 - imgR, imgR * 2, imgR * 2);
      ctx.restore();

      ctx.beginPath();
      ctx.arc(drawX, b.y - r * 0.03, imgR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Shine (on top of everything)
    addShine(drawX, b.y, r);

    ctx.restore();
    b.drawX = drawX;
  }

  // ===== PARTICLES =====

  function spawnPop(x, y, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * (80 + Math.random() * 60),
        vy: Math.sin(angle) * (80 + Math.random() * 60),
        r: 2 + Math.random() * 4,
        color: [color.base, color.light, color.dark][Math.floor(Math.random() * 3)],
        life: 1,
      });
    }
  }

  function updateParticles(dt) {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt;
      p.life -= dt * 1.5;
      p.r *= (1 - dt * 0.5);

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ===== GAME LOOP =====

  function init() {
    resize();
    createClouds();

    preloadImages().then(() => {
      balloons = SENTENCES.map((_, i) => createBalloon(i, i * 130));
      popped = [];
      missed = [];
      particles = [];
      paused = false;
      gameOver = false;

      flash.classList.remove('hidden');
      lastTime = 0;
      setTimeout(() => {
        flash.classList.add('hidden');
        lastTime = performance.now();
        loop(lastTime);
      }, 1200);
    });
  }

  function loop(now) {
    if (gameOver) return;
    if (paused) {
      lastTime = now;
      animId = requestAnimationFrame(loop);
      return;
    }

    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);
    drawBackground(dt);

    let allDone = true;

    balloons.forEach(b => {
      if (!b.alive) return;
      allDone = false;

      b.y -= b.speed * dt;
      b.time += dt;

      if (b.y + b.radius < -20) {
        b.alive = false;
        missed.push(b.sentence);
        checkEnd();
        return;
      }

      drawBalloon(b);
    });

    updateParticles(dt);

    if (allDone && !gameOver) checkEnd();

    animId = requestAnimationFrame(loop);
  }

  function pop(balloon) {
    balloon.alive = false;
    popped.push(balloon.sentence);
    if (scoreDisplay) scoreDisplay.textContent = popped.length;

    spawnPop(balloon.drawX, balloon.y, balloon.color);

    paused = true;
    sentenceEl.textContent = balloon.sentence;
    sentenceEl.classList.add('visible');

    setTimeout(() => {
      sentenceEl.classList.remove('visible');
      paused = false;
      checkEnd();
    }, 2500);
  }

  function checkEnd() {
    const remaining = balloons.filter(b => b.alive).length;
    if (remaining > 0 || paused) return;

    gameOver = true;
    cancelAnimationFrame(animId);
    setTimeout(() => finish(), 500);
  }

  function finish() {
    if (missed.length === 0) {
      resultTitle.textContent = 'You caught them all!';
      resultBody.innerHTML = '<p>בכל בלון היה משהו שרציתי שתדעי</p>';
    } else {
      resultTitle.textContent = `You caught ${popped.length} / ${SENTENCES.length}`;
      const label = document.createElement('p');
      label.textContent = 'You missed these:';
      resultBody.appendChild(label);
      const missedList = document.createElement('div');
      missedList.classList.add('balloons__missed');
      missed.forEach(s => {
        const item = document.createElement('div');
        item.classList.add('balloons__missed-item');
        item.textContent = s;
        missedList.appendChild(item);
      });
      resultBody.appendChild(missedList);
    }

    completeOverlay.classList.add('visible');
    if (onComplete) onComplete();
  }

  // ===== HIT TESTING =====

  function handleTap(clientX, clientY) {
    if (paused || gameOver) return;

    const rect = canvas.getBoundingClientRect();
    const tapX = clientX - rect.left;
    const tapY = clientY - rect.top;

    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      if (!b.alive || b.drawX === undefined) continue;

      const dx = tapX - b.drawX;
      const dy = tapY - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= b.radius * 1.3) {
        pop(b);
        return;
      }
    }
  }

  canvas.addEventListener('click', (e) => handleTap(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleTap(touch.clientX, touch.clientY);
  }, { passive: false });

  window.addEventListener('resize', resize);

  init();
}
