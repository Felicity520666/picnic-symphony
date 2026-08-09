/**
 * recipes.js — 8 distinct recipes with genuinely different moods.
 * Each uses 3–5 ingredients from different musical roles.
 * No two recipes share more than 60% of ingredients.
 */

const recipeDefinitions = [
  {
    id: 'sunlit-lemonade',
    nameKey: 'recipe.sunlit.name',
    moodKey: 'recipe.sunlit.mood',
    descKey: 'recipe.sunlit.desc',
    tempo: 96,
    ingredients: ['lemonade', 'strawberry', 'mint'],
    steps: [
      { ingredientId: 'lemonade', noteKey: 'recipe.sunlit.step1' },
      { ingredientId: 'strawberry', noteKey: 'recipe.sunlit.step2' },
      { ingredientId: 'mint', noteKey: 'recipe.sunlit.step3' },
    ],
  },
  {
    id: 'watermelon-waltz',
    nameKey: 'recipe.waltz.name',
    moodKey: 'recipe.waltz.mood',
    descKey: 'recipe.waltz.desc',
    tempo: 88,
    ingredients: ['watermelon', 'grape', 'cupcake'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.waltz.step1' },
      { ingredientId: 'grape', noteKey: 'recipe.waltz.step2' },
      { ingredientId: 'cupcake', noteKey: 'recipe.waltz.step3' },
    ],
  },
  {
    id: 'berry-lanterns',
    nameKey: 'recipe.lanterns.name',
    moodKey: 'recipe.lanterns.mood',
    descKey: 'recipe.lanterns.desc',
    tempo: 92,
    ingredients: ['blueberry', 'cherry', 'honey'],
    steps: [
      { ingredientId: 'blueberry', noteKey: 'recipe.lanterns.step1' },
      { ingredientId: 'cherry', noteKey: 'recipe.lanterns.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.lanterns.step3' },
    ],
  },
  {
    id: 'meadow-tea',
    nameKey: 'recipe.tea.name',
    moodKey: 'recipe.tea.mood',
    descKey: 'recipe.tea.desc',
    tempo: 84,
    ingredients: ['mint', 'peach', 'cheese'],
    steps: [
      { ingredientId: 'mint', noteKey: 'recipe.tea.step1' },
      { ingredientId: 'peach', noteKey: 'recipe.tea.step2' },
      { ingredientId: 'cheese', noteKey: 'recipe.tea.step3' },
    ],
  },
  {
    id: 'golden-hour',
    nameKey: 'recipe.golden.name',
    moodKey: 'recipe.golden.mood',
    descKey: 'recipe.golden.desc',
    tempo: 80,
    ingredients: ['honey', 'lemonade', 'sandwich', 'cheese'],
    steps: [
      { ingredientId: 'honey', noteKey: 'recipe.golden.step1' },
      { ingredientId: 'lemonade', noteKey: 'recipe.golden.step2' },
      { ingredientId: 'sandwich', noteKey: 'recipe.golden.step3' },
      { ingredientId: 'cheese', noteKey: 'recipe.golden.step4' },
    ],
  },
  {
    id: 'picnic-parade',
    nameKey: 'recipe.parade.name',
    moodKey: 'recipe.parade.mood',
    descKey: 'recipe.parade.desc',
    tempo: 108,
    ingredients: ['watermelon', 'grape', 'strawberry', 'cherry', 'sandwich'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.parade.step1' },
      { ingredientId: 'grape', noteKey: 'recipe.parade.step2' },
      { ingredientId: 'strawberry', noteKey: 'recipe.parade.step3' },
      { ingredientId: 'cherry', noteKey: 'recipe.parade.step4' },
      { ingredientId: 'sandwich', noteKey: 'recipe.parade.step5' },
    ],
  },
  {
    id: 'firefly-jam',
    nameKey: 'recipe.firefly.name',
    moodKey: 'recipe.firefly.mood',
    descKey: 'recipe.firefly.desc',
    tempo: 76,
    ingredients: ['cupcake', 'blueberry', 'honey', 'mint'],
    steps: [
      { ingredientId: 'cupcake', noteKey: 'recipe.firefly.step1' },
      { ingredientId: 'blueberry', noteKey: 'recipe.firefly.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.firefly.step3' },
      { ingredientId: 'mint', noteKey: 'recipe.firefly.step4' },
    ],
  },
  {
    id: 'quiet-blanket',
    nameKey: 'recipe.blanket.name',
    moodKey: 'recipe.blanket.mood',
    descKey: 'recipe.blanket.desc',
    tempo: 72,
    ingredients: ['cheese', 'peach', 'sandwich'],
    steps: [
      { ingredientId: 'cheese', noteKey: 'recipe.blanket.step1' },
      { ingredientId: 'peach', noteKey: 'recipe.blanket.step2' },
      { ingredientId: 'sandwich', noteKey: 'recipe.blanket.step3' },
    ],
  },
];

const recipeById = new Map(recipeDefinitions.map(r => [r.id, r]));

function isRecipeUnlocked() { return true; }

export { recipeDefinitions, recipeById, isRecipeUnlocked };
