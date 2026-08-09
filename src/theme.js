/**
 * theme.js — Day/night mode logic.
 * Auto mode uses local time. Manual override persisted.
 */

import { state, setState, THEMES } from './state.js';

/** Determine effective theme (resolves 'auto') */
function getEffectiveTheme() {
  if (state.theme === THEMES.DAY) return 'day';
  if (state.theme === THEMES.NIGHT) return 'night';

  // Auto: day 7:00–18:59, night 19:00–6:59
  const hour = new Date().getHours();
  return (hour >= 7 && hour < 19) ? 'day' : 'night';
}

/** Apply theme to document */
function applyTheme() {
  const effective = getEffectiveTheme();
  document.documentElement.dataset.theme = effective;
  document.documentElement.classList.toggle('theme-day', effective === 'day');
  document.documentElement.classList.toggle('theme-night', effective === 'night');
}

/** Set theme preference and apply */
function setTheme(theme) {
  setState({ theme }, true);
  applyTheme();
}

/** Initialize: apply on load, recheck every minute for auto */
function initTheme() {
  applyTheme();
  // Recheck every 60s for auto mode transitions
  setInterval(() => {
    if (state.theme === THEMES.AUTO) applyTheme();
  }, 60000);
}

export { getEffectiveTheme, applyTheme, setTheme, initTheme };
