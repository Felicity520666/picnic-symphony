/**
 * theme.js — Dawn/Day/Dusk/Night mode logic.
 * Auto mode uses local time. Manual override persisted.
 */

import { state, setState, THEMES } from './state.js';

/** Determine effective theme (resolves 'auto') */
function getEffectiveTheme() {
  if (state.theme === 'dawn') return 'dawn';
  if (state.theme === 'day' || state.theme === THEMES.DAY) return 'day';
  if (state.theme === 'dusk') return 'dusk';
  if (state.theme === 'night' || state.theme === THEMES.NIGHT) return 'night';

  // Auto: dawn 5:00–7:59, day 8:00–16:59, dusk 17:00–19:59, night 20:00–4:59
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}

/** Apply theme to document */
function applyTheme() {
  const effective = getEffectiveTheme();
  document.documentElement.dataset.theme = effective;
}

/** Set theme preference and apply */
function setTheme(theme) {
  setState({ theme }, true);
  applyTheme();
}

/** Initialize: apply on load, recheck every minute for auto */
function initTheme() {
  applyTheme();
  setInterval(() => {
    if (state.theme === THEMES.AUTO || state.theme === 'auto') applyTheme();
  }, 60000);
}

export { getEffectiveTheme, applyTheme, setTheme, initTheme };
