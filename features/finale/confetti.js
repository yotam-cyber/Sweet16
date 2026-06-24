const CONFETTI_COLORS = [
  '#F472B6', '#FBCFE8', // pinks
  '#60A5FA', '#BFDBFE', // blues
  '#F59E0B', '#FDE68A', // golds
  '#A78BFA',            // purple
  '#FFFFFF',            // white
];

export function initFinale() {
  const canvas = document.querySelector('.finale__canvas');
  const heartsContainer = document.querySelector('.finale__hearts');
  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let particles = [];
  let lastTime = 0;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Floating hearts
  function createHearts() {
    const heartColors = ['#F472B6', '#FBCFE8', '#F9A8D4', '#60A5FA', '#F59E0B'];
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('div');
      heart.classList.add('finale__heart');
      heart.style.left = `${5 + Math.random() * 90}%`;
      heart.style.setProperty('--dur', `${5 + Math.random() * 5}s`);
      heart.style.setProperty('--delay', `${Math.random() * 6}s`);
      heart.style.setProperty('--size', `${12 + Math.random() * 14}px`);
      heart.style.setProperty('--clr', heartColors[i % heartColors.length]);
      heartsContainer.appendChild(heart);
    }
  }

  // Confetti particle
  function createParticle() {
    const isRibbon = Math.random() > 0.5;
    return {
      x: width * 0.1 + Math.random() * width * 0.8,
      y: -10 - Math.random() * height * 0.3,
      w: isRibbon ? 3 + Math.random() * 4 : 6 + Math.random() * 6,
      h: isRibbon ? 12 + Math.random() * 14 : 6 + Math.random() * 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 6,
      vx: (Math.random() - 0.5) * 60,
      vy: 40 + Math.random() * 80,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.5 + Math.random() * 2,
      wobbleAmp: 20 + Math.random() * 30,
      life: 1,
    };
  }

  function burst() {
    for (let i = 0; i < 120; i++) {
      particles.push(createParticle());
    }
  }

  // Gentle ongoing rain after burst
  let raining = false;
  function startRain() {
    raining = true;
  }

  function loop(now) {
    if (!lastTime) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // Add rain particles
    if (raining && particles.length < 60 && Math.random() > 0.7) {
      const p = createParticle();
      p.vy = 30 + Math.random() * 50;
      particles.push(p);
    }

    particles = particles.filter(p => p.life > 0 && p.y < height + 30);

    particles.forEach(p => {
      p.wobble += p.wobbleSpeed * dt;
      p.x += p.vx * dt + Math.sin(p.wobble) * p.wobbleAmp * dt;
      p.y += p.vy * dt;
      p.rotation += p.rotSpeed * dt;

      // Slow down gradually
      p.vy += 15 * dt;
      p.vx *= (1 - 0.5 * dt);

      // Fade near bottom
      if (p.y > height * 0.8) {
        p.life -= dt * 1.5;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(loop);
  }

  // Init
  resize();
  createHearts();

  // Burst after text animates in
  setTimeout(() => {
    burst();
    requestAnimationFrame(loop);
  }, 800);

  // Start gentle rain after burst settles
  setTimeout(() => startRain(), 3000);

  window.addEventListener('resize', resize);
}
