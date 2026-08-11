/**
 * composition.js — Dynamic ingredient composition renderer.
 * Layers transparent ingredient PNGs into a picnic still-life arrangement.
 * Used for both on-screen preview and PNG export.
 */

// ─── Asset URL helper ─────────────────────────────────────────────────────────

export function assetUrl(relativePath) {
  return new URL(`assets/${relativePath}`, document.baseURI).href;
}

// ─── Ingredient ID to file path mapping ───────────────────────────────────────

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

// Deterministic rotations per ingredient (subtle, tasteful)
const ROTATIONS = {
  watermelon: -4,
  strawberry: 5,
  cherry: -3,
  grape: 4,
  grapes: 4,
  blueberry: -5,
  lemonade: 2,
  peach: -3,
  cupcake: 3,
  cheese: -4,
  honey: 2,
  mint: 5,
  sandwich: -2,
};

// ─── Image loading ────────────────────────────────────────────────────────────

export async function loadImage(src) {
  const image = new Image();
  image.src = src;
  if (image.decode) {
    await image.decode();
  } else {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });
  }
  return image;
}

// ─── Layout calculation ───────────────────────────────────────────────────────

/**
 * Returns an array of { x, y, width, height, rotation } for each ingredient.
 * Positions form a natural picnic still-life arrangement.
 */
export function getIngredientLayout(ids, canvasWidth, canvasHeight) {
  const count = ids.length;
  const area = { x: canvasWidth * 0.1, y: canvasHeight * 0.15, w: canvasWidth * 0.8, h: canvasHeight * 0.65 };

  if (count === 0) return [];

  const layouts = [];

  if (count === 1) {
    const size = Math.min(area.w * 0.55, area.h * 0.7);
    layouts.push({
      x: area.x + area.w / 2 - size / 2,
      y: area.y + area.h / 2 - size / 2,
      width: size, height: size,
      rotation: ROTATIONS[ids[0]] || 0,
    });
  } else if (count === 2) {
    const size = Math.min(area.w * 0.42, area.h * 0.6);
    const gap = size * 0.15;
    layouts.push(
      { x: area.x + area.w / 2 - size - gap / 2, y: area.y + area.h / 2 - size / 2, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: area.x + area.w / 2 + gap / 2, y: area.y + area.h / 2 - size / 2 + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
    );
  } else if (count === 3) {
    const size = Math.min(area.w * 0.36, area.h * 0.48);
    const cx = area.x + area.w / 2;
    const cy = area.y + area.h / 2;
    layouts.push(
      { x: cx - size / 2, y: cy - size * 0.65, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx - size * 0.85, y: cy + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx + size * 0.05, y: cy + size * 0.1, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
    );
  } else if (count === 4) {
    const size = Math.min(area.w * 0.34, area.h * 0.44);
    const gapX = size * 0.12;
    const gapY = size * 0.1;
    const cx = area.x + area.w / 2;
    const cy = area.y + area.h / 2;
    layouts.push(
      { x: cx - size - gapX / 2, y: cy - size - gapY / 2, width: size, height: size, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx + gapX / 2, y: cy - size - gapY / 2 + size * 0.08, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx - size - gapX / 2 + size * 0.05, y: cy + gapY / 2, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
      { x: cx + gapX / 2, y: cy + gapY / 2 + size * 0.05, width: size, height: size, rotation: ROTATIONS[ids[3]] || 0 },
    );
  } else if (count === 5) {
    const size = Math.min(area.w * 0.3, area.h * 0.38);
    const cx = area.x + area.w / 2;
    const cy = area.y + area.h / 2;
    // Center one large, four around
    layouts.push(
      { x: cx - size * 0.55, y: cy - size * 0.55, width: size * 1.1, height: size * 1.1, rotation: ROTATIONS[ids[0]] || 0 },
      { x: cx - size * 1.3, y: cy - size * 0.9, width: size, height: size, rotation: ROTATIONS[ids[1]] || 0 },
      { x: cx + size * 0.4, y: cy - size * 0.85, width: size, height: size, rotation: ROTATIONS[ids[2]] || 0 },
      { x: cx - size * 1.2, y: cy + size * 0.3, width: size, height: size, rotation: ROTATIONS[ids[3]] || 0 },
      { x: cx + size * 0.35, y: cy + size * 0.35, width: size, height: size, rotation: ROTATIONS[ids[4]] || 0 },
    );
  } else {
    // 6 items: 3×2
    const size = Math.min(area.w * 0.28, area.h * 0.38);
    const gapX = size * 0.08;
    const gapY = size * 0.06;
    const startX = area.x + (area.w - size * 3 - gapX * 2) / 2;
    const startY = area.y + (area.h - size * 2 - gapY) / 2;
    for (let i = 0; i < Math.min(count, 6); i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      layouts.push({
        x: startX + col * (size + gapX) + (row % 2 === 1 ? size * 0.1 : 0),
        y: startY + row * (size + gapY) + (col % 2 === 1 ? size * 0.05 : 0),
        width: size, height: size,
        rotation: ROTATIONS[ids[i]] || 0,
      });
    }
  }

  return layouts;
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function drawImageContained(ctx, image, box, rotation = 0) {
  const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;

  ctx.save();
  ctx.translate(box.x + box.width / 2, box.y + box.height / 2);
  if (rotation) ctx.rotate((rotation * Math.PI) / 180);

  // Subtle warm shadow
  ctx.shadowColor = 'rgba(80, 60, 40, 0.12)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 4;

  ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();
}

/**
 * Render ingredient composition to a canvas context.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string[]} ingredientIds
 * @param {{ width: number, height: number, isNight?: boolean }} options
 */
export async function renderIngredientComposition(ctx, ingredientIds, options = {}) {
  const { width, height } = options;
  if (!ingredientIds.length) return;

  // Load all ingredient images
  const images = await Promise.all(
    ingredientIds.map(async id => {
      const file = INGREDIENT_FILES[id];
      if (!file) { console.error('Missing Picnic Symphony asset mapping:', id); return null; }
      try {
        const img = await loadImage(assetUrl(file));
        return { id, image: img };
      } catch (e) {
        console.error('Missing Picnic Symphony asset:', assetUrl(file));
        return null;
      }
    })
  );

  const validImages = images.filter(Boolean);
  const layout = getIngredientLayout(ingredientIds, width, height);

  // Draw each ingredient
  validImages.forEach((item, i) => {
    if (!layout[i]) return;
    drawImageContained(ctx, item.image, layout[i], layout[i].rotation);
  });
}

/**
 * Full export render: background, plate, ingredients, text, signature.
 */
export async function renderFullComposition(canvas, ingredientIds, options = {}) {
  const { isNight = false, title = '', spiritName = '', recipeName = '' } = options;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  if (isNight) { bg.addColorStop(0, '#26324A'); bg.addColorStop(1, '#1a2a3a'); }
  else { bg.addColorStop(0, '#FFF8E8'); bg.addColorStop(1, '#f0eed8'); }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Soft decorative border
  ctx.strokeStyle = isNight ? 'rgba(154,142,184,0.25)' : 'rgba(127,163,107,0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 5]);
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.setLineDash([]);

  // Soft picnic plate/cloth ellipse
  const plateY = H * 0.52;
  ctx.save();
  ctx.fillStyle = isNight ? 'rgba(40, 55, 70, 0.3)' : 'rgba(245, 238, 220, 0.5)';
  ctx.beginPath();
  ctx.ellipse(W / 2, plateY, W * 0.32, H * 0.18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isNight ? 'rgba(154,142,184,0.15)' : 'rgba(169,190,145,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // Title
  ctx.fillStyle = isNight ? '#e8e4dc' : '#34423E';
  ctx.font = '600 36px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Picnic Symphony', W / 2, 56);

  // Composition name
  if (title) {
    ctx.font = '500 22px Nunito, sans-serif';
    ctx.fillStyle = isNight ? '#9A8EB8' : '#7FA36B';
    ctx.fillText(title, W / 2, 92);
  }

  // Render ingredient artwork
  await renderIngredientComposition(ctx, ingredientIds, { width: W, height: H });

  // Ingredient names at bottom
  ctx.textAlign = 'center';
  ctx.font = '500 15px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#a8b4a8' : '#5f6d5f';
  const nameStr = ingredientIds.map(id => {
    const cap = id.charAt(0).toUpperCase() + id.slice(1);
    return cap === 'Grape' ? 'Grapes' : cap;
  }).join(' · ');
  ctx.fillText(nameStr, W / 2, H - 60);

  // Spirit + recipe
  ctx.font = '400 13px Nunito, sans-serif';
  ctx.fillStyle = isNight ? '#596783' : '#A9BE91';
  const meta = [spiritName, recipeName].filter(Boolean).join(' · ');
  if (meta) ctx.fillText(meta, W / 2, H - 38);

  // Signature
  ctx.font = '400 11px Nunito, sans-serif';
  ctx.fillStyle = isNight ? 'rgba(89,103,131,0.6)' : 'rgba(169,190,145,0.6)';
  ctx.fillText('picnicsymphony.app', W / 2, H - 18);
}
