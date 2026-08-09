/**
 * router.js — Lightweight screen router using CSS class toggling.
 * No page reloads. Audio state survives navigation.
 */

import { state, setState, SCREENS } from './state.js';

const TRANSITION_MS = 500;

let screenElements = {};

/** Initialize router: cache screen elements */
function initRouter() {
  screenElements = {};
  for (const key of Object.values(SCREENS)) {
    const el = document.querySelector(`[data-screen="${key}"]`);
    if (el) screenElements[key] = el;
  }
  // Show initial screen
  showScreen(state.screen, false);
}

/** Navigate to a screen with optional animated transition */
function navigateTo(screen, animated = true) {
  if (screen === state.screen) return;
  const prev = state.screen;
  setState({ previousScreen: prev, screen });

  if (animated) {
    transitionScreens(prev, screen);
  } else {
    showScreen(screen, false);
  }

  // Update hash for browser back (non-essential screens)
  if (screen !== SCREENS.WELCOME) {
    history.replaceState(null, '', `#${screen}`);
  } else {
    history.replaceState(null, '', location.pathname);
  }
}

function showScreen(target, animated) {
  for (const [key, el] of Object.entries(screenElements)) {
    if (key === target) {
      el.hidden = false;
      el.classList.remove('screen--leaving');
      if (animated) {
        el.classList.add('screen--entering');
        setTimeout(() => el.classList.remove('screen--entering'), TRANSITION_MS);
      }
    } else {
      el.hidden = true;
      el.classList.remove('screen--entering', 'screen--leaving');
    }
  }
}

function transitionScreens(from, to) {
  const fromEl = screenElements[from];
  const toEl = screenElements[to];

  if (fromEl) {
    fromEl.classList.add('screen--leaving');
    setTimeout(() => {
      fromEl.hidden = true;
      fromEl.classList.remove('screen--leaving');
    }, TRANSITION_MS);
  }

  if (toEl) {
    // Small delay so leaving animation starts first
    setTimeout(() => {
      toEl.hidden = false;
      toEl.classList.add('screen--entering');
      setTimeout(() => toEl.classList.remove('screen--entering'), TRANSITION_MS);
    }, 200);
  }
}

/** Check hash on load for deep-linking */
function checkInitialHash() {
  const hash = location.hash.replace('#', '');
  if (hash && Object.values(SCREENS).includes(hash)) {
    // Only allow returning to studio if spirit is selected
    if (hash === SCREENS.STUDIO && !state.spirit) return;
    setState({ screen: hash });
  }
}

export { initRouter, navigateTo, checkInitialHash };
