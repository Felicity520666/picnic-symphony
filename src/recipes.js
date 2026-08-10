/**
 * recipes.js — Nine recipes matching the art pack.
 * Each has an image in assets/recipes/{id}.png (640×640).
 */

const recipeDefinitions = [
  {
    id: 'sunlit-splash',
    nameKey: 'recipe.sunlitSplash.name',
    moodKey: 'recipe.sunlitSplash.mood',
    descKey: 'recipe.sunlitSplash.desc',
    image: 'assets/recipes/sunlit-splash.png',
    tempo: 96,
    ingredients: ['lemonade', 'peach', 'mint'],
    steps: [
      { ingredientId: 'lemonade', noteKey: 'recipe.sunlitSplash.step1' },
      { ingredientId: 'peach', noteKey: 'recipe.sunlitSplash.step2' },
      { ingredientId: 'mint', noteKey: 'recipe.sunlitSplash.step3' },
    ],
  },
  {
    id: 'berry-breeze',
    nameKey: 'recipe.berryBreeze.name',
    moodKey: 'recipe.berryBreeze.mood',
    descKey: 'recipe.berryBreeze.desc',
    image: 'assets/recipes/berry-breeze.png',
    tempo: 92,
    ingredients: ['strawberry', 'blueberry', 'grape'],
    steps: [
      { ingredientId: 'strawberry', noteKey: 'recipe.berryBreeze.step1' },
      { ingredientId: 'blueberry', noteKey: 'recipe.berryBreeze.step2' },
      { ingredientId: 'grape', noteKey: 'recipe.berryBreeze.step3' },
    ],
  },
  {
    id: 'orchard-waltz',
    nameKey: 'recipe.orchardWaltz.name',
    moodKey: 'recipe.orchardWaltz.mood',
    descKey: 'recipe.orchardWaltz.desc',
    image: 'assets/recipes/orchard-waltz.png',
    tempo: 84,
    ingredients: ['peach', 'cherry', 'honey'],
    steps: [
      { ingredientId: 'peach', noteKey: 'recipe.orchardWaltz.step1' },
      { ingredientId: 'cherry', noteKey: 'recipe.orchardWaltz.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.orchardWaltz.step3' },
    ],
  },
  {
    id: 'meadow-hop',
    nameKey: 'recipe.meadowHop.name',
    moodKey: 'recipe.meadowHop.mood',
    descKey: 'recipe.meadowHop.desc',
    image: 'assets/recipes/meadow-hop.png',
    tempo: 108,
    ingredients: ['watermelon', 'strawberry', 'mint'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.meadowHop.step1' },
      { ingredientId: 'strawberry', noteKey: 'recipe.meadowHop.step2' },
      { ingredientId: 'mint', noteKey: 'recipe.meadowHop.step3' },
    ],
  },
  {
    id: 'honeyed-hush',
    nameKey: 'recipe.honeyedHush.name',
    moodKey: 'recipe.honeyedHush.mood',
    descKey: 'recipe.honeyedHush.desc',
    image: 'assets/recipes/honeyed-hush.png',
    tempo: 72,
    ingredients: ['cupcake', 'honey', 'blueberry'],
    steps: [
      { ingredientId: 'cupcake', noteKey: 'recipe.honeyedHush.step1' },
      { ingredientId: 'honey', noteKey: 'recipe.honeyedHush.step2' },
      { ingredientId: 'blueberry', noteKey: 'recipe.honeyedHush.step3' },
    ],
  },
  {
    id: 'glass-garden',
    nameKey: 'recipe.glassGarden.name',
    moodKey: 'recipe.glassGarden.mood',
    descKey: 'recipe.glassGarden.desc',
    image: 'assets/recipes/glass-garden.png',
    tempo: 88,
    ingredients: ['lemonade', 'grape', 'mint'],
    steps: [
      { ingredientId: 'lemonade', noteKey: 'recipe.glassGarden.step1' },
      { ingredientId: 'grape', noteKey: 'recipe.glassGarden.step2' },
      { ingredientId: 'mint', noteKey: 'recipe.glassGarden.step3' },
    ],
  },
  {
    id: 'twilight-picnic',
    nameKey: 'recipe.twilightPicnic.name',
    moodKey: 'recipe.twilightPicnic.mood',
    descKey: 'recipe.twilightPicnic.desc',
    image: 'assets/recipes/twilight-picnic.png',
    tempo: 76,
    ingredients: ['sandwich', 'cheese', 'grape'],
    steps: [
      { ingredientId: 'sandwich', noteKey: 'recipe.twilightPicnic.step1' },
      { ingredientId: 'cheese', noteKey: 'recipe.twilightPicnic.step2' },
      { ingredientId: 'grape', noteKey: 'recipe.twilightPicnic.step3' },
    ],
  },
  {
    id: 'firefly-lullaby',
    nameKey: 'recipe.fireflyLullaby.name',
    moodKey: 'recipe.fireflyLullaby.mood',
    descKey: 'recipe.fireflyLullaby.desc',
    image: 'assets/recipes/firefly-lullaby.png',
    tempo: 68,
    ingredients: ['cupcake', 'lemonade', 'honey'],
    steps: [
      { ingredientId: 'cupcake', noteKey: 'recipe.fireflyLullaby.step1' },
      { ingredientId: 'lemonade', noteKey: 'recipe.fireflyLullaby.step2' },
      { ingredientId: 'honey', noteKey: 'recipe.fireflyLullaby.step3' },
    ],
  },
  {
    id: 'summer-encore',
    nameKey: 'recipe.summerEncore.name',
    moodKey: 'recipe.summerEncore.mood',
    descKey: 'recipe.summerEncore.desc',
    image: 'assets/recipes/summer-encore.png',
    tempo: 100,
    ingredients: ['watermelon', 'lemonade', 'cupcake', 'mint'],
    steps: [
      { ingredientId: 'watermelon', noteKey: 'recipe.summerEncore.step1' },
      { ingredientId: 'lemonade', noteKey: 'recipe.summerEncore.step2' },
      { ingredientId: 'cupcake', noteKey: 'recipe.summerEncore.step3' },
      { ingredientId: 'mint', noteKey: 'recipe.summerEncore.step4' },
    ],
  },
];

const recipeById = new Map(recipeDefinitions.map(r => [r.id, r]));

function isRecipeUnlocked() { return true; }

export { recipeDefinitions, recipeById, isRecipeUnlocked };
