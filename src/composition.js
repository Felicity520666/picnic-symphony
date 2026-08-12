/**
 * composition.js — Postcard renderer with basket and alpha-cropped ingredients.
 * Shared between preview and download.
 */

// ─── Asset URL helper ─────────────────────────────────────────────────────────

export function assetUrl(relativePath) {
  return new URL(`assets/${relativePath}`, document.baseURI).href;
}

// ─── Ingredient file mapping ──────────────────────────────────────────────────

const INGREDIENT_FILES = {
  watermelon: 'ingredients/watermelon.png',
  strawberry: 'ingredients/strawberry.png',
  cherry: 'ingredients/cherry.png',
  grape: 'ingredients/grapes.png',
  grapes: 'ingredients/grapes.png',
  blueberry: 'ingredients/blueberry.png',
  lemonade: 'ingredients/lemonade.png',
  peach: 'ingredients/peach.png',
  cupcake: 'ingredients/cupcake.png',
  cheese: 'ingredients/cheese.png',
  honey: 'ingredients/honey.png',
  mint: 'ingredients/mint.png',
  sandwich: 'ingredients/sandwich.png',
};

const ROTATIONS = {
  watermelon: -3, strawberry: 4, cherry: -2, grape: 3, grapes: 3,
  blueberry: -4, lemonade: 2, peach: -3, cupcake: 3, cheese: -3,
  honey: 2, mint: 4, sandwich: -2,
};

// ─── Image loading ────────────────────────────────────────────────────────────

export async function loadImage(src) {
  const img = new Image();
  img.src = src;
  if (img.decode) await img.decode();
  else await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
  return img;
}

// ─── Alpha bounds cache ───────────────────────────────────────────────────────

const _boundsCache = new Map();

function getAlphaBounds(image) {
  if (_boundsCache.has(image.src)) return _boundsCache.get(image.src);

  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true });
  c.width = image.naturalWidth;
  c.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  let minX = width, minY = height, maxX = -1, maxY = -1;

  // Sample every 2nd pixel for speed
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 15) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const bounds = (maxX < minX)
    ? { x: 0, y: 0, w: width, h: height }
    : { x: minX, y: minY, w: maxX - minX + 2, h: maxY - minY + 2 };

  _boundsCache.set(image.src, bounds);
  return bounds;
}

// ─── Layout positions (normalized within basket interior) ─────────────────────

const POSITIONS = {
  1: [[0.50, 0.48]],
  2: [[0.33, 0.48], [0.67, 0.48]],
  3: [[0.30, 0.35], [0.70, 0.35], [0.50, 0.65]],
  4: [[0.30, 0.32], [0.70, 0.32], [0.30, 0.65], [0.70, 0.65]],
  5: [[0.22, 0.32], [0.50, 0.27], [0.78, 0.32], [0.35, 0.64], [0.65, 0.64]],
  6: [[0.20, 0.30], [0.50, 0.26], [0.80, 0.30], [0.20, 0.63], [0.50, 0.67], [0.80, 0.63]],
};

// Visible size as fraction of basket interior width
const VIS_SIZE = { 1: 0.46, 2: 0.36, 3: 0.31, 4: 0.28, 5: 0.25, 6: 0.22 };

// ─── Drawing ──────────────────────────────────────────────────────────────────

function drawCroppedIngredient(ctx, image, box, rotation = 0) {
  const bounds = getAlphaBounds(image);

  // Scale the visible portion to fill the box
  const aspect = bounds.w / bounds.h;
  let drawW, drawH;
  if (aspect > 1) {
    drawW = box.width;
    drawH = box.width / aspect;
  } else {
    drawH = box.height;
    drawW = box.height * aspect;
  }

  ctx.save();
  ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);

  ctx.shadowColor = 'rgba(60, 45, 30, 0.12)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  // Draw only the visible (alpha-cropped) region, scaled to fill the box
  ctx.drawImage(
    image,
    bounds.x, bounds.y, bounds.w, bounds.h,
    -drawW / 2, -drawH / 2, drawW, drawH
  );
  ctx.restore();
}

// ─── Full postcard render ─────────────────────────────────────────────────────

export async function renderFullComposition(canvas, ingredientIds, options = {}) {
  const { isNight = false, title = '', spiritName = '', ingredientNames = '' } = options;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  if (isNight) { bg.addColorStop(0, '#26324A'); bg.addColorStop(1, '#1c2e3e'); }
  else { bg.addColorStop(0, '#FFF8E8'); bg.addColorStop(1, '#f5f0dc'); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Border
  ctx.strokeStyle = isNight ? 'rgba(154,142,184,0.18)' : 'rgba(127,163,107,0.18)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(30, 30, W - 60, H - 60);
  ctx.setLineDash([]);

  // Brand (small top)
  ctx.textAlign = 'center';
  ctx.font = `700 ${Math.round(W * 0.013)}px Nunito, sans-serif`;
  ctx.fillStyle = isNight ? 'rgba(200,195,180,0.45)' : 'rgba(90,110,80,0.45)';
  ctx.fillText('PICNIC SYMPHONY', W / 2, H * 0.055);

  // Main title (large)
  if (title) {
    ctx.fillStyle = isNight ? '#e8e4dc' : '#2e3d2e';
    ctx.font = `700 ${Math.round(W * 0.036)}px Nunito, sans-serif`;
    ctx.fillText(title, W / 2, H * 0.11);
  }

  // Spirit badge
  if (spiritName) {
    ctx.font = `500 ${Math.round(W * 0.014)}px Nunito, sans-serif`;
    ctx.fillStyle = isNight ? 'rgba(154,142,184,0.6)' : 'rgba(100,130,90,0.65)';
    ctx.fillText(spiritName, W / 2, H * 0.145);
  }

  // Load basket
  let basketImg;
  try { basketImg = await loadImage(assetUrl('postcard/picnic-basket.png')); }
  catch (e) { console.error('Basket load failed'); }

  // Basket: 68% of postcard width, centered
  const basketW = W * 0.68;
  const basketH = basketImg ? basketW * (basketImg.naturalHeight / basketImg.naturalWidth) : basketW * 0.7;
  const basketX = (W - basketW) / 2;
  const basketY = H * 0.17;
  const bBox = { x: basketX, y: basketY, w: basketW, h: basketH };

  // Draw basket
  if (basketImg) ctx.drawImage(basketImg, basketX, basketY, basketW, basketH);

  // Interior region for ingredients
  const interior = {
    x: bBox.x + bBox.w * 0.15,
    y: bBox.y + bBox.h * 0.22,
    w: bBox.w * 0.70,
    h: bBox.h * 0.50,
  };

  // Load + draw ingredients
  if (ingredientIds.length > 0) {
    const count = Math.min(ingredientIds.length, 6);
    const sizeRatio = VIS_SIZE[count] || 0.22;
    const itemSize = interior.w * sizeRatio;
    const positions = POSITIONS[count] || POSITIONS[6];

    const imgs = await Promise.all(ingredientIds.slice(0, 6).map(async id => {
      const file = INGREDIENT_FILES[id];
      if (!file) return null;
      try { return { id, image: await loadImage(assetUrl(file)) }; }
      catch (e) { return null; }
    }));

    imgs.filter(Boolean).forEach((item, i) => {
      const [px, py] = positions[i] || [0.5, 0.5];
      const box = {
        x: interior.x + interior.w * px - itemSize / 2,
        y: interior.y + interior.h * py - itemSize / 2,
        width: itemSize,
        height: itemSize,
      };
      drawCroppedIngredient(ctx, item.image, box, ROTATIONS[item.id] || 0);
    });
  }

  // Front basket rim (only the very bottom 22% — gentle overlap, not cutting ingredients)
  if (basketImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(basketX, basketY + basketH * 0.78, basketW, basketH * 0.22);
    ctx.clip();
    ctx.drawImage(basketImg, basketX, basketY, basketW, basketH);
    ctx.restore();
  }

  // Ingredient line at bottom
  const namesText = ingredientNames || ingredientIds.map(id => {
    const c = id.charAt(0).toUpperCase() + id.slice(1);
    return c === 'Grape' ? 'Grapes' : c;
  }).join(' · ');

  ctx.textAlign = 'center';
  ctx.font = `600 ${Math.round(W * 0.016)}px Nunito, Noto Sans, sans-serif`;
  ctx.fillStyle = isNight ? '#b0bfb0' : '#4a5e4a';
  const lineY = basketY + basketH + H * 0.04;
  ctx.fillText(namesText, W / 2, Math.min(lineY, H - H * 0.03));
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function getBasketIngredientLayout(ids, basketBounds) {
  const count = Math.min(ids.length, 6);
  if (count === 0) return [];
  const interior = {
    x: basketBounds.x + basketBounds.w * 0.15,
    y: basketBounds.y + basketBounds.h * 0.22,
    w: basketBounds.w * 0.70,
    h: basketBounds.h * 0.50,
  };
  const sizeRatio = VIS_SIZE[count] || 0.22;
  const size = interior.w * sizeRatio;
  const positions = POSITIONS[count] || POSITIONS[6];
  return ids.slice(0, 6).map((id, i) => {
    const [px, py] = positions[i] || [0.5, 0.5];
    return {
      x: interior.x + interior.w * px - size / 2,
      y: interior.y + interior.h * py - size / 2,
      width: size, height: size,
      rotation: ROTATIONS[id] || 0,
    };
  });
}

export { getBasketIngredientLayout as getIngredientLayout };
export async function renderIngredientComposition(ctx, ids, opts) {
  const layout = getBasketIngredientLayout(ids, { x: 0, y: 0, w: opts.width, h: opts.height });
  const images = await Promise.all(ids.map(async id => {
    const file = INGREDIENT_FILES[id];
    if (!file) return null;
    try { return { id, image: await loadImage(assetUrl(file)) }; } catch (e) { return null; }
  }));
  images.filter(Boolean).forEach((item, i) => {
    if (layout[i]) drawCroppedIngredient(ctx, item.image, layout[i], layout[i].rotation);
  });
}
