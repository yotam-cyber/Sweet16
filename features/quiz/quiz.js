// ===== QUIZ CONFIG =====
// Each question: quote, answer ('name' or 'person'), person (the famous person's name)
// 'name' means she said it, 'person' means the famous person said it.

// Her name and photo (replace with actual image path)
const NAME = 'Rotem';
const NAME_IMAGE = './assets/images/rotem.jpeg';

// Famous people photos — add image URLs for each person
const PERSON_IMAGES = {
  'Eminem':       'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/108b3722-09ff-4187-8a71-aab33b0eb774/da36u23-33e00d2e-0662-42c3-8dc0-bf78beb21cd9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi8xMDhiMzcyMi0wOWZmLTQxODctOGE3MS1hYWIzM2IwZWI3NzQvZGEzNnUyMy0zM2UwMGQyZS0wNjYyLTQyYzMtOGRjMC1iZjc4YmViMjFjZDkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RyTce8tYq3nkF-9KGrbcd4gS3NiEHSSaTTneFX9IrgA',
  'Trump':              'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
  'Bruno Mars':         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhurGlU0MrCQ21kaWm2G2qRd9yp_ZmgwHDUKXSJips-Q&s=10',
  'Nick':               'https://kh.wiki.gallery/images/2/24/Nick_Wilde_KHUX.png',
  'My grandpa (fridge)':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/%D7%93%D7%95%D7%93_%D7%9E%D7%99%D7%98%D7%9C%D7%91%D7%A8%D7%92.jpg/1280px-%D7%93%D7%95%D7%93_%D7%9E%D7%99%D7%98%D7%9C%D7%91%D7%A8%D7%92.jpg',
  'Stitch':             'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Stitch_%28Lilo_%26_Stitch%29.svg/250px-Stitch_%28Lilo_%26_Stitch%29.svg.png',
  'Nina Dobrev':        'https://hips.hearstapps.com/hmg-prod/images/ftra0410-69ab030182dcb.jpg?crop=1xw:0.6666666666666666xh;center,top&resize=1120:*',
  'Liam Neeson':        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3R5w4OQpq4_rgDscxTuMXTei7o70XAm6_pvtPXG3k5Q&s=10',
  'Beyoncé':            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrV0Rr2jwRaN-rwSsQ6T6ULrP_tgWDRAAikvV5SFQhiw&s=10',
  'Taylor Swift':       'https://m.media-amazon.com/images/M/MV5BYWYwYzYzMjUtNWE0MS00NmJlLTljNGMtNzliYjg5NzQ1OWY5XkEyXkFqcGc@._V1_.jpg',
};

const QUESTIONS = [
  { quote: 'When you\'ll be back you will see',  answer: 'name',   person: 'Eminem' },
  { quote: 'I love the beautiful people',  answer: 'person', person: 'Trump' },
  { quote: 'I allways need you',  answer: 'name',   person: 'Bruno Mars' },
  { quote: 'Its called a hustle, sweetheart.',  answer: 'person', person: 'Nick' },
  { quote: 'I have my ways',  answer: 'name',   person: 'Beyoncé' },
  { quote: 'Meega, nala kwishta!',  answer: 'person', person: 'Stitch' },
  { quote: 'I love sparkles',  answer: 'person',   person: 'Taylor Swift' },
  { quote: 'How is your Rotem doing?',  answer: 'person', person: 'My grandpa (fridge)' },
  { quote: 'No no they finished me im in a dying state on my life',  answer: 'name',   person: 'Liam Neeson' },
  { quote: 'You have to learn to appreciate it all', answer: 'person', person: 'Nina Dobrev' },
]

const FEEDBACK_CORRECT = ['Nailed it!', 'You know it!', 'Correct!', 'Yes!', 'Spot on!'];
const FEEDBACK_WRONG = ['Nope!', 'Not quite!', 'Wrong!', 'Oops!', 'Nice try!'];

export function initQuiz(onComplete) {
  const quoteEl = document.querySelector('.quiz__quote');
  const choicesEl = document.querySelector('.quiz__choices');
  const counterEl = document.querySelector('.quiz__counter');
  const feedbackEl = document.querySelector('.quiz__feedback');
  const completeOverlay = document.querySelector('.quiz__complete');
  const scoreEl = document.querySelector('.quiz__score-big');
  const resultMsg = document.querySelector('.quiz__result-msg');

  let current = 0;
  let score = 0;
  let locked = false;

  function showQuestion() {
    const q = QUESTIONS[current];
    quoteEl.textContent = q.quote;
    counterEl.textContent = `${current + 1} / ${QUESTIONS.length}`;
    feedbackEl.classList.remove('visible', 'correct', 'wrong');
    feedbackEl.textContent = '';

    choicesEl.innerHTML = '';

    // Randomize button order
    const nameFirst = Math.random() > 0.5;
    const options = nameFirst
      ? [{ label: NAME, value: 'name', image: NAME_IMAGE }, { label: q.person, value: 'person', image: PERSON_IMAGES[q.person] || '' }]
      : [{ label: q.person, value: 'person', image: PERSON_IMAGES[q.person] || '' }, { label: NAME, value: 'name', image: NAME_IMAGE }];

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.classList.add('quiz__choice');
      btn.dataset.value = opt.value;

      const imgWrapper = document.createElement('div');
      imgWrapper.classList.add('quiz__choice-img');
      if (opt.image) {
        const img = document.createElement('img');
        img.src = opt.image;
        img.alt = opt.label;
        img.crossOrigin = 'anonymous';
        imgWrapper.appendChild(img);
      } else {
        const placeholder = document.createElement('div');
        placeholder.classList.add('quiz__choice-placeholder');
        placeholder.textContent = opt.label.charAt(0);
        imgWrapper.appendChild(placeholder);
      }
      btn.appendChild(imgWrapper);

      const name = document.createElement('span');
      name.classList.add('quiz__choice-name');
      name.textContent = opt.label;
      btn.appendChild(name);

      btn.addEventListener('click', () => handleAnswer(btn, opt.value));
      choicesEl.appendChild(btn);
    });

    locked = false;
  }

  function handleAnswer(btn, value) {
    if (locked) return;
    locked = true;

    const q = QUESTIONS[current];
    const isCorrect = value === q.answer;
    const buttons = choicesEl.querySelectorAll('.quiz__choice');

    if (isCorrect) {
      score++;
      btn.classList.add('correct');
      feedbackEl.textContent = FEEDBACK_CORRECT[Math.floor(Math.random() * FEEDBACK_CORRECT.length)];
      feedbackEl.classList.add('visible', 'correct');
    } else {
      btn.classList.add('wrong');
      // Highlight the correct one
      buttons.forEach(b => {
        if (b.dataset.value === q.answer) b.classList.add('correct');
      });
      feedbackEl.textContent = FEEDBACK_WRONG[Math.floor(Math.random() * FEEDBACK_WRONG.length)];
      feedbackEl.classList.add('visible', 'wrong');
    }

    buttons.forEach(b => b.classList.add('disabled'));

    setTimeout(() => {
      current++;
      if (current < QUESTIONS.length) {
        showQuestion();
      } else {
        finish();
      }
    }, 1500);
  }

  function finish() {
    scoreEl.textContent = `${score} / ${QUESTIONS.length}`;

    let msg = '';
    const pct = score / QUESTIONS.length;
    if (pct === 1) msg = 'Perfect! You know everything!\nStill don\'t believe me? Keep scrolling...';
    else if (pct >= 0.7) msg = 'Pretty impressive!\nStill don\'t believe me? Keep scrolling...';
    else if (pct >= 0.4) msg = 'Not bad, not bad...\nDon\'t believe those were real? Keep scrolling...';
    else msg = 'Told you I pay attention to everything you say.\nDon\'t believe it? Keep scrolling...';

    resultMsg.textContent = msg;
    completeOverlay.classList.add('visible');
    if (onComplete) onComplete();
  }

  showQuestion();
}
