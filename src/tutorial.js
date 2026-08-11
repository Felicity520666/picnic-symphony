/**
 * tutorial.js — Consolidated tutorial system.
 * Self-contained: creates its own DOM, manages positioning,
 * always shows buttons, and reads translations live from t().
 */

import { state, setState, subscribe, SCREENS } from './state.js';
import { navigateTo } from './router.js';
import { t } from './i18n.js';
import { spiritDefinitions } from './spirits.js';

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'language', route: SCREENS.WELCOME, titleKey: 'tutorial.steps.language.title', bodyKey: 'tutorial.steps.language.body', target: '[data-tutorial-id="language-menu"]' },
  { id: 'theme', route: SCREENS.WELCOME, titleKey: 'tutorial.steps.theme.title', bodyKey: 'tutorial.steps.theme.body', target: '.theme-toggle' },
  { id: 'spirit', route: SCREENS.SPIRITS, titleKey: 'tutorial.steps.spirit.title', bodyKey: 'tutorial.steps.spirit.body', target: '.spirit-grid' },
  { id: 'mode', route: SCREENS.MODE_SELECT, titleKey: 'tutorial.steps.mode.title', bodyKey: 'tutorial.steps.mode.body', target: '.mode-options' },
  { id: 'ingredients', route: SCREENS.STUDIO, titleKey: 'tutorial.steps.ingredient.title', bodyKey: 'tutorial.steps.ingredient.body', target: '.ingredient-grid' },
  { id: 'transport', route: SCREENS.STUDIO, titleKey: 'tutorial.steps.transport.title', bodyKey: 'tutorial.steps.transport.body', target: '[data-tutorial-id="play-pause"]' },
  { id: 'recipes', route: SCREENS.STUDIO, titleKey: 'tutorial.steps.recipes.title', bodyKey: 'tutorial.steps.recipes.body', target: '[data-tutorial-id="open-recipes"]' },
  { id: 'finish', route: SCREENS.STUDIO, titleKey: 'tutorial.steps.ready.title', bodyKey: 'tutorial.steps.ready.body', target: '[data-tutorial-id="finish"]' },
];

// ─── State ────────────────────────────────────────────────────────────────────

let currentStep = 0;
let active = false;
let rootEl = null;
let overlayEl = null;
let cardEl = null;
let highlightedEl = null;

// ─── DOM creation ─────────────────────────────────────────────────────────────

function ensureDOM() {
  if (rootEl) return;

  // Overlay
  overlayEl = document.createElement('div');
  overlayEl.className = 'tut-overlay';
  document.body.appendChild(overlayEl);

  // Root container
  rootEl = document.createElement('div');
  rootEl.className = 'tut-root';
  rootEl.setAttribute('role', 'dialog');
  rootEl.setAttribute('aria-label', 'Tutorial');
  rootEl.setAttribute('aria-live', 'polite');
  document.body.appendChild(rootEl);

  // Card
  cardEl = document.createElement('div');
  cardEl.className = 'tut-card';
  rootEl.appendChild(cardEl);

  // Event delegation — always works even after innerHTML changes
  rootEl.addEventListener('click', (e) => {
    const actionEl = e.target.closest('[data-tutorial-action]');
    if (!actionEl) return;
    e.stopPropagation();
    const action = actionEl.dataset.tutorialAction;
    if (action === 'next') nextStep();
    else if (action === 'back') prevStep();
    else if (action === 'skip') finishTutorial();
    else if (action === 'done') finishTutorial();
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

function startTutorial() {
  ensureDOM();
  currentStep = 0;
  active = true;
  overlayEl.classList.add('is-active');
  rootEl.style.display = 'block';
  goToStep(0);
}

function finishTutorial() {
  active = false;
  unhighlight();
  if (overlayEl) overlayEl.classList.remove('is-active');
  if (rootEl) rootEl.style.display = 'none';
  setState({ tutorialCompleted: true }, true);
}

function bindTutorial() {
  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && active) {
      e.preventDefault();
      finishTutorial();
    }
  });

  // Re-render when language changes so bubble updates live
  subscribe((s, key) => {
    if (key === 'lang' && active) {
      renderCard();
    }
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function goToStep(idx) {
  currentStep = Math.max(0, Math.min(idx, STEPS.length - 1));
  const step = STEPS[currentStep];

  // Navigate to the required screen
  if (state.screen !== step.route) {
    navigateTo(step.route, false);
  }

  // Wait for screen to render, then highlight and show card
  setTimeout(() => {
    highlightTarget();
    renderCard();
  }, 180);
}

function nextStep() {
  if (currentStep < STEPS.length - 1) {
    goToStep(currentStep + 1);
  } else {
    finishTutorial();
  }
}

function prevStep() {
  if (currentStep > 0) {
    goToStep(currentStep - 1);
  }
}

// ─── Highlight ────────────────────────────────────────────────────────────────

function highlightTarget() {
  unhighlight();
  const step = STEPS[currentStep];
  const el = document.querySelector(step.target);
  if (el) {
    el.setAttribute('data-tutorial-highlighted', 'true');
    highlightedEl = el;
  }
}

function unhighlight() {
  if (highlightedEl) {
    highlightedEl.removeAttribute('data-tutorial-highlighted');
    highlightedEl = null;
  }
}

// ─── Render card ──────────────────────────────────────────────────────────────

function renderCard() {
  if (!cardEl || !active) return;
  const step = STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;
  const total = STEPS.length;

  // Progress dots
  let dots = '';
  for (let i = 0; i < total; i++) {
    const cls = i === currentStep ? 'tut-dot is-active' : i < currentStep ? 'tut-dot is-done' : 'tut-dot';
    dots += `<span class="${cls}"></span>`;
  }

  cardEl.innerHTML = `
    <div class="tut-card__progress">
      ${dots}
      <span class="tut-card__step-num">${t('tutorial.step', { current: currentStep + 1, total })}</span>
    </div>
    <h3 class="tut-card__title">${t(step.titleKey)}</h3>
    <p class="tut-card__body">${t(step.bodyKey)}</p>
    <div class="tut-card__actions">
      ${!isLast ? `<button class="tut-action tut-action--skip" data-tutorial-action="skip">${t('tutorial.skip')}</button>` : ''}
      <div class="tut-card__right">
        ${!isFirst ? `<button class="tut-action tut-action--back" data-tutorial-action="back">${t('tutorial.back')}</button>` : ''}
        <button class="tut-action tut-action--primary" data-tutorial-action="${isLast ? 'done' : 'next'}">
          ${isLast ? t('tutorial.finish') : t('tutorial.next')}
        </button>
      </div>
    </div>
  `;

  // Position card near the target if visible
  positionCard();
}

function positionCard() {
  if (!cardEl) return;
  const step = STEPS[currentStep];
  const target = document.querySelector(step.target);

  if (!target || target.offsetParent === null) {
    // Center the card
    cardEl.style.position = 'fixed';
    cardEl.style.top = '50%';
    cardEl.style.left = '50%';
    cardEl.style.transform = 'translate(-50%, -50%)';
    return;
  }

  const rect = target.getBoundingClientRect();
  const cardWidth = Math.min(420, window.innerWidth - 32);
  const margin = 16;

  // Try below target first
  let top = rect.bottom + margin;
  let left = rect.left + rect.width / 2 - cardWidth / 2;

  // If not enough room below, try above
  if (top + 200 > window.innerHeight) {
    top = rect.top - margin - 200;
  }

  // Clamp
  top = Math.max(margin, Math.min(window.innerHeight - 220, top));
  left = Math.max(margin, Math.min(window.innerWidth - cardWidth - margin, left));

  cardEl.style.position = 'fixed';
  cardEl.style.top = `${top}px`;
  cardEl.style.left = `${left}px`;
  cardEl.style.transform = '';
  cardEl.style.width = `${cardWidth}px`;
}

export { startTutorial, finishTutorial, bindTutorial };
