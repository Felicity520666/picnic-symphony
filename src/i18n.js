/**
 * i18n.js — Translation dictionary and live language switcher.
 * All user-facing text lives here. No hardcoded strings in HTML/JS.
 */

import { state, setState } from './state.js';
import { recipeTranslations } from './i18n-recipes.js';

const translations = {
  en: {
    // Welcome
    'welcome.kicker': 'Welcome to',
    'welcome.title': 'Picnic Symphony',
    'welcome.subtitle': 'Pack a basket. Build a beat.',
    'welcome.body': 'Spread a blanket beneath the open sky. Every picnic treat is hiding a rhythm, a harmony, or a little piece of summer. Choose a guiding spirit, gather your favorite sounds, and let the meadow remember your song.',
    'welcome.enter': 'Enter the Meadow',
    'welcome.howItWorks': 'How It Works',

    // Spirit selection
    'spirits.kicker': 'Choose your companion',
    'spirits.title': 'Pick a Guiding Spirit',
    'spirits.subtitle': 'Your spirit will float beside you, pointing to the next ingredient and cheering you on.',
    'spirits.continue': 'Continue',
    'spirit.bee.name': 'Pollen the Bee',
    'spirit.bee.personality': 'Cheerful & rhythm-focused',
    'spirit.bird.name': 'Lark the Songbird',
    'spirit.bird.personality': 'Warm & melody-focused',
    'spirit.dragonfly.name': 'Ripple the Dragonfly',
    'spirit.dragonfly.personality': 'Calm & texture-focused',
    'spirit.butterfly.name': 'Petal the Butterfly',
    'spirit.butterfly.personality': 'Poetic & harmony-focused',

    // Mode selection
    'mode.title': 'How would you like to play?',
    'mode.free.title': 'Free Mix',
    'mode.free.desc': 'Freely combine ingredients, adjust tempo, and create your own picnic song.',
    'mode.recipe.title': 'Recipe Trails',
    'mode.recipe.desc': 'Follow guided recipes with poetic challenges and collect picnic stickers.',

    // Studio
    'studio.brand': 'Picnic Symphony',
    'studio.tagline': 'Pack a basket. Build a beat.',
    'studio.play': 'Play',
    'studio.pause': 'Pause',
    'studio.clear': 'Clear Mix',
    'studio.undo': 'Undo',
    'studio.surprise': 'Surprise Basket',
    'studio.tempo': 'Tempo',
    'studio.volume': 'Music',
    'studio.ambience': 'Ambience',
    'studio.layers': 'Active layers',
    'studio.layerCount': '{n} / 12 sounds',
    'studio.nextIngredient': 'Next ingredient',
    'studio.pickRecipe': 'Pick a recipe to get started',
    'studio.recipe': 'Current recipe',
    'studio.noIngredients': 'No ingredients yet',
    'studio.finish': 'Finish My Picnic',
    'studio.recipeBook': 'Recipe Book',
    'studio.saveMix': 'Save Mix',

    // Recipes
    'recipes.title': 'Recipe Book',
    'recipes.subtitle': 'Choose a poetic recipe challenge. Each creates a different mood.',
    'recipes.back': 'Back to Studio',
    'recipes.steps': '{n} steps',
    'recipes.start': 'Start Recipe',
    'recipes.complete': 'Recipe complete!',
    'recipes.changeRecipe': 'Change recipe',

    // Tutorial
    'tutorial.next': 'Next',
    'tutorial.back': 'Back',
    'tutorial.skip': 'Skip',
    'tutorial.finish': 'Finish',
    'tutorial.step': 'Step {current} of {total}',
    'tutorial.replay': 'Replay Tutorial',

    // Postcard
    'postcard.title': 'Your Picnic Postcard',
    'postcard.download': 'Download Postcard',
    'postcard.newPicnic': 'Start a New Picnic',
    'postcard.backToStudio': 'Return to Studio',
    'postcard.nameLabel': 'Name your mix',
    'postcard.namePlaceholder': 'My Summer Song',

    // Theme
    'theme.auto': 'Auto',
    'theme.day': 'Day',
    'theme.night': 'Night',

    // Language
    'lang.switch': 'EN / 中文',

    // Ingredients
    'ingredient.watermelon.name': 'Watermelon Bounce',
    'ingredient.watermelon.role': 'Kick / Pulse',
    'ingredient.lemonade.name': 'Lemonade Sparkle',
    'ingredient.lemonade.role': 'Bell Arpeggio',
    'ingredient.strawberry.name': 'Strawberry Melody',
    'ingredient.strawberry.role': 'Marimba Melody',
    'ingredient.cheese.name': 'Cheesy Harmony',
    'ingredient.cheese.role': 'Warm Chords',
    'ingredient.grape.name': 'Grape Shaker',
    'ingredient.grape.role': 'High Percussion',
    'ingredient.cupcake.name': 'Cupcake Whistle',
    'ingredient.cupcake.role': 'Lead Whistle',
    'ingredient.blueberry.name': 'Blueberry Bass',
    'ingredient.blueberry.role': 'Plucked Bass',
    'ingredient.peach.name': 'Peach Clap',
    'ingredient.peach.role': 'Clap / Snare',
    'ingredient.mint.name': 'Mint Breeze',
    'ingredient.mint.role': 'Atmospheric Texture',
    'ingredient.honey.name': 'Honey Hum',
    'ingredient.honey.role': 'Warm Drone',
    'ingredient.cherry.name': 'Cherry Chime',
    'ingredient.cherry.role': 'High Accents',
    'ingredient.sandwich.name': 'Sandwich Groove',
    'ingredient.sandwich.role': 'Bongo / Tom',

    // Spirit messages
    'spirit.bee.welcome': 'Bzz! Let\'s make some sweet music together!',
    'spirit.bee.idle': 'Tap any treat to get the buzz started, or pick a recipe!',
    'spirit.bee.firstAdd': 'That\'s the buzz! Add another treat!',
    'spirit.bee.threeActive': 'The hive is humming beautifully!',
    'spirit.bee.fullMix': 'A full honeycomb of sound! Amazing!',
    'spirit.bee.cleared': 'Fresh start! Let\'s fill the meadow again!',
    'spirit.bee.recipeStep': 'Step {step} of {total}: Add {name}! Buzz buzz!',
    'spirit.bee.recipeDone': 'Sweet! {name} is complete!',

    'spirit.bird.welcome': 'Hello friend! Let\'s sing a picnic song together!',
    'spirit.bird.idle': 'Pick a recipe and tap a treat to start our song!',
    'spirit.bird.firstAdd': 'What a lovely note! Let\'s add more melody!',
    'spirit.bird.threeActive': 'Our little choir is growing! Tweet tweet!',
    'spirit.bird.fullMix': 'A whole orchestra of picnic sounds!',
    'spirit.bird.cleared': 'A quiet moment. Ready to sing again!',
    'spirit.bird.recipeStep': 'Step {step} of {total}: Add {name} to our song!',
    'spirit.bird.recipeDone': 'Wonderful! {name} is complete!',

    'spirit.dragonfly.welcome': 'Ready to zip through some musical treats?',
    'spirit.dragonfly.idle': 'Tap a treat and let\'s see what sound it makes!',
    'spirit.dragonfly.firstAdd': 'Nice pick! What\'s next? I\'m curious!',
    'spirit.dragonfly.threeActive': 'Layers building! This is getting interesting!',
    'spirit.dragonfly.fullMix': 'The whole meadow is alive with sound!',
    'spirit.dragonfly.cleared': 'Clean slate! Let\'s explore something new!',
    'spirit.dragonfly.recipeStep': 'Step {step} of {total}: Quick, add {name}!',
    'spirit.dragonfly.recipeDone': 'Done! {name} sounds great!',

    'spirit.butterfly.welcome': 'Spread your wings and listen to the meadow...',
    'spirit.butterfly.idle': 'The meadow is listening. Choose a recipe to begin.',
    'spirit.butterfly.firstAdd': 'A gentle beginning... add another layer.',
    'spirit.butterfly.threeActive': 'The harmony is blooming beautifully.',
    'spirit.butterfly.fullMix': 'A full summer symphony! How lovely.',
    'spirit.butterfly.cleared': 'Silence has its own beauty. Begin again when ready.',
    'spirit.butterfly.recipeStep': 'Step {step} of {total}: Gently add {name}.',
    'spirit.butterfly.recipeDone': 'Beautiful. {name} is ready.',
  },

  zh: {
    // Welcome
    'welcome.kicker': '欢迎来到',
    'welcome.title': '野餐交响曲',
    'welcome.subtitle': '装满野餐篮，也装满一首歌。',
    'welcome.body': '在晴空下铺开一张野餐毯吧。每一份点心都藏着节奏、和声，或一小片夏天。选择你的引路精灵，收集喜欢的声音，让草地记住你的歌。',
    'welcome.enter': '走进草地',
    'welcome.howItWorks': '玩法介绍',

    // Spirit selection
    'spirits.kicker': '选择你的伙伴',
    'spirits.title': '选一位引路精灵',
    'spirits.subtitle': '你的精灵会飘在身边，指引下一个食材，为你加油。',
    'spirits.continue': '继续',
    'spirit.bee.name': '花粉小蜜蜂',
    'spirit.bee.personality': '开朗活泼 · 节奏担当',
    'spirit.bird.name': '云雀歌手',
    'spirit.bird.personality': '温暖鼓励 · 旋律担当',
    'spirit.dragonfly.name': '涟漪蜻蜓',
    'spirit.dragonfly.personality': '安静好奇 · 质感担当',
    'spirit.butterfly.name': '花瓣蝴蝶',
    'spirit.butterfly.personality': '诗意温柔 · 和声担当',

    // Mode selection
    'mode.title': '你想怎么玩？',
    'mode.free.title': '自由混音',
    'mode.free.desc': '随心组合食材，调整节奏，创作属于你的野餐之歌。',
    'mode.recipe.title': '食谱挑战',
    'mode.recipe.desc': '跟着诗意食谱一步步来，完成后收集野餐贴纸。',

    // Studio
    'studio.brand': '野餐交响曲',
    'studio.tagline': '装满野餐篮，也装满一首歌。',
    'studio.play': '播放',
    'studio.pause': '暂停',
    'studio.clear': '清空',
    'studio.undo': '撤销',
    'studio.surprise': '惊喜篮子',
    'studio.tempo': '节奏',
    'studio.volume': '音乐',
    'studio.ambience': '环境音',
    'studio.layers': '已激活',
    'studio.layerCount': '{n} / 12 种声音',
    'studio.nextIngredient': '下一个食材',
    'studio.pickRecipe': '选一个食谱开始吧',
    'studio.recipe': '当前食谱',
    'studio.noIngredients': '还没有食材',
    'studio.finish': '完成我的野餐',
    'studio.recipeBook': '食谱书',
    'studio.saveMix': '保存混音',

    // Recipes
    'recipes.title': '食谱书',
    'recipes.subtitle': '选择一个诗意的食谱挑战，每个都有不同的氛围。',
    'recipes.back': '返回工作台',
    'recipes.steps': '{n} 步',
    'recipes.start': '开始食谱',
    'recipes.complete': '食谱完成！',
    'recipes.changeRecipe': '换一个食谱',

    // Tutorial
    'tutorial.next': '下一步',
    'tutorial.back': '上一步',
    'tutorial.skip': '跳过',
    'tutorial.finish': '完成',
    'tutorial.step': '第 {current} 步，共 {total} 步',
    'tutorial.replay': '重新教程',

    // Postcard
    'postcard.title': '你的野餐明信片',
    'postcard.download': '下载明信片',
    'postcard.newPicnic': '开始新野餐',
    'postcard.backToStudio': '返回工作台',
    'postcard.nameLabel': '给你的混音取个名字',
    'postcard.namePlaceholder': '我的夏日之歌',

    // Theme
    'theme.auto': '自动',
    'theme.day': '白天',
    'theme.night': '夜晚',

    // Language
    'lang.switch': 'EN / 中文',

    // Ingredients
    'ingredient.watermelon.name': '西瓜弹跳',
    'ingredient.watermelon.role': '底鼓 / 脉搏',
    'ingredient.lemonade.name': '柠檬气泡',
    'ingredient.lemonade.role': '铃铛琶音',
    'ingredient.strawberry.name': '草莓旋律',
    'ingredient.strawberry.role': '木琴旋律',
    'ingredient.cheese.name': '奶酪和弦',
    'ingredient.cheese.role': '温暖和弦',
    'ingredient.grape.name': '葡萄沙锤',
    'ingredient.grape.role': '高频打击',
    'ingredient.cupcake.name': '杯子蛋糕哨',
    'ingredient.cupcake.role': '主旋律哨声',
    'ingredient.blueberry.name': '蓝莓贝斯',
    'ingredient.blueberry.role': '拨弦低音',
    'ingredient.peach.name': '蜜桃拍掌',
    'ingredient.peach.role': '拍手 / 军鼓',
    'ingredient.mint.name': '薄荷清风',
    'ingredient.mint.role': '氛围质感',
    'ingredient.honey.name': '蜂蜜低鸣',
    'ingredient.honey.role': '温暖持续音',
    'ingredient.cherry.name': '樱桃风铃',
    'ingredient.cherry.role': '高音点缀',
    'ingredient.sandwich.name': '三明治律动',
    'ingredient.sandwich.role': '手鼓 / 通通鼓',

    // Spirit messages
    'spirit.bee.welcome': '嗡嗡！让我们一起做甜蜜的音乐吧！',
    'spirit.bee.idle': '点一个食材开始吧，或者选个食谱！',
    'spirit.bee.firstAdd': '嗡嗡真好听！再加一个吧！',
    'spirit.bee.threeActive': '蜂巢在美妙地振动！',
    'spirit.bee.fullMix': '满满一蜂巢的声音！太棒了！',
    'spirit.bee.cleared': '重新开始！让我们再次填满草地！',
    'spirit.bee.recipeStep': '第 {step} 步，共 {total} 步：加入{name}！嗡嗡！',
    'spirit.bee.recipeDone': '太甜了！{name}完成啦！',

    'spirit.bird.welcome': '你好朋友！让我们一起唱野餐之歌！',
    'spirit.bird.idle': '选一个食谱，点一个食材，开始我们的歌！',
    'spirit.bird.firstAdd': '多好的音符！再加点旋律吧！',
    'spirit.bird.threeActive': '我们的小合唱团在壮大！叽叽！',
    'spirit.bird.fullMix': '整个野餐交响乐团！太美了！',
    'spirit.bird.cleared': '安静的时刻。准备好了就再唱！',
    'spirit.bird.recipeStep': '第 {step} 步，共 {total} 步：把{name}加进歌里！',
    'spirit.bird.recipeDone': '太棒了！{name}完成了！',

    'spirit.dragonfly.welcome': '准备好飞越美味的音乐了吗？',
    'spirit.dragonfly.idle': '点一个食材看看它是什么声音！',
    'spirit.dragonfly.firstAdd': '不错的选择！下一个呢？我好奇！',
    'spirit.dragonfly.threeActive': '层次在叠加！越来越有趣了！',
    'spirit.dragonfly.fullMix': '整片草地都活了起来！',
    'spirit.dragonfly.cleared': '干净的画布！来探索新东西吧！',
    'spirit.dragonfly.recipeStep': '第 {step} 步，共 {total} 步：快加{name}！',
    'spirit.dragonfly.recipeDone': '搞定！{name}听起来棒极了！',

    'spirit.butterfly.welcome': '展开翅膀，聆听草地的声音……',
    'spirit.butterfly.idle': '草地在倾听。选一个食谱开始吧。',
    'spirit.butterfly.firstAdd': '温柔的开始……再加一层吧。',
    'spirit.butterfly.threeActive': '和声正在美丽地绽放。',
    'spirit.butterfly.fullMix': '完整的夏日交响曲！多么可爱。',
    'spirit.butterfly.cleared': '沉默也有它的美。准备好了再开始。',
    'spirit.butterfly.recipeStep': '第 {step} 步，共 {total} 步：轻轻加入{name}。',
    'spirit.butterfly.recipeDone': '太美了。{name}完成了。',
  },
};

// Merge recipe translations
Object.assign(translations.en, recipeTranslations.en);
Object.assign(translations.zh, recipeTranslations.zh);

/**
 * Get translated string. Supports {key} interpolation.
 * @param {string} key - Dot-notation translation key
 * @param {object} vars - Variables to interpolate
 * @returns {string}
 */
function t(key, vars = {}) {
  const lang = state.lang || 'en';
  const dict = translations[lang] || translations.en;
  let str = dict[key] || translations.en[key] || key;

  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }

  return str;
}

/** Switch language and re-render all [data-i18n] elements */
function setLanguage(lang) {
  setState({ lang }, true);
  applyTranslations();
}

/** Apply translations to all elements with data-i18n attribute */
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  for (const el of elements) {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr; // e.g., "placeholder", "aria-label"
    const text = t(key);
    if (attr) {
      el.setAttribute(attr, text);
    } else {
      el.textContent = text;
    }
  }
}

/** Get current language */
function getLang() {
  return state.lang || 'en';
}

export { t, setLanguage, applyTranslations, getLang, translations };
