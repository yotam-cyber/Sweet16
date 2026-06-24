# Sweet 16 Birthday Website - Full Plan

## What This Is

A phone-first birthday website for Rotem's Sweet 16. She opens a link on her phone and goes through an interactive journey: an opening letter, mini-games with her photos and inside jokes, a balloon-catching game, a quiz, a personal letter, and a confetti celebration. All content uses placeholders so you can fill in real content by hand.

---

## Site Flow (everything she sees, in order)

### 1. Opening Page (fullscreen, no scrolling)
- Big beautiful "Happy Sweet 16!" text
- A small personal letter below it
- Placeholders: `<name>` for her name, `<small letter>` for the letter content
- A cute button to enter the site ("Open Your Gift" with a heart)
- Background: floating animated hearts, stars, and soft blobs
- Everything fades/slides in when the page loads

### 2. Transition
- She clicks the button -> smooth fade animation (600-800ms)
- The opening page disappears, the scrollable site is revealed
- Music starts (muted by default, toggle in corner)

### 3. Welcome Section
- Sweet message: "I've made some things to celebrate your birthday" (placeholder)
- "Scroll down" text with a bouncing animated arrow
- This section is NOT locked - just a visual intro before the games

### 4. Mini-Game 1: Photo Timeline (SCROLL-LOCKED)
- She CANNOT scroll past this section until she finishes it
- As she swipes up (scrolls), photos scroll horizontally in and out from the sides
- Each photo has a caption
- Placeholders: `<photo 1>`, `<caption 1>`, `<photo 2>`, `<caption 2>`, etc.
- Progress dots at the bottom show how far through she is
- When she's seen all photos -> section unlocks
- Transition message after: "I hope you didn't get embarrassed..." (placeholder text)

### 5. Mini-Game 2: Memory Card Game (SCROLL-LOCKED)
- 5x5 grid (24 matching cards = 12 pairs + 1 star card in the center)
- Cards have custom images of her or things she likes
- Placeholders: `<card image 1>`, `<card image 2>`, etc.
- Tap a card to flip it (3D flip animation)
- Match pairs to clear them
- Keeps track of how many moves it took
- Win screen shows her move count
- Section unlocks after winning
- Transition message: "Hope you enjoyed this..." (placeholder)

### 6. Mini-Game 3: Balloon Pop Game (SCROLL-LOCKED)
- Square game area on the screen
- "Catch the balloons!" text flashes for 1 second
- Balloons rise up from the bottom in different colors and sizes
- She taps to pop them
- Each pop: game PAUSES for 2.5 seconds and shows a cute sentence on screen
- Placeholders: `<sentence 1>`, `<sentence 2>`, `<sentence 3>`, etc.
- Number of balloons = number of sentences
- End screen options:
  - ALL caught: "You caught them all! Congratulations!"
  - Some missed: "You missed these:" + scrollable list of missed sentences
- Section unlocks after the game ends

### 7. Mini-Game 4: Guess Who Said It (SCROLL-LOCKED)
- Shows a quote/sentence on screen
- Two buttons: one is `<name>` (her), one is a famous person
- The famous person changes per question (Eminem, Trump, etc.)
- Placeholders: `<quote 1>` with `<person 1>`, `<quote 2>` with `<person 2>`, etc.
- She taps to guess who said it
- Immediate feedback: green for correct, red for wrong
- Score displayed at the end with a playful message
- Section unlocks after all questions answered

### 8. Final Letter
- Beautiful, elegant section
- A personal letter from you to her
- Placeholder: `<final letter>`
- Fancy script font for the header, clean body text
- Paragraphs fade in as she scrolls
- Subtle sparkle/shimmer effect in the background

### 9. Confetti Finale
- "Thank you for your time, Happy Birthday!" in big gold text
- Confetti explosion in pink, blue, and gold
- Confetti gently rains down for a few seconds
- Floating hearts in the background

---

## Design System

### Visual Style (changes per section)
| Section | Style | Vibe |
|---------|-------|------|
| Landing + Letter | Elegant/Romantic | Script fonts, shimmer, soft and classy |
| Games | Claymorphism | Bubbly, soft 3D, rounded, playful |
| Celebrations | Neubrutalism accents | Bold borders, hard shadows, punchy |

### Color Palette: Soft Pink + Cream + Blue
| What | Color | Hex Code |
|------|-------|----------|
| Primary | Soft Pink | `#F472B6` |
| Secondary | Light Pink | `#FBCFE8` |
| Accent | Soft Blue | `#60A5FA` |
| Background | Warm Cream | `#FFF8F0` |
| Cards | White | `#FFFFFF` |
| Main Text | Deep Plum | `#4A2040` |
| Secondary Text | Muted Plum | `#8B6C82` |
| Borders | Pink Tint | `#FFE4F0` |
| Highlights | Light Blue | `#BFDBFE` |
| Success | Soft Green | `#86EFAC` |
| Gold (celebrations) | Gold | `#F59E0B` |

### Fonts
- **Headings**: Fredoka (rounded, playful, friendly)
- **Body text**: Nunito (clean, warm, readable)
- **Letter accents**: Great Vibes (elegant script, used sparingly)
- All loaded from Google Fonts

### CSS Style Classes
- `.clay` - Soft 3D card: multi-layer shadows, rounded corners (20px), pink-tinted glow
- `.neubrutalism` - Bold: 3px border, 4px offset hard shadow, tight corners (8px)

---

## Music System

- Toggle button fixed in bottom-right corner
- Starts MUTED - she taps to unmute
- Music changes based on which section she's in:
  - **Landing + Welcome**: Track 1 (soft, romantic)
  - **Timeline + Memory**: Track 2 (playful, upbeat)
  - **Balloons + Quiz**: Track 2 continues
  - **Letter + Finale**: Track 3 (emotional, grand)
- Smooth crossfade between tracks (1 second)
- Audio files go in `assets/audio/`

---

## Tech Stack

- **Vanilla HTML + CSS + JavaScript** (no React, no build tools)
- **Canvas API** for the balloon game and confetti only
- **GitHub Pages** for free hosting
- Phone-first design (375px base width)

---

## File Structure

```
/
├── index.html              <- The entire site (all sections)
├── css/
│   ├── base.css            <- Colors, fonts, reset, utilities
│   ├── layout.css          <- Section layout, scroll behavior
│   ├── components.css      <- Buttons, cards, overlays
│   ├── landing.css         <- Opening page + floating shapes
│   ├── timeline.css        <- Photo timeline game
│   ├── memory.css          <- Memory card game
│   ├── balloons.css        <- Balloon pop game
│   ├── quiz.css            <- Guess who quiz
│   └── finale.css          <- Letter + confetti + finale
├── js/
│   ├── main.js             <- Scroll controller, section manager
│   ├── music.js            <- Audio controller + toggle
│   ├── landing.js          <- Opening page logic
│   ├── timeline.js         <- Photo scroll logic
│   ├── memory.js           <- Card flip game
│   ├── balloons.js         <- Balloon canvas game
│   ├── quiz.js             <- Quote quiz
│   └── confetti.js         <- Confetti particles
├── assets/
│   ├── images/             <- YOUR photos and card images go here
│   └── audio/              <- YOUR music tracks go here
└── .nojekyll               <- Tells GitHub Pages not to use Jekyll
```

---

## How Scroll Locking Works

Each game section blocks scrolling until the game is completed:

1. When a game section scrolls into view (80% visible), the page locks scrolling
2. The game becomes active - all touch/scroll input goes to the game
3. When the game is completed, it calls `sectionManager.unlock()`
4. A transition message appears
5. Scrolling resumes and the page auto-scrolls to the next section

Technical approach: toggling `overflow: hidden` on `<main>` (most reliable method across all phones including iOS Safari).

---

## Build Order (step by step, one at a time)

| Step | What We Build | Files |
|------|---------------|-------|
| 1 | Project setup + HTML skeleton + CSS foundation + fonts | `index.html`, `css/base.css`, `css/layout.css`, `css/components.css` |
| 2 | Landing page (card, button, floating shapes, animations) | `css/landing.css`, `js/landing.js` |
| 3 | Scroll controller + section manager + fade transition | `js/main.js` |
| 4 | Welcome section + bouncing scroll arrow | HTML + CSS |
| 5 | Photo Timeline game | `js/timeline.js`, `css/timeline.css` |
| 6 | Memory Card game | `js/memory.js`, `css/memory.css` |
| 7 | Balloon Pop game | `js/balloons.js`, `css/balloons.css` |
| 8 | Guess Who Said It quiz | `js/quiz.js`, `css/quiz.css` |
| 9 | Final letter section | `css/finale.css` |
| 10 | Confetti finale | `js/confetti.js` |
| 11 | Music system | `js/music.js` |
| 12 | Polish + mobile testing | Everything |
| 13 | GitHub Pages deploy | Git |

---

## Placeholder Reference (what you'll replace with real content)

| Placeholder | Where | What to put |
|-------------|-------|-------------|
| `<name>` | Throughout | Her name |
| `<small letter>` | Landing page | Short opening letter |
| `<photo N>` | Timeline | Image file paths |
| `<caption N>` | Timeline | Photo captions |
| `<card image N>` | Memory game | Image file paths (need 12 unique images) |
| `<sentence N>` | Balloon game | Cute sentences (one per balloon) |
| `<quote N>` | Quiz | Quotes/sentences for the quiz |
| `<person N>` | Quiz | Famous person name (Eminem, Trump, etc.) |
| `<final letter>` | Letter section | Your personal letter to her |

---

## Mobile Considerations

- Designed for phones (375px width base)
- Uses `100dvh` for proper fullscreen on mobile (handles address bar)
- All tap targets are at least 44x44px
- No double-tap zoom on game areas
- Retina-ready canvas rendering
- Animations are GPU-optimized (transform + opacity only)
- Respects "reduced motion" system setting
- Works on iPhone Safari (the most restrictive browser)

---

## Hosting (GitHub Pages)

1. Push the project to a GitHub repository
2. Go to repo Settings > Pages > Deploy from branch (main)
3. She gets a link like: `yourusername.github.io/repo-name`
4. Free, instant, works on any phone
