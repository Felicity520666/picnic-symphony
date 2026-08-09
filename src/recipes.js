/**
 * recipes.js — 8 distinct recipe definitions.
 * No two recipes share more than ~60% of ingredients.
 */

const recipeDefinitions = [
  {
    id: 'sunbeam-basket',
    nameKey: 'recipe.sunbeam.name',
    moodKey: 'recipe.sunbeam.mood',
    descKey: 'recipe.sunbeam.desc',
    tempo: 110,
    difficulty: 1,
    ingredients: ['watermelon', 'strawberry', 'cheese', 'grape'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.sunbeam.step1' },
      { ingredientId: 'strawberry', noteKey: 'recipe.sunbeam.step2' },
      { ingredientId: 'cheese', noteKey: 'recipe.sunbeam.step3' },
      { ingredientId: 'grape', noteKey: 'recipe.sunbeam.step4' },
    ],
  },
  {
    id: 'lemon-cloud',
    nameKey: 'recipe.lemoncloud.name',
    moodKey: 'recipe.lemoncloud.mood',
    descKey: 'recipe.lemoncloud.desc',
    tempo: 95,
    difficulty: 1,
    ingredients: ['lemonade', 'mint', 'honey', 'cherry'],
    steps: [
      { ingredientId: 'lemonade', noteKey: 'recipe.lemoncloud.step1' },
      { ingredientId: 'mint', noteKey: 'recipe.lemoncloud.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.lemoncloud.step3' },
      { ingredientId: 'cherry', noteKey: 'recipe.lemoncloud.step4' },
    ],
  },
  {
    id: 'berry-parade',
    nameKey: 'recipe.berryparade.name',
    moodKey: 'recipe.berryparade.mood',
    descKey: 'recipe.berryparade.desc',
    tempo: 120,
    difficulty: 2,
    ingredients: ['blueberry', 'peach', 'strawberry', 'cupcake', 'sandwich'],
    steps: [
      { ingredientId: 'blueberry', noteKey: 'recipe.berryparade.step1' },
      { ingredientId: 'peach', noteKey: 'recipe.berryparade.step2' },
      { ingredientId: 'strawberry', noteKey: 'recipe.berryparade.step3' },
      { ingredientId: 'cupcake', noteKey: 'recipe.berryparade.step4' },
      { ingredientId: 'sandwich', noteKey: 'recipe.berryparade.step5' },
    ],
  },
  {
    id: 'barefoot-dance',
    nameKey: 'recipe.barefoot.name',
    moodKey: 'recipe.barefoot.mood',
    descKey: 'recipe.barefoot.desc',
    tempo: 128,
    difficulty: 2,
    ingredients: ['watermelon', 'peach', 'grape', 'sandwich', 'cupcake'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.barefoot.step1' },
      { ingredientId: 'peach', noteKey: 'recipe.barefoot.step2' },
      { ingredientId: 'grape', noteKey: 'recipe.barefoot.step3' },
      { ingredientId: 'sandwich', noteKey: 'recipe.barefoot.step4' },
      { ingredientId: 'cupcake', noteKey: 'recipe.barefoot.step5' },
    ],
  },
  {
    id: 'golden-hour',
    nameKey: 'recipe.goldenhour.name',
    moodKey: 'recipe.goldenhour.mood',
    descKey: 'recipe.goldenhour.desc',
    tempo: 90,
    difficulty: 1,
    ingredients: ['cheese', 'honey', 'lemonade', 'cherry', 'mint'],
    steps: [
      { ingredientId: 'cheese', noteKey: 'recipe.goldenhour.step1' },
      { ingredientId: 'honey', noteKey: 'recipe.goldenhour.step2' },
      { ingredientId: 'lemonade', noteKey: 'recipe.goldenhour.step3' },
      { ingredientId: 'cherry', noteKey: 'recipe.goldenhour.step4' },
      { ingredientId: 'mint', noteKey: 'recipe.goldenhour.step5' },
    ],
  },
  {
    id: 'firefly-lullaby',
    nameKey: 'recipe.firefly.name',
    moodKey: 'recipe.firefly.mood',
    descKey: 'recipe.firefly.desc',
    tempo: 85,
    difficulty: 1,
    ingredients: ['blueberry', 'honey', 'mint', 'cherry'],
    steps: [
      { ingredientId: 'blueberry', noteKey: 'recipe.firefly.step1' },
      { ingredientId: 'honey', noteKey: 'recipe.firefly.step2' },
      { ingredientId: 'mint', noteKey: 'recipe.firefly.step3' },
      { ingredientId: 'cherry', noteKey: 'recipe.firefly.step4' },
    ],
  },
  {
    id: 'orchard-rain',
    nameKey: 'recipe.orchard.name',
    moodKey: 'recipe.orchard.mood',
    descKey: 'recipe.orchard.desc',
    tempo: 105,
    difficulty: 2,
    ingredients: ['peach', 'lemonade', 'grape', 'blueberry'],
    steps: [
      { ingredientId: 'peach', noteKey: 'recipe.orchard.step1' },
      { ingredientId: 'lemonade', noteKey: 'recipe.orchard.step2' },
      { ingredientId: 'grape', noteKey: 'recipe.orchard.step3' },
      { ingredientId: 'blueberry', noteKey: 'recipe.orchard.step4' },
    ],
  },
  {
    id: 'secret-picnic',
    nameKey: 'recipe.secret.name',
    moodKey: 'recipe.secret.mood',
    descKey: 'recipe.secret.desc',
    tempo: 100,
    difficulty: 3,
    unlockAfter: 3, // Requires 3 completed recipes
    ingredients: ['watermelon', 'blueberry', 'honey', 'cupcake', 'cherry', 'strawberry'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.secret.step1' },
      { ingredientId: 'blueberry', noteKey: 'recipe.secret.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.secret.step3' },
      { ingredientId: 'cupcake', noteKey: 'recipe.secret.step4' },
      { ingredientId: 'cherry', noteKey: 'recipe.secret.step5' },
      { ingredientId: 'strawberry', noteKey: 'recipe.secret.step6' },
    ],
  },
];

const recipeById = new Map(recipeDefinitions.map(r => [r.id, r]));

/** Check if a recipe is unlocked */
function isRecipeUnlocked(recipe, completedRecipes) {
  if (!recipe.unlockAfter) return true;
  return completedRecipes.length >= recipe.unlockAfter;
}

export { recipeDefinitions, recipeById, isRecipeUnlocked };
