/**
 * spirits.js — Spirit definitions and asset manifest.
 * PNG paths, fallback symbols, personality data.
 */

const spiritDefinitions = {
  bee: {
    id: 'bee',
    nameKey: 'spirit.bee.name',
    personalityKey: 'spirit.bee.personality',
    image: 'assets/spirits/bee-guide.png',
    fallbackSymbol: '🐝',
    fallbackColor: '#ffd54f',
    trailType: 'pollen', // golden dots + honey sparkles
    messages: {
      welcome: 'spirit.bee.welcome',
      idle: 'spirit.bee.idle',
      firstAdd: 'spirit.bee.firstAdd',
      threeActive: 'spirit.bee.threeActive',
      fullMix: 'spirit.bee.fullMix',
      cleared: 'spirit.bee.cleared',
      recipeStep: 'spirit.bee.recipeStep',
      recipeDone: 'spirit.bee.recipeDone',
    },
  },
  bird: {
    id: 'bird',
    nameKey: 'spirit.bird.name',
    personalityKey: 'spirit.bird.personality',
    image: 'assets/spirits/bird-guide.png',
    fallbackSymbol: '🐦',
    fallbackColor: '#ffcc80',
    trailType: 'feather', // soft feather strokes
    messages: {
      welcome: 'spirit.bird.welcome',
      idle: 'spirit.bird.idle',
      firstAdd: 'spirit.bird.firstAdd',
      threeActive: 'spirit.bird.threeActive',
      fullMix: 'spirit.bird.fullMix',
      cleared: 'spirit.bird.cleared',
      recipeStep: 'spirit.bird.recipeStep',
      recipeDone: 'spirit.bird.recipeDone',
    },
  },
  dragonfly: {
    id: 'dragonfly',
    nameKey: 'spirit.dragonfly.name',
    personalityKey: 'spirit.dragonfly.personality',
    image: 'assets/spirits/dragonfly-guide.png',
    fallbackSymbol: '🪻',
    fallbackColor: '#4dd0e1',
    trailType: 'ripple', // blue glints + water ripples
    messages: {
      welcome: 'spirit.dragonfly.welcome',
      idle: 'spirit.dragonfly.idle',
      firstAdd: 'spirit.dragonfly.firstAdd',
      threeActive: 'spirit.dragonfly.threeActive',
      fullMix: 'spirit.dragonfly.fullMix',
      cleared: 'spirit.dragonfly.cleared',
      recipeStep: 'spirit.dragonfly.recipeStep',
      recipeDone: 'spirit.dragonfly.recipeDone',
    },
  },
  butterfly: {
    id: 'butterfly',
    nameKey: 'spirit.butterfly.name',
    personalityKey: 'spirit.butterfly.personality',
    image: 'assets/spirits/butterfly-guide.png',
    fallbackSymbol: '🦋',
    fallbackColor: '#ce93d8',
    trailType: 'petal', // pastel petals + lavender sparkles
    messages: {
      welcome: 'spirit.butterfly.welcome',
      idle: 'spirit.butterfly.idle',
      firstAdd: 'spirit.butterfly.firstAdd',
      threeActive: 'spirit.butterfly.threeActive',
      fullMix: 'spirit.butterfly.fullMix',
      cleared: 'spirit.butterfly.cleared',
      recipeStep: 'spirit.butterfly.recipeStep',
      recipeDone: 'spirit.butterfly.recipeDone',
    },
  },
};

/**
 * Check if a spirit PNG exists. Returns a promise.
 * Used to decide between real image and fallback.
 */
function checkSpiritImage(spiritId) {
  const spirit = spiritDefinitions[spiritId];
  if (!spirit) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = spirit.image;
  });
}

/**
 * Create the spirit portrait element (img or fallback frame).
 */
function createSpiritPortrait(spiritId, size = 'medium') {
  const spirit = spiritDefinitions[spiritId];
  if (!spirit) return document.createElement('div');

  const container = document.createElement('div');
  container.className = `spirit-portrait spirit-portrait--${size}`;
  container.dataset.spirit = spiritId;

  // Try image first, fallback on error
  const img = document.createElement('img');
  img.src = spirit.image;
  img.alt = spiritId;
  img.className = 'spirit-portrait__img';
  img.loading = 'eager';

  img.onerror = () => {
    img.remove();
    const fallback = document.createElement('div');
    fallback.className = 'spirit-portrait__fallback';
    fallback.style.setProperty('--spirit-color', spirit.fallbackColor);
    fallback.innerHTML = `
      <span class="spirit-portrait__symbol">${spirit.fallbackSymbol}</span>
      <span class="spirit-portrait__frame-name" data-i18n="${spirit.nameKey}"></span>
    `;
    container.appendChild(fallback);
  };

  container.appendChild(img);
  return container;
}

export { spiritDefinitions, checkSpiritImage, createSpiritPortrait };
