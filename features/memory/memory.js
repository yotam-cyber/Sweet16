// ===== CARD IMAGES CONFIG =====
// Replace src values with your image paths (need 12 unique images).
// e.g. '../../assets/images/card1.jpg'

const CARD_IMAGES = [
  { id: 1,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.03.59.jpeg' },
  { id: 2,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.03.59 (1).jpeg' },
  { id: 3,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.01.jpeg' },
  { id: 4,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.01 (1).jpeg' },
  { id: 5,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.01 (2).jpeg' },
  { id: 6,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.01 (3).jpeg' },
  { id: 7,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.01 (4).jpeg' },
  { id: 8,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.02.jpeg' },
  { id: 9,  src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.02 (1).jpeg' },
  { id: 10, src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.03.jpeg' },
  { id: 11, src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.03 (1).jpeg' },
  { id: 12, src: '/assets/images/memory/WhatsApp Image 2026-06-24 at 17.04.03 (2).jpeg' },
];

export function initMemory(onComplete) {
  const grid = document.querySelector('.memory__grid');
  const movesDisplay = document.querySelector('.memory__moves-count');
  const completeOverlay = document.querySelector('.memory__complete');
  const scoreDisplay = document.querySelector('.memory__score');

  let moves = 0;
  let matchedPairs = 0;
  let firstCard = null;
  let secondCard = null;
  let locked = false;

  // Build deck: 12 pairs + 1 star = 25 cards
  const pairs = [];
  CARD_IMAGES.forEach(img => {
    pairs.push({ ...img, type: 'card' });
    pairs.push({ ...img, type: 'card' });
  });

  // Shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  // Insert star at center (index 12 in a 5x5 grid)
  // Replace src with your center image path, e.g. '../../assets/images/center.jpg'
  pairs.splice(12, 0, { id: 'star', type: 'star', src: '/assets/images/memory/center.jpeg' });

  // Build cards
  pairs.forEach((item, i) => {
    const card = document.createElement('div');
    card.classList.add('memory__card');
    if (item.type === 'star') card.classList.add('memory__card--star');
    card.dataset.id = String(item.id);
    card.dataset.index = String(i);

    const inner = document.createElement('div');
    inner.classList.add('memory__card-inner');

    const front = document.createElement('div');
    front.classList.add('memory__card-front');

    const back = document.createElement('div');
    back.classList.add('memory__card-back');

    if (item.src) {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.placeholder || '';
      img.loading = 'lazy';
      back.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.classList.add('memory__card-back-placeholder');
      ph.textContent = item.placeholder;
      back.appendChild(ph);
    }

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    grid.appendChild(card);

    // Star is always face-up
    if (item.type === 'star') {
      card.classList.add('flipped', 'matched');
      return;
    }

    card.addEventListener('click', () => onCardClick(card));
  });

  function onCardClick(card) {
    if (locked) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    locked = true;
    moves++;
    movesDisplay.textContent = moves;

    if (firstCard.dataset.id === secondCard.dataset.id) {
      // Match
      setTimeout(() => {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        resetTurn();

        if (matchedPairs === CARD_IMAGES.length) {
          setTimeout(() => finish(), 600);
        }
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        firstCard.classList.add('wrong');
        secondCard.classList.add('wrong');

        setTimeout(() => {
          firstCard.classList.remove('flipped', 'wrong');
          secondCard.classList.remove('flipped', 'wrong');
          resetTurn();
        }, 600);
      }, 800);
    }
  }

  function resetTurn() {
    firstCard = null;
    secondCard = null;
    locked = false;
  }

  function finish() {
    if (scoreDisplay) scoreDisplay.textContent = moves;
    completeOverlay.classList.add('visible');
    if (onComplete) onComplete();
  }
}
