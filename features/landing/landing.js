const SHAPES = [
  { type: 'heart',     top: '8%',  left: '10%', size: 22, anim: 'float1', dur: '8s',  delay: '0s',   opacity: 0.4 },
  { type: 'heart',     top: '15%', left: '80%', size: 18, anim: 'float2', dur: '10s', delay: '0.5s', opacity: 0.35 },
  { type: 'heart',     top: '70%', left: '15%', size: 16, anim: 'float4', dur: '9s',  delay: '1s',   opacity: 0.3 },
  { type: 'star',      top: '12%', left: '55%', size: 14, anim: 'float3', dur: '11s', delay: '0.3s', opacity: 0.45 },
  { type: 'star',      top: '75%', left: '78%', size: 12, anim: 'float1', dur: '9s',  delay: '0.8s', opacity: 0.35 },
  { type: 'star',      top: '45%', left: '5%',  size: 13, anim: 'float2', dur: '10s', delay: '1.2s', opacity: 0.3 },
  { type: 'blob',      top: '25%', left: '85%', size: 40, anim: 'float3', dur: '12s', delay: '0s',   opacity: 0.25 },
  { type: 'blob',      top: '65%', left: '70%', size: 35, anim: 'float4', dur: '11s', delay: '0.6s', opacity: 0.2 },
  { type: 'blob-blue', top: '80%', left: '40%', size: 28, anim: 'float1', dur: '13s', delay: '0.4s', opacity: 0.25 },
  { type: 'blob-blue', top: '30%', left: '20%', size: 32, anim: 'float2', dur: '10s', delay: '1s',   opacity: 0.2 },
];

function createShapes() {
  const container = document.querySelector('.landing__shapes');
  if (!container) return;

  SHAPES.forEach(s => {
    const el = document.createElement('div');
    el.classList.add('shape', `shape--${s.type}`);
    el.style.top = s.top;
    el.style.left = s.left;
    el.style.width = `${s.size}px`;
    el.style.height = `${s.size}px`;
    el.style.animation = `${s.anim} ${s.dur} ease-in-out ${s.delay} infinite`;
    el.style.opacity = s.opacity;
    container.appendChild(el);
  });
}

export function initLanding(onOpen) {
  createShapes();

  const btn = document.getElementById('landing-btn');
  const landing = document.getElementById('landing');

  btn.addEventListener('click', () => {
    btn.disabled = true;
    landing.classList.add('hidden');

    landing.addEventListener('transitionend', () => {
      landing.style.display = 'none';
      if (onOpen) onOpen();
    }, { once: true });
  });
}
