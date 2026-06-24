// ===== PROOF SCREENSHOTS =====
// Each entry: image path and optional caption

const PROOFS = [
  { src: '/assets/images/screenshots/1.jpeg', caption: '' },
  { src: '/assets/images/screenshots/2.jpeg', caption: '' },
  { src: '/assets/images/screenshots/3.jpeg', caption: '' },
  { src: '/assets/images/screenshots/4.jpeg', caption: '' },
];

export function initProof() {
  const list = document.querySelector('.proof__list');
  if (!list) return;

  const items = [];

  PROOFS.forEach(p => {
    const item = document.createElement('div');
    item.classList.add('proof__item');

    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.caption || 'Proof screenshot';
    img.loading = 'lazy';
    item.appendChild(img);

    if (p.caption) {
      const caption = document.createElement('div');
      caption.classList.add('proof__caption');
      caption.textContent = p.caption;
      item.appendChild(caption);
    }

    list.appendChild(item);
    items.push(item);
  });

  // Fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}
