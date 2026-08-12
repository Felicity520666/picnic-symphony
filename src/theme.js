/**
 * theme.js — Theme logic with Auto/Day/Night user options.
 * Auto mode uses local time to select dawn/day/dusk/night internally.
 * Manual Day and Night always use those specific themes.
 * Dawn and Dusk are internal auto-only scenes, not user-selectable.
 */

import { state, setState } from './state.js';

// ─── Auto time ranges (configurable in one place) ────────────────────────────
const TIME_RANGES = [
  { start: 5,  end: 8,  theme: 'dawn' },
  { start: 8,  end: 17, theme: 'day' },
  { start: 17, end: 20, theme: 'dusk' },
  // 20–5 = night (default fallback)
];

function getAutoTheme() {
  const hour = new Date().getHours();
  for (const range of TIME_RANGES) {
    if (hour >= range.start && hour < range.end) return range.theme;
  }
  return 'night';
}

/** Determine effective theme (resolves 'auto' to an internal theme) */
function getEffectiveTheme() {
  if (state.theme === 'day') return 'day';
  if (state.theme === 'night') return 'night';
  // Auto mode — use time-based selection
  return getAutoTheme();
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
    if (state.theme === 'auto') applyTheme();
  }, 60000);
}

export { getEffectiveTheme, applyTheme, setTheme, initTheme };
