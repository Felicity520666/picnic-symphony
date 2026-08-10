/**
 * i18n.js — Four-language translation system (en, zh, fr, es).
 * Concise UI copy. Poetic writing reserved for welcome/postcard pages.
 * Warns on missing keys in development.
 */

import { state, setState } from './state.js';
import { recipeTranslations } from './i18n-recipes.js';

const SUPPORTED_LANGS = ['en', 'zh', 'fr', 'es'];

const translations = {
  en: {
    // Welcome
    'welcome.title': 'Picnic Symphony',
    'welcome.body': "Some afternoons ask nothing of us but a blanket in the grass and time enough to listen. Here, fruit keeps rhythm, glass catches melody, and every small sound waits to be gathered into a song.",
    'welcome.enter': 'Begin the Picnic',
    'welcome.howItWorks': 'How It Works',

    // Spirit selection
    'spirits.title': 'Choose a guide for your picnic',
    'spirits.subtitle': 'Each guide listens differently. Choose the one whose ear you trust.',
    'spirits.continue': 'Continue',

    // Spirit names, species, personalities, alt text
    'spirit.bee.name': 'Aurelia',
    'spirit.bee.species': 'Honeybee Guide',
    'spirit.bee.personality': 'Rhythm and sunlight',
    'spirit.bee.type': 'Honeybee · Bright',
    'spirit.bee.alt': 'Aurelia, a honeybee guide',
    'spirit.bird.name': 'Lark',
    'spirit.bird.species': 'Songbird Guide',
    'spirit.bird.personality': 'Melody and breath',
    'spirit.bird.type': 'Songbird · Gentle',
    'spirit.bird.alt': 'Lark, a songbird guide',
    'spirit.dragonfly.name': 'Rill',
    'spirit.dragonfly.species': 'Dragonfly Guide',
    'spirit.dragonfly.personality': 'Texture and movement',
    'spirit.dragonfly.type': 'Dragonfly · Curious',
    'spirit.dragonfly.alt': 'Rill, a dragonfly guide',
    'spirit.butterfly.name': 'Iris',
    'spirit.butterfly.species': 'Butterfly Guide',
    'spirit.butterfly.personality': 'Harmony and color',
    'spirit.butterfly.type': 'Butterfly · Dreamy',
    'spirit.butterfly.alt': 'Iris, a butterfly guide',

    // Mode selection
    'mode.title': 'How would you like to listen?',
    'mode.free.title': 'Free Composition',
    'mode.free.desc': 'Build your own mix, one sound at a time.',
    'mode.recipe.title': 'Guided Recipes',
    'mode.recipe.desc': 'Start with a recipe, then make it yours.',

    // Studio
    'studio.play': 'Play',
    'studio.pause': 'Pause',
    'studio.clear': 'Clear',
    'studio.surprise': 'Surprise',
    'studio.tempo': 'Tempo',
    'studio.volume': 'Music',
    'studio.ambience': 'Ambience',
    'studio.layers': 'Active layers',
    'studio.layerCount': '{n} of 6',
    'studio.layerFull': 'Your basket can hold six sounds. Remove one before adding another.',
    'studio.pickRecipe': 'Choose your first sound.',
    'studio.finish': 'Finish',
    'studio.recipeBook': 'Recipes',

    // Recipes
    'recipes.title': 'Recipes',
    'recipes.subtitle': 'Each arrangement tells a different story.',
    'recipes.back': 'Back',
    'recipes.steps': '{n} layers',
    'recipes.complete': 'Complete',

    // Tutorial UI
    'tutorial.next': 'Next',
    'tutorial.back': 'Back',
    'tutorial.skip': 'Skip tour',
    'tutorial.finish': 'Start making music',
    'tutorial.step': 'Step {current} of {total}',
    'tutorial.keepLight': 'Keep this light',
    // Tutorial steps
    'tutorial.steps.language.title': 'Choose your language',
    'tutorial.steps.language.body': "Pick the language you'd like to use. You can change it anytime from this menu.",
    'tutorial.steps.theme.title': 'Set the light',
    'tutorial.steps.theme.body': 'Let the meadow follow your local time with Auto, or choose Day or Night whenever the mood changes.',
    'tutorial.steps.spirit.title': 'Meet your guide',
    'tutorial.steps.spirit.body': "Choose the companion you'd like beside you. They'll fly to each control and show you what to try next.",
    'tutorial.steps.mode.title': 'Choose how you\'d like to play',
    'tutorial.steps.mode.body': 'Build a song freely, or follow a recipe one sound at a time. You can explore both whenever you like.',
    'tutorial.steps.ingredient.title': 'Add your first sound',
    'tutorial.steps.ingredient.body': 'Every ingredient carries a different loop. Choose one to hear it, then add another to begin layering your song.',
    'tutorial.steps.ingredientGuided.title': 'Begin with {name}',
    'tutorial.steps.ingredientGuided.body': 'Select {name} to add its sound. Your guide will lead you through the rest of the recipe.',
    'tutorial.steps.transport.title': 'Shape the whole picnic',
    'tutorial.steps.transport.body': 'Play or pause everything here. Clear removes every layer, while Surprise creates a quick combination for you.',
    'tutorial.steps.recipes.title': 'Keep exploring',
    'tutorial.steps.recipes.body': 'Open Recipes whenever you want a new arrangement. When your picnic song feels complete, choose Finish to see what you made.',
    'tutorial.steps.ready.title': "You're ready",
    'tutorial.steps.ready.body': 'The blanket is yours. Follow a recipe, wander freely, or simply listen for what comes next.',

    // Postcard
    'postcard.title': 'Your Composition',
    'postcard.download': 'Download',
    'postcard.newPicnic': 'New Picnic',
    'postcard.backToStudio': 'Return',
    'postcard.nameLabel': 'Name this piece',
    'postcard.namePlaceholder': 'Afternoon in the grass',

    // Theme
    'theme.auto': 'Auto',
    'theme.day': 'Day',
    'theme.night': 'Night',

    // Language
    'lang.label': 'Language',
    'nav.back': 'Back',

    // Ingredients
    'ingredient.watermelon.name': 'Watermelon',
    'ingredient.watermelon.role': 'Kick',
    'ingredient.lemonade.name': 'Lemonade',
    'ingredient.lemonade.role': 'Glass melody',
    'ingredient.strawberry.name': 'Strawberry',
    'ingredient.strawberry.role': 'Clap',
    'ingredient.cheese.name': 'Cheese',
    'ingredient.cheese.role': 'Chord pad',
    'ingredient.grape.name': 'Grapes',
    'ingredient.grape.role': 'Plucked bass',
    'ingredient.cupcake.name': 'Cupcake',
    'ingredient.cupcake.role': 'Bell',
    'ingredient.blueberry.name': 'Blueberry',
    'ingredient.blueberry.role': 'Low tom',
    'ingredient.peach.name': 'Peach',
    'ingredient.peach.role': 'Plucked melody',
    'ingredient.mint.name': 'Mint',
    'ingredient.mint.role': 'Shaker',
    'ingredient.honey.name': 'Honey',
    'ingredient.honey.role': 'Sustained harmony',
    'ingredient.cherry.name': 'Cherry',
    'ingredient.cherry.role': 'Woodblock',
    'ingredient.sandwich.name': 'Sandwich',
    'ingredient.sandwich.role': 'Brushed texture',

    // Spirit messages
    'spirit.bee.idle': 'Choose your first sound.',
    'spirit.bee.firstAdd': 'Good. Now listen for what it needs beside it.',
    'spirit.bee.threeActive': 'The rhythm is finding its shape.',
    'spirit.bee.fullMix': 'Six sounds — the basket is full.',
    'spirit.bee.cleared': 'Silence again. A clean start.',
    'spirit.bee.recipeStep': 'Next: {name}',
    'spirit.bee.recipeDone': 'The arrangement is complete.',

    'spirit.bird.idle': 'Start with one ingredient. The rest will follow.',
    'spirit.bird.firstAdd': 'A first note. Now, what answers it?',
    'spirit.bird.threeActive': 'A small melody is forming.',
    'spirit.bird.fullMix': 'All six — a full song from a simple basket.',
    'spirit.bird.cleared': 'Rest. Then begin again, differently.',
    'spirit.bird.recipeStep': 'Next: {name}',
    'spirit.bird.recipeDone': 'This one is finished.',

    'spirit.dragonfly.idle': 'Choose any ingredient. See what happens.',
    'spirit.dragonfly.firstAdd': 'Add another — see how they move together.',
    'spirit.dragonfly.threeActive': 'Textures layering nicely.',
    'spirit.dragonfly.fullMix': 'Rich and full.',
    'spirit.dragonfly.cleared': 'Still water. Ready when you are.',
    'spirit.dragonfly.recipeStep': 'Next: {name}',
    'spirit.dragonfly.recipeDone': 'Complete. The current found its course.',

    'spirit.butterfly.idle': 'Touch a sound. Let it tell you what it wants for company.',
    'spirit.butterfly.firstAdd': 'Now another color beside it.',
    'spirit.butterfly.threeActive': 'The harmony is opening.',
    'spirit.butterfly.fullMix': 'Six colors, one picture.',
    'spirit.butterfly.cleared': 'A blank page. What will you paint next?',
    'spirit.butterfly.recipeStep': 'Next: {name}',
    'spirit.butterfly.recipeDone': 'Finished. Step back and listen.',
  },

  zh: {
    'welcome.title': '野餐交响曲',
    'welcome.body': '有些午后，只需要一张草地上的毯子和一段倾听的时间。这里，水果守着节拍，玻璃杯盛住旋律，每一声细小的回响，都等着被收进一首歌里。',
    'welcome.enter': '开始野餐',
    'welcome.howItWorks': '了解玩法',

    'spirits.title': '选择一位野餐向导',
    'spirits.subtitle': '每位向导聆听的方式不同。选择你信赖的那一位。',
    'spirits.continue': '继续',

    'spirit.bee.name': 'Aurelia',
    'spirit.bee.species': '蜜蜂向导',
    'spirit.bee.personality': '节奏与阳光',
    'spirit.bee.type': '蜜蜂 · 明亮',
    'spirit.bee.alt': 'Aurelia，一只蜜蜂向导',
    'spirit.bird.name': 'Lark',
    'spirit.bird.species': '鸣鸟向导',
    'spirit.bird.personality': '旋律与呼吸',
    'spirit.bird.type': '鸣鸟 · 温柔',
    'spirit.bird.alt': 'Lark，一只鸣鸟向导',
    'spirit.dragonfly.name': 'Rill',
    'spirit.dragonfly.species': '蜻蜓向导',
    'spirit.dragonfly.personality': '质感与流动',
    'spirit.dragonfly.type': '蜻蜓 · 好奇',
    'spirit.dragonfly.alt': 'Rill，一只蜻蜓向导',
    'spirit.butterfly.name': 'Iris',
    'spirit.butterfly.species': '蝴蝶向导',
    'spirit.butterfly.personality': '和声与色彩',
    'spirit.butterfly.type': '蝴蝶 · 梦幻',
    'spirit.butterfly.alt': 'Iris，一只蝴蝶向导',

    'mode.title': '你想怎样聆听？',
    'mode.free.title': '自由作曲',
    'mode.free.desc': '从一个声音开始，慢慢组合自己的音乐。',
    'mode.recipe.title': '引导食谱',
    'mode.recipe.desc': '从一份音乐配方开始，再把它变成你的作品。',

    'studio.play': '播放',
    'studio.pause': '暂停',
    'studio.clear': '清空',
    'studio.surprise': '随机',
    'studio.tempo': '速度',
    'studio.volume': '音乐',
    'studio.ambience': '环境',
    'studio.layers': '已激活',
    'studio.layerCount': '{n} / 6',
    'studio.layerFull': '你的篮子最多可以放六种声音。移除一种再添加新的。',
    'studio.pickRecipe': '选择你的第一个声音。',
    'studio.finish': '完成',
    'studio.recipeBook': '食谱',

    'recipes.title': '食谱',
    'recipes.subtitle': '每种编排讲述不同的故事。',
    'recipes.back': '返回',
    'recipes.steps': '{n} 层',
    'recipes.complete': '完成',

    'tutorial.next': '下一步',
    'tutorial.back': '上一步',
    'tutorial.skip': '跳过导览',
    'tutorial.finish': '开始创作音乐',
    'tutorial.step': '第 {current} 步，共 {total} 步',
    'tutorial.keepLight': '就用这个',
    'tutorial.steps.language.title': '选择你的语言',
    'tutorial.steps.language.body': '选一种你想用的语言。随时可以从这里更换。',
    'tutorial.steps.theme.title': '设置光线',
    'tutorial.steps.theme.body': '让草地跟随你的本地时间自动切换，或者随心情选择白天和夜晚。',
    'tutorial.steps.spirit.title': '认识你的向导',
    'tutorial.steps.spirit.body': '选一个你喜欢的伙伴。它会飞到每个控件旁边，告诉你下一步试什么。',
    'tutorial.steps.mode.title': '选择玩法',
    'tutorial.steps.mode.body': '自由创作一首歌，或者跟着食谱一个声音一个声音地来。两种方式随时可以切换。',
    'tutorial.steps.ingredient.title': '添加你的第一个声音',
    'tutorial.steps.ingredient.body': '每种食材都有独特的循环音。点一个听听看，再加一个开始叠加你的歌曲。',
    'tutorial.steps.ingredientGuided.title': '从{name}开始',
    'tutorial.steps.ingredientGuided.body': '选择{name}来添加它的声音。你的向导会带你完成剩下的步骤。',
    'tutorial.steps.transport.title': '掌控整场野餐',
    'tutorial.steps.transport.body': '在这里播放或暂停所有声音。清空会移除所有层，随机会为你快速生成一个组合。',
    'tutorial.steps.recipes.title': '继续探索',
    'tutorial.steps.recipes.body': '想要新编排时打开食谱。当你的野餐之歌感觉完整时，选择完成看看你创作了什么。',
    'tutorial.steps.ready.title': '准备好了',
    'tutorial.steps.ready.body': '草地是你的了。跟着食谱走，自由漫步，或者静静听听接下来会发生什么。',

    'postcard.title': '你的作品',
    'postcard.download': '下载',
    'postcard.newPicnic': '新野餐',
    'postcard.backToStudio': '返回',
    'postcard.nameLabel': '为这首曲子命名',
    'postcard.namePlaceholder': '草地上的午后',

    'theme.auto': '自动',
    'theme.day': '白天',
    'theme.night': '夜晚',
    'lang.label': '语言',
    'nav.back': '返回',

    'ingredient.watermelon.name': '西瓜',
    'ingredient.watermelon.role': '底鼓',
    'ingredient.lemonade.name': '柠檬水',
    'ingredient.lemonade.role': '玻璃旋律',
    'ingredient.strawberry.name': '草莓',
    'ingredient.strawberry.role': '拍掌',
    'ingredient.cheese.name': '奶酪',
    'ingredient.cheese.role': '和弦垫',
    'ingredient.grape.name': '葡萄',
    'ingredient.grape.role': '拨弦低音',
    'ingredient.cupcake.name': '蛋糕',
    'ingredient.cupcake.role': '铃声',
    'ingredient.blueberry.name': '蓝莓',
    'ingredient.blueberry.role': '低鼓',
    'ingredient.peach.name': '蜜桃',
    'ingredient.peach.role': '拨弦旋律',
    'ingredient.mint.name': '薄荷',
    'ingredient.mint.role': '沙锤',
    'ingredient.honey.name': '蜂蜜',
    'ingredient.honey.role': '持续和声',
    'ingredient.cherry.name': '樱桃',
    'ingredient.cherry.role': '木鱼',
    'ingredient.sandwich.name': '三明治',
    'ingredient.sandwich.role': '刷子质感',

    'spirit.bee.idle': '选择你的第一个声音。',
    'spirit.bee.firstAdd': '好的。现在听听它旁边需要什么。',
    'spirit.bee.threeActive': '节奏正在成形。',
    'spirit.bee.fullMix': '六种声音——篮子满了。',
    'spirit.bee.cleared': '又安静了。重新开始。',
    'spirit.bee.recipeStep': '下一个：{name}',
    'spirit.bee.recipeDone': '编排完成了。',

    'spirit.bird.idle': '从一个食材开始。其余的会跟上。',
    'spirit.bird.firstAdd': '第一个音符。现在，什么来回应它？',
    'spirit.bird.threeActive': '一段小旋律正在形成。',
    'spirit.bird.fullMix': '六个声部——一首完整的歌。',
    'spirit.bird.cleared': '休息。然后重新开始。',
    'spirit.bird.recipeStep': '下一个：{name}',
    'spirit.bird.recipeDone': '这首完成了。',

    'spirit.dragonfly.idle': '选任何一个食材。看看会发生什么。',
    'spirit.dragonfly.firstAdd': '再加一个——看它们如何一起流动。',
    'spirit.dragonfly.threeActive': '质感在叠加。',
    'spirit.dragonfly.fullMix': '丰富而饱满。',
    'spirit.dragonfly.cleared': '平静的水面。准备好了随时开始。',
    'spirit.dragonfly.recipeStep': '下一个：{name}',
    'spirit.dragonfly.recipeDone': '完成了。',

    'spirit.butterfly.idle': '触碰一个声音。让它告诉你它想要什么陪伴。',
    'spirit.butterfly.firstAdd': '现在在它旁边放一种颜色。',
    'spirit.butterfly.threeActive': '和声正在展开。',
    'spirit.butterfly.fullMix': '六种颜色，一幅画。',
    'spirit.butterfly.cleared': '一张白纸。你接下来想画什么？',
    'spirit.butterfly.recipeStep': '下一个：{name}',
    'spirit.butterfly.recipeDone': '完成了。退后一步，聆听整体。',
  },

  fr: {
    'welcome.title': 'Picnic Symphony',
    'welcome.body': "Certains après-midi ne demandent rien d'autre qu'une couverture dans l'herbe et le temps d'écouter. Ici, les fruits gardent le rythme, le verre recueille la mélodie, et chaque petit son attend de trouver sa place dans une chanson.",
    'welcome.enter': 'Commencer le pique-nique',
    'welcome.howItWorks': 'Comment ça marche',

    'spirits.title': 'Choisissez votre guide',
    'spirits.subtitle': "Chaque guide écoute à sa manière. Choisissez celui qui vous inspire confiance.",
    'spirits.continue': 'Continuer',

    'spirit.bee.name': 'Aurelia',
    'spirit.bee.species': 'Guide abeille',
    'spirit.bee.personality': 'Rythme et lumière',
    'spirit.bee.type': 'Abeille · Lumineuse',
    'spirit.bee.alt': 'Aurelia, un guide abeille',
    'spirit.bird.name': 'Lark',
    'spirit.bird.species': 'Guide oiseau chanteur',
    'spirit.bird.personality': 'Mélodie et souffle',
    'spirit.bird.type': 'Oiseau · Doux',
    'spirit.bird.alt': 'Lark, un guide oiseau chanteur',
    'spirit.dragonfly.name': 'Rill',
    'spirit.dragonfly.species': 'Guide libellule',
    'spirit.dragonfly.personality': 'Texture et mouvement',
    'spirit.dragonfly.type': 'Libellule · Curieuse',
    'spirit.dragonfly.alt': 'Rill, un guide libellule',
    'spirit.butterfly.name': 'Iris',
    'spirit.butterfly.species': 'Guide papillon',
    'spirit.butterfly.personality': 'Harmonie et couleur',
    'spirit.butterfly.type': 'Papillon · Rêveur',
    'spirit.butterfly.alt': 'Iris, un guide papillon',

    'mode.title': 'Comment souhaitez-vous écouter ?',
    'mode.free.title': 'Composition libre',
    'mode.free.desc': 'Composez votre morceau, un son à la fois.',
    'mode.recipe.title': 'Recettes guidées',
    'mode.recipe.desc': 'Commencez par une recette, puis personnalisez-la.',

    'studio.play': 'Jouer',
    'studio.pause': 'Pause',
    'studio.clear': 'Effacer',
    'studio.surprise': 'Surprise',
    'studio.tempo': 'Tempo',
    'studio.volume': 'Musique',
    'studio.ambience': 'Ambiance',
    'studio.layers': 'Couches actives',
    'studio.layerCount': '{n} sur 6',
    'studio.layerFull': 'Votre panier peut contenir six sons. Retirez-en un avant d\'en ajouter.',
    'studio.pickRecipe': 'Choisissez votre premier son.',
    'studio.finish': 'Terminer',
    'studio.recipeBook': 'Recettes',

    'recipes.title': 'Recettes',
    'recipes.subtitle': 'Chaque arrangement raconte une histoire différente.',
    'recipes.back': 'Retour',
    'recipes.steps': '{n} couches',
    'recipes.complete': 'Terminé',

    'tutorial.next': 'Suivant',
    'tutorial.back': 'Retour',
    'tutorial.skip': 'Passer la visite',
    'tutorial.finish': 'Commencer à créer',
    'tutorial.step': 'Étape {current} sur {total}',
    'tutorial.keepLight': 'Garder cet éclairage',
    'tutorial.steps.language.title': 'Choisissez votre langue',
    'tutorial.steps.language.body': 'Sélectionnez la langue que vous préférez. Vous pouvez la changer à tout moment depuis ce menu.',
    'tutorial.steps.theme.title': "Réglez l'éclairage",
    'tutorial.steps.theme.body': "Laissez la prairie suivre l'heure locale avec Auto, ou choisissez Jour ou Nuit selon votre humeur.",
    'tutorial.steps.spirit.title': 'Rencontrez votre guide',
    'tutorial.steps.spirit.body': 'Choisissez le compagnon qui vous accompagnera. Il volera vers chaque contrôle pour vous montrer quoi essayer.',
    'tutorial.steps.mode.title': 'Comment voulez-vous jouer ?',
    'tutorial.steps.mode.body': 'Composez librement ou suivez une recette son par son. Vous pouvez explorer les deux à tout moment.',
    'tutorial.steps.ingredient.title': 'Ajoutez votre premier son',
    'tutorial.steps.ingredient.body': 'Chaque ingrédient porte une boucle différente. Touchez-en un pour l\'entendre, puis ajoutez-en un autre.',
    'tutorial.steps.ingredientGuided.title': 'Commencez par {name}',
    'tutorial.steps.ingredientGuided.body': 'Sélectionnez {name} pour ajouter son son. Votre guide vous mènera à travers le reste de la recette.',
    'tutorial.steps.transport.title': 'Orchestrez le pique-nique',
    'tutorial.steps.transport.body': 'Jouez ou mettez en pause ici. Effacer retire toutes les couches, Surprise crée une combinaison rapide.',
    'tutorial.steps.recipes.title': 'Continuez à explorer',
    'tutorial.steps.recipes.body': 'Ouvrez les Recettes quand vous voulez un nouvel arrangement. Quand votre chanson vous plaît, choisissez Terminer.',
    'tutorial.steps.ready.title': 'Vous êtes prêt',
    'tutorial.steps.ready.body': 'La couverture est à vous. Suivez une recette, explorez librement, ou écoutez simplement ce qui vient.',

    'postcard.title': 'Votre composition',
    'postcard.download': 'Télécharger',
    'postcard.newPicnic': 'Nouveau pique-nique',
    'postcard.backToStudio': 'Retour',
    'postcard.nameLabel': 'Nommez cette pièce',
    'postcard.namePlaceholder': "Un après-midi dans l'herbe",

    'theme.auto': 'Auto',
    'theme.day': 'Jour',
    'theme.night': 'Nuit',
    'lang.label': 'Langue',
    'nav.back': 'Retour',

    'ingredient.watermelon.name': 'Pastèque',
    'ingredient.watermelon.role': 'Kick',
    'ingredient.lemonade.name': 'Citronnade',
    'ingredient.lemonade.role': 'Mélodie cristalline',
    'ingredient.strawberry.name': 'Fraise',
    'ingredient.strawberry.role': 'Clap',
    'ingredient.cheese.name': 'Fromage',
    'ingredient.cheese.role': 'Nappe harmonique',
    'ingredient.grape.name': 'Raisins',
    'ingredient.grape.role': 'Basse pizzicato',
    'ingredient.cupcake.name': 'Cupcake',
    'ingredient.cupcake.role': 'Clochette',
    'ingredient.blueberry.name': 'Myrtille',
    'ingredient.blueberry.role': 'Tom grave',
    'ingredient.peach.name': 'Pêche',
    'ingredient.peach.role': 'Mélodie pincée',
    'ingredient.mint.name': 'Menthe',
    'ingredient.mint.role': 'Shaker',
    'ingredient.honey.name': 'Miel',
    'ingredient.honey.role': 'Harmonie tenue',
    'ingredient.cherry.name': 'Cerise',
    'ingredient.cherry.role': 'Wood-block',
    'ingredient.sandwich.name': 'Sandwich',
    'ingredient.sandwich.role': 'Texture brossée',

    'spirit.bee.idle': 'Choisissez votre premier son.',
    'spirit.bee.firstAdd': 'Bien. Écoutez ce dont il a besoin à côté.',
    'spirit.bee.threeActive': 'Le rythme prend forme.',
    'spirit.bee.fullMix': 'Six voix — le panier est plein.',
    'spirit.bee.cleared': 'Le silence revient. Un nouveau départ.',
    'spirit.bee.recipeStep': 'Suivant : {name}',
    'spirit.bee.recipeDone': "L'arrangement est complet.",

    'spirit.bird.idle': 'Commencez par un ingrédient. Le reste suivra.',
    'spirit.bird.firstAdd': 'Une première note. Qu\'est-ce qui lui répond ?',
    'spirit.bird.threeActive': 'Une petite mélodie se dessine.',
    'spirit.bird.fullMix': 'Six voix — une chanson complète.',
    'spirit.bird.cleared': 'Repos. Puis recommencez.',
    'spirit.bird.recipeStep': 'Suivant : {name}',
    'spirit.bird.recipeDone': 'Celle-ci est finie.',

    'spirit.dragonfly.idle': "Choisissez n'importe quel ingrédient. Voyons ce qui se passe.",
    'spirit.dragonfly.firstAdd': 'Ajoutez-en un autre — observez comment ils bougent ensemble.',
    'spirit.dragonfly.threeActive': 'Les textures se superposent.',
    'spirit.dragonfly.fullMix': 'Riche et complet.',
    'spirit.dragonfly.cleared': 'Eau calme. Prêt quand vous l\'êtes.',
    'spirit.dragonfly.recipeStep': 'Suivant : {name}',
    'spirit.dragonfly.recipeDone': 'Terminé.',

    'spirit.butterfly.idle': 'Touchez un son. Laissez-le vous dire ce qu\'il désire.',
    'spirit.butterfly.firstAdd': 'Maintenant, une autre couleur à côté.',
    'spirit.butterfly.threeActive': "L'harmonie s'ouvre.",
    'spirit.butterfly.fullMix': 'Six couleurs, un tableau.',
    'spirit.butterfly.cleared': "Une page blanche. Qu'allez-vous peindre ?",
    'spirit.butterfly.recipeStep': 'Suivant : {name}',
    'spirit.butterfly.recipeDone': 'Fini. Prenez du recul et écoutez.',
  },

  es: {
    'welcome.title': 'Picnic Symphony',
    'welcome.body': 'Hay tardes que no piden nada más que una manta sobre la hierba y tiempo para escuchar. Aquí, la fruta sostiene el ritmo, el cristal recoge la melodía y cada pequeño sonido espera encontrar su lugar en una canción.',
    'welcome.enter': 'Empezar el picnic',
    'welcome.howItWorks': 'Cómo funciona',

    'spirits.title': 'Elige a tu guía',
    'spirits.subtitle': 'Cada guía escucha de forma distinta. Elige el que te inspire.',
    'spirits.continue': 'Continuar',

    'spirit.bee.name': 'Aurelia',
    'spirit.bee.species': 'Guía abeja',
    'spirit.bee.personality': 'Ritmo y luz',
    'spirit.bee.type': 'Abeja · Brillante',
    'spirit.bee.alt': 'Aurelia, una guía abeja',
    'spirit.bird.name': 'Lark',
    'spirit.bird.species': 'Guía pájaro cantor',
    'spirit.bird.personality': 'Melodía y aliento',
    'spirit.bird.type': 'Pájaro · Dulce',
    'spirit.bird.alt': 'Lark, un guía pájaro cantor',
    'spirit.dragonfly.name': 'Rill',
    'spirit.dragonfly.species': 'Guía libélula',
    'spirit.dragonfly.personality': 'Textura y movimiento',
    'spirit.dragonfly.type': 'Libélula · Curiosa',
    'spirit.dragonfly.alt': 'Rill, una guía libélula',
    'spirit.butterfly.name': 'Iris',
    'spirit.butterfly.species': 'Guía mariposa',
    'spirit.butterfly.personality': 'Armonía y color',
    'spirit.butterfly.type': 'Mariposa · Soñadora',
    'spirit.butterfly.alt': 'Iris, una guía mariposa',

    'mode.title': '¿Cómo quieres escuchar?',
    'mode.free.title': 'Composición libre',
    'mode.free.desc': 'Crea tu mezcla, un sonido a la vez.',
    'mode.recipe.title': 'Recetas guiadas',
    'mode.recipe.desc': 'Empieza con una receta y luego hazla tuya.',

    'studio.play': 'Reproducir',
    'studio.pause': 'Pausa',
    'studio.clear': 'Limpiar',
    'studio.surprise': 'Sorpresa',
    'studio.tempo': 'Tempo',
    'studio.volume': 'Música',
    'studio.ambience': 'Ambiente',
    'studio.layers': 'Capas activas',
    'studio.layerCount': '{n} de 6',
    'studio.layerFull': 'Tu cesta puede contener seis sonidos. Quita uno antes de añadir otro.',
    'studio.pickRecipe': 'Elige tu primer sonido.',
    'studio.finish': 'Terminar',
    'studio.recipeBook': 'Recetas',

    'recipes.title': 'Recetas',
    'recipes.subtitle': 'Cada arreglo cuenta una historia diferente.',
    'recipes.back': 'Volver',
    'recipes.steps': '{n} capas',
    'recipes.complete': 'Completa',

    'tutorial.next': 'Siguiente',
    'tutorial.back': 'Atrás',
    'tutorial.skip': 'Saltar la visita',
    'tutorial.finish': 'Empezar a crear',
    'tutorial.step': 'Paso {current} de {total}',
    'tutorial.keepLight': 'Dejar esta luz',
    'tutorial.steps.language.title': 'Elige tu idioma',
    'tutorial.steps.language.body': 'Selecciona el idioma que prefieras. Puedes cambiarlo en cualquier momento desde este menú.',
    'tutorial.steps.theme.title': 'Ajusta la luz',
    'tutorial.steps.theme.body': 'Deja que el prado siga tu hora local con Auto, o elige Día o Noche cuando cambie tu ánimo.',
    'tutorial.steps.spirit.title': 'Conoce a tu guía',
    'tutorial.steps.spirit.body': 'Elige al compañero que te acompañará. Volará a cada control y te mostrará qué probar.',
    'tutorial.steps.mode.title': '¿Cómo quieres jugar?',
    'tutorial.steps.mode.body': 'Crea una canción libremente o sigue una receta sonido a sonido. Puedes explorar ambas cuando quieras.',
    'tutorial.steps.ingredient.title': 'Añade tu primer sonido',
    'tutorial.steps.ingredient.body': 'Cada ingrediente tiene un bucle diferente. Toca uno para escucharlo y luego añade otro para empezar a capas.',
    'tutorial.steps.ingredientGuided.title': 'Empieza con {name}',
    'tutorial.steps.ingredientGuided.body': 'Selecciona {name} para añadir su sonido. Tu guía te llevará por el resto de la receta.',
    'tutorial.steps.transport.title': 'Da forma al picnic',
    'tutorial.steps.transport.body': 'Reproduce o pausa todo aquí. Limpiar quita todas las capas, Sorpresa crea una combinación rápida.',
    'tutorial.steps.recipes.title': 'Sigue explorando',
    'tutorial.steps.recipes.body': 'Abre Recetas cuando quieras un nuevo arreglo. Cuando tu canción se sienta completa, elige Terminar.',
    'tutorial.steps.ready.title': 'Listo',
    'tutorial.steps.ready.body': 'La manta es tuya. Sigue una receta, explora libremente, o simplemente escucha lo que viene.',

    'postcard.title': 'Tu composición',
    'postcard.download': 'Descargar',
    'postcard.newPicnic': 'Nuevo picnic',
    'postcard.backToStudio': 'Volver',
    'postcard.nameLabel': 'Nombra esta pieza',
    'postcard.namePlaceholder': 'Una tarde en la hierba',

    'theme.auto': 'Auto',
    'theme.day': 'Día',
    'theme.night': 'Noche',
    'lang.label': 'Idioma',
    'nav.back': 'Volver',

    'ingredient.watermelon.name': 'Sandía',
    'ingredient.watermelon.role': 'Golpe',
    'ingredient.lemonade.name': 'Limonada',
    'ingredient.lemonade.role': 'Melodía cristalina',
    'ingredient.strawberry.name': 'Fresa',
    'ingredient.strawberry.role': 'Palma',
    'ingredient.cheese.name': 'Queso',
    'ingredient.cheese.role': 'Colchón armónico',
    'ingredient.grape.name': 'Uvas',
    'ingredient.grape.role': 'Bajo pulsado',
    'ingredient.cupcake.name': 'Cupcake',
    'ingredient.cupcake.role': 'Campanilla',
    'ingredient.blueberry.name': 'Arándano',
    'ingredient.blueberry.role': 'Tom grave',
    'ingredient.peach.name': 'Melocotón',
    'ingredient.peach.role': 'Melodía pulsada',
    'ingredient.mint.name': 'Menta',
    'ingredient.mint.role': 'Shaker',
    'ingredient.honey.name': 'Miel',
    'ingredient.honey.role': 'Armonía sostenida',
    'ingredient.cherry.name': 'Cereza',
    'ingredient.cherry.role': 'Caja china',
    'ingredient.sandwich.name': 'Sándwich',
    'ingredient.sandwich.role': 'Textura cepillada',

    'spirit.bee.idle': 'Elige tu primer sonido.',
    'spirit.bee.firstAdd': 'Bien. Ahora escucha qué necesita a su lado.',
    'spirit.bee.threeActive': 'El ritmo está tomando forma.',
    'spirit.bee.fullMix': 'Seis sonidos — la cesta está llena.',
    'spirit.bee.cleared': 'Silencio de nuevo. Un comienzo limpio.',
    'spirit.bee.recipeStep': 'Siguiente: {name}',
    'spirit.bee.recipeDone': 'El arreglo está completo.',

    'spirit.bird.idle': 'Empieza con un ingrediente. El resto vendrá.',
    'spirit.bird.firstAdd': 'Una primera nota. ¿Qué le responde?',
    'spirit.bird.threeActive': 'Una pequeña melodía se está formando.',
    'spirit.bird.fullMix': 'Seis voces — una canción completa.',
    'spirit.bird.cleared': 'Descanso. Luego empieza de nuevo.',
    'spirit.bird.recipeStep': 'Siguiente: {name}',
    'spirit.bird.recipeDone': 'Esta está terminada.',

    'spirit.dragonfly.idle': 'Elige cualquier ingrediente. A ver qué pasa.',
    'spirit.dragonfly.firstAdd': 'Añade otro — mira cómo se mueven juntos.',
    'spirit.dragonfly.threeActive': 'Las texturas se acumulan.',
    'spirit.dragonfly.fullMix': 'Rico y lleno.',
    'spirit.dragonfly.cleared': 'Agua quieta. Listo cuando quieras.',
    'spirit.dragonfly.recipeStep': 'Siguiente: {name}',
    'spirit.dragonfly.recipeDone': 'Completo.',

    'spirit.butterfly.idle': 'Toca un sonido. Deja que te diga qué compañía desea.',
    'spirit.butterfly.firstAdd': 'Ahora otro color junto a él.',
    'spirit.butterfly.threeActive': 'La armonía se abre.',
    'spirit.butterfly.fullMix': 'Seis colores, un cuadro.',
    'spirit.butterfly.cleared': 'Una página en blanco. ¿Qué pintarás ahora?',
    'spirit.butterfly.recipeStep': 'Siguiente: {name}',
    'spirit.butterfly.recipeDone': 'Terminado. Escucha el conjunto.',
  },
};


// Merge recipe translations
Object.assign(translations.en, recipeTranslations.en || {});
Object.assign(translations.zh, recipeTranslations.zh || {});
Object.assign(translations.fr, recipeTranslations.fr || {});
Object.assign(translations.es, recipeTranslations.es || {});

/**
 * Get translated string with {key} interpolation.
 * Warns in development when a key is missing.
 */
function t(key, vars = {}) {
  const lang = state.lang || 'en';
  const dict = translations[lang] || translations.en;
  let str = dict[key];
  if (str === undefined) {
    str = translations.en[key];
    if (str === undefined) {
      console.warn(`Missing translation: ${lang}.${key}`);
      return key;
    }
    if (lang !== 'en') {
      console.warn(`Missing translation: ${lang}.${key}`);
    }
  }
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return str;
}

/** Switch language, persist, re-render */
function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = 'en';
  setState({ lang }, true);
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
  applyTranslations();
}

/** Apply translations to all [data-i18n] elements */
function applyTranslations() {
  for (const el of document.querySelectorAll('[data-i18n]')) {
    const key = el.dataset.i18n;
    const attr = el.dataset.i18nAttr;
    const text = t(key);
    if (attr) el.setAttribute(attr, text);
    else el.textContent = text;
  }
}

/** Detect browser language on first visit */
function detectLanguage() {
  const nav = (navigator.language || 'en').toLowerCase();
  if (nav.startsWith('zh')) return 'zh';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('es')) return 'es';
  return 'en';
}

function getLang() { return state.lang || 'en'; }

export { t, setLanguage, applyTranslations, getLang, detectLanguage, SUPPORTED_LANGS, translations };
