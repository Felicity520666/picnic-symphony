/**
 * particles.js — Spirit-specific cursor trails.
 * Aurelia: pollen (golden specks), Lark: feather shapes,
 * Rill: water rings, Iris: petal flecks.
 * Disabled on touch/reduced-motion. Capped at 16 particles.
 */

import { state } from './state.js';

const MAX_PARTICLES = 16;
const THROTTLE_MS = 50;

let particles = [];
let container = null;
let lastEmit = 0;
let animId = null;
let enabled = false;

const TRAILS = {
  pollen: { colors: ['#F4D77D', '#e8c55a', '#f0dfa0'], size: [3, 6], life: 500, shape: 'circle' },
  feather: { colors: ['#E97B70', '#f0a090', '#d4a090'], size: [5, 10], life: 650, shape: 'feather' },
  ripple: { colors: ['#9CCDDD', '#7ab8cc', '#b8dde8'], size: [5, 12], life: 600, shape: 'ring' },
  petal: { colors: ['#9A8EB8', '#c4b8d8', '#b8a0d0'], size: [4, 8], life: 550, shape: 'petal' },
};

function initParticles() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9990;overflow:hidden;';
  container.setAttribute('aria-hidden', 'true');
  document.body.appendChild(container);
  enabled = true;

  document.addEventListener('mousemove', onMove, { passive: true });
  tick();
}

function onMove(e) {
  if (!enabled) return;
  const now = performance.now();
  if (now - lastEmit < THROTTLE_MS) return;
  lastEmit = now;
  emit(e.clientX, e.clientY);
}

function emit(x, y) {
  if (particles.length >= MAX_PARTICLES) return;
  const trail = getTrailConfig();
  const size = trail.size[0] + Math.random() * (trail.size[1] - trail.size[0]);
  const color = trail.colors[Math.floor(Math.random() * trail.colors.length)];

  const el = document.createElement('span');
  let style = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;opacity:0.7;pointer-events:none;`;

  if (trail.shape === 'circle') {
    style += `border-radius:50%;background:${color};`;
  } else if (trail.shape === 'ring') {
    style += `border-radius:50%;border:1px solid ${color};background:transparent;`;
  } else if (trail.shape === 'feather') {
    style += `border-radius:40% 60% 60% 40%;background:${color};transform:rotate(${Math.random()*40-20}deg);`;
  } else {
    style += `border-radius:50% 0 50% 50%;background:${color};transform:rotate(${Math.random()*360}deg);`;
  }

  el.style.cssText = style;
  container.appendChild(el);

  particles.push({
    el, life: trail.life, maxLife: trail.life,
    x, y, vx: (Math.random() - 0.5) * 0.8, vy: -0.4 - Math.random() * 0.6,
    shape: trail.shape,
  });
}

function getTrailConfig() {
  const map = { bee: 'pollen', bird: 'feather', dragonfly: 'ripple', butterfly: 'petal' };
  const type = map[state.spirit] || 'pollen';
  return TRAILS[type];
}

function tick() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= 16;
    if (p.life <= 0) { p.el.remove(); particles.splice(i, 1); continue; }
    const progress = 1 - p.life / p.maxLife;
    p.x += p.vx; p.y += p.vy;
    const scale = p.shape === 'ring' ? 1 + progress * 1.5 : 1 - progress * 0.4;
    const opacity = 0.7 * (1 - progress);
    p.el.style.left = `${p.x}px`;
    p.el.style.top = `${p.y}px`;
    p.el.style.opacity = opacity;
    p.el.style.transform = `translate(-50%,-50%) scale(${scale})`;
  }
  animId = requestAnimationFrame(tick);
}

function destroyParticles() {
  enabled = false;
  document.removeEventListener('mousemove', onMove);
  if (animId) cancelAnimationFrame(animId);
  if (container) container.remove();
  particles = [];
}

export { initParticles, destroyParticles };
