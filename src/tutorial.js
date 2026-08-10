/**
 * tutorial.js — Action-based onboarding with structured steps.
 * Steps advance on user interaction, not just Next clicks.
 * Uses tutorial-spirit.js for the viewport-level guide.
 */

import { state, setState, subscribe, SCREENS } from './state.js';
import { navigateTo } from './router.js';
import { t } from './i18n.js';
import { initTutorialSpirit, show as showSpirit, hide as hideSpirit, flyToTarget, setSpiritId } from './tutorial-spirit.js';

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'language',
    route: SCREENS.WELCOME,
    titleKey: 'tutorial.steps.language.title',
    bodyKey: 'tutorial.steps.language.body',
    getTarget: () => document.querySelector('[data-tutorial-id="language-menu"]'),
    actionRequired: true,
    completionEvent: 'lang-selected',
    showNext: false,
  },
  {
    id: 'theme',
    route: SCREENS.WELCOME,
    titleKey: 'tutorial.steps.theme.title',
    bodyKey: 'tutorial.steps.theme.body',
    getTarget: () => document.querySelector('.theme-toggle'),
    actionRequired: true,
    completionEvent: 'theme-selected',
    showNext: true,
    nextLabel: () => t('tutorial.keepLight'),
  },
  {
    id: 'spirit',
    route: SCREENS.SPIRITS,
    titleKey: 'tutorial.steps.spirit.title',
    bodyKey: 'tutorial.steps.spirit.body',
    getTarget: () => document.querySelector('.spirit-grid'),
    actionRequired: true,
    completionEvent: 'spirit-selected',
    showNext: false,
  },
  {
    id: 'mode',
    route: SCREENS.MODE_SELECT,
    titleKey: 'tutorial.steps.mode.title',
    bodyKey: 'tutorial.steps.mode.body',
    getTarget: () => document.querySelector('.mode-options'),
    actionRequired: true,
    completionEvent: 'mode-selected',
    showNext: false,
  },
  {
    id: 'ingredient',
    route: SCREENS.STUDIO,
    titleKey: 'tutorial.steps.ingredient.title',
    bodyKey: 'tutorial.steps.ingredient.body',
    getTarget: () => document.querySelector('[data-tutorial-id="ingredient-lemonade"]'),
    actionRequired: true,
    completionEvent: 'ingredient-added',
    showNext: false,
  },
  {
    id: 'transport',
    route: SCREENS.STUDIO,
    titleKey: 'tutorial.steps.transport.title',
    bodyKey: 'tutorial.steps.transport.body',
    getTarget: () => document.querySelector('[data-tutorial-id="play-pause"]'),
    actionRequired: false,
    showNext: true,
  },
  {
    id: 'recipes',
    route: SCREENS.STUDIO,
    titleKey: 'tutorial.steps.recipes.title',
    bodyKey: 'tutorial.steps.recipes.body',
    getTarget: () => document.querySelector('[data-tutorial-id="open-recipes"]'),
    actionRequired: false,
    showNext: true,
  },
  {
    id: 'ready',
    route: SCREENS.STUDIO,
    titleKey: 'tutorial.steps.ready.title',
    bodyKey: 'tutorial.steps.ready.body',
    getTarget: () => document.querySelector('[data-tutorial-id="play-pause"]'),
    actionRequired: false,
    showNext: true,
    nextLabel: () => t('tutorial.finish'),
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

let currentStep = 0;
let active = false;
let _unsubscribe = null;
let _langListener = null;
let _themeListener = null;

// ─── Public API ───────────────────────────────────────────────────────────────

function startTutorial() {
  initTutorialSpirit();
  currentStep = 0;
  active = true;
  showSpirit(state.spirit || 'bee');
  listenForCompletions();
  goToStep(0);
}

function finishTutorial() {
  active = false;
  cleanupListeners();
  hideSpirit();
  setState({ tutorialCompleted: true }, true);
  // Stay on current screen
}

function bindTutorial() {
  document.body.addEventListener('click', (e) => {
    if (!active) return;
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'tutorial-next') { e.stopPropagation(); nextStep(); }
    else if (action === 'tutorial-back') { e.stopPropagation(); prevStep(); }
    else if (action === 'tutorial-skip') { e.stopPropagation(); finishTutorial(); }
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && active) {
      e.preventDefault();
      finishTutorial();
    }
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function goToStep(idx) {
  if (idx < 0 || idx >= STEPS.length) { finishTutorial(); return; }
  currentStep = idx;
  const step = STEPS[currentStep];

  // Navigate to route
  if (state.screen !== step.route) {
    navigateTo(step.route, false);
  }

  // Wait for DOM to settle
  setTimeout(() => renderStep(), 150);
}

function renderStep() {
  if (!active) return;
  const step = STEPS[currentStep];
  const target = step.getTarget();
  if (!target) {
    // Target not found, try again briefly
    setTimeout(() => {
      if (!active) return;
      const t2 = step.getTarget();
      if (t2) doFlyToTarget(step, t2);
    }, 300);
    return;
  }
  doFlyToTarget(step, target);
}

function doFlyToTarget(step, target) {
  // Update spirit if one was selected
  if (state.spirit && currentStep > 2) {
    setSpiritId(state.spirit);
  }

  flyToTarget(target, {
    title: t(step.titleKey),
    body: t(step.bodyKey),
    stepNum: currentStep + 1,
    totalSteps: STEPS.length,
    showBack: currentStep > 0,
    showNext: step.showNext !== false,
    nextLabel: step.nextLabel ? step.nextLabel() : undefined,
  });
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

// ─── Completion listeners ─────────────────────────────────────────────────────

function listenForCompletions() {
  // Language selection auto-advance
  _langListener = () => {
    if (!active) return;
    const step = STEPS[currentStep];
    if (step.id === 'language') {
      setTimeout(() => nextStep(), 400);
    }
  };

  // Theme selection
  _themeListener = () => {
    if (!active) return;
    // Don't auto-advance theme — let user explore, they can click Next
  };

  // Spirit + mode + ingredient via state subscribe
  _unsubscribe = subscribe((s, key) => {
    if (!active) return;
    const step = STEPS[currentStep];

    if (step.id === 'spirit' && key === 'spirit' && s.spirit) {
      setSpiritId(s.spirit);
      setTimeout(() => nextStep(), 500);
    }
    if (step.id === 'mode' && key === 'mode' && s.mode) {
      setTimeout(() => nextStep(), 300);
    }
    if (step.id === 'ingredient' && key === 'screen') {
      // Ingredient was added — handled below
    }
  });

  // Watch for ingredient click specifically
  document.addEventListener('click', _ingredientClickHandler, true);

  // Watch for language change
  const langMenu = document.getElementById('lang-menu');
  if (langMenu) langMenu.addEventListener('click', _langListener);
}

function _ingredientClickHandler(e) {
  if (!active) return;
  const step = STEPS[currentStep];
  if (step.id !== 'ingredient') return;
  const btn = e.target.closest('.ingredient-btn');
  if (btn) {
    setTimeout(() => nextStep(), 400);
  }
}

function cleanupListeners() {
  if (_unsubscribe) { _unsubscribe(); _unsubscribe = null; }
  document.removeEventListener('click', _ingredientClickHandler, true);
  const langMenu = document.getElementById('lang-menu');
  if (langMenu && _langListener) langMenu.removeEventListener('click', _langListener);
}

export { startTutorial, finishTutorial, bindTutorial };
