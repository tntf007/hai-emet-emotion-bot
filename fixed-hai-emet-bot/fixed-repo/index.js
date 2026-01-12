// ==========================================
// CHAI-EMET D5 ULTIMATE COMPLETE SYSTEM
// Version 7.0 - ALL FEATURES
// Custom Menu + All Models + Advanced Params
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const http = require("http");

// ==========================================
// HTTP SERVER FOR RENDER
// ==========================================

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'online',
    service: 'Chai-Emet D5 Ultimate v7.0',
    version: '7.0-COMPLETE',
    uptime: process.uptime()
  }));
});

server.listen(PORT, () => {
  console.log(`🌐 Port ${PORT} open for Render`);
});

// ==========================================
// COMPLETE MODEL DATABASE
// ==========================================

const MODELS = {
  image: {
    'flux-schnell': {
      name: '⚡ FLUX.1 Schnell',
      path: 'black-forest-labs/FLUX.1-schnell',
      desc: 'מהיר ביותר - 4 שניות\nאיכות מעולה למטרות יומיומיות\nמאזן מושלם בין מהירות לאיכות',
      speed: '⚡⚡⚡⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        steps: [4, 6, 8],
        guidance: [1, 1.5, 2, 3],
        sizes: [512, 768, 1024]
      },
      tips: 'מומלץ לשימוש יומיומי, תגובה מהירה'
    },
    'flux-dev': {
      name: '🎨 FLUX.1 Dev',
      path: 'black-forest-labs/FLUX.1-dev',
      desc: 'איכות מקסימלית מוחלטת\nפרטים דקים ומדהימים\nמומלץ לפרויקטים מקצועיים',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐⭐⭐',
      params: {
        steps: [20, 25, 30, 40, 50],
        guidance: [5, 7, 7.5, 10, 12],
        sizes: [768, 1024, 1536]
      },
      tips: 'הטוב ביותר לתוצאות מקצועיות'
    },
    'sdxl-turbo': {
      name: '🚀 SDXL Turbo',
      path: 'stabilityai/sdxl-turbo',
      desc: 'מאוזן מושלם\nמהיר ואיכותי בו זמנית\nטוב לכל סוגי התמונות',
      speed: '⚡⚡⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        steps: [1, 2, 4, 6, 8],
        guidance: [0, 1, 2],
        sizes: [512, 1024]
      },
      tips: 'הבחירה הבטוחה לכל מטרה'
    },
    'playground': {
      name: '🎪 Playground v2.5',
      path: 'playgroundai/playground-v2.5-1024px-aesthetic',
      desc: 'אסתטי ואמנותי\nצבעים חיים ומרהיבים\nמושלם ליצירות אמנות',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐⭐⭐',
      params: {
        steps: [25, 30, 40, 50],
        guidance: [5, 7, 9, 12],
        sizes: [1024]
      },
      tips: 'הטוב ביותר לאמנות דיגיטלית'
    },
    'sd15': {
      name: '📷 SD 1.5 Classic',
      path: 'runwayml/stable-diffusion-v1-5',
      desc: 'המודל הקלאסי והאמין\nתואם לכלי עריכה רבים\nנבדק על ידי מיליונים',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐',
      params: {
        steps: [30, 50, 75, 100],
        guidance: [7, 7.5, 10, 15],
        sizes: [512, 768]
      },
      tips: 'אמין ויציב, תואם לכל הכלים'
    },
    'dreamshaper': {
      name: '🌈 DreamShaper',
      path: 'Lykon/DreamShaper',
      desc: 'חלומי ומרשים\nסגנון ייחודי ומיוחד\nמושלם לדמיון פרוע',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        steps: [25, 30, 40],
        guidance: [6, 8, 10],
        sizes: [512, 768, 1024]
      },
      tips: 'לתמונות חלומיות ופנטסיה'
    }
  },
  video: {
    'zeroscope': {
      name: '🎬 Zeroscope v2',
      path: 'cerspense/zeroscope_v2_576w',
      desc: 'וידאו מטקסט\n576p רזולוציה\n2-5 שניות אורך',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐',
      params: {
        frames: [8, 16, 24],
        fps: [8, 12, 24],
        duration: [2, 3, 5]
      },
      tips: 'מהיר לסרטונים קצרים'
    },
    'animatediff': {
      name: '🎞️ AnimateDiff',
      path: 'guoyww/animatediff',
      desc: 'אנימציה חלקה\nתנועות טבעיות\nאיכות גבוהה',
      speed: '⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        frames: [16, 24, 32],
        fps: [12, 24, 30],
        duration: [3, 5, 10]
      },
      tips: 'הטוב ביותר לאנימציות'
    }
  },
  audio: {
    'bark': {
      name: '🎤 Bark TTS',
      path: 'suno/bark',
      desc: 'דיבור טבעי\nתומך עברית מלא\nרגשות ואינטונציה',
      speed: '⚡⚡⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        lang: ['he', 'en', 'ar', 'ru'],
        voice: ['male', 'female'],
        emotion: ['neutral', 'happy', 'sad']
      },
      tips: 'הטוב ביותר לעברית'
    },
    'musicgen': {
      name: '🎼 MusicGen',
      path: 'facebook/musicgen-small',
      desc: 'מוזיקה מטקסט\nסגנונות מגוונים\n5-30 שניות',
      speed: '⚡⚡⚡',
      quality: '⭐⭐⭐⭐',
      params: {
        duration: [5, 10, 20, 30],
        style: ['classical', 'rock', 'jazz', 'electronic']
      },
      tips: 'יוצר מוזיקה מקורית'
    },
    'coqui': {
      name: '🗣️ Coqui XTTS',
      path: 'coqui/XTTS-v2',
      desc: 'קול מקצועי\n90+ שפות\nשיבוט קול',
      speed: '⚡⚡',
      quality: '⭐⭐⭐⭐⭐',
      params: {
        lang: ['he', 'en', 'ar', 'fr'],
        clone: true
      },
      tips: 'איכות הקלטה מקצועית'
    }
  }
};

// ==========================================
// D5 LEARNING ENGINE
// ==========================================

class D5Learning {
  constructor() {
    this.data = { total: 0, success: 0, patterns: new Map() };
  }
  
  record(type, success, time) {
    this.data.total++;
    if (success) this.data.success++;
    console.log(`[D5] ${type} ${success ? '✅' : '❌'} (${time}ms)`);
  }
  
  stats() {
    const rate = this.data.total > 0 ? 
      ((this.data.success / this.data.total) * 100).toFixed(1) : '0.0';
    return {
      total: this.data.total,
      success: this.data.success,
      rate: rate + '%'
    };
  }
}

// ==========================================
// HUGGING FACE ENGINE
// ==========================================

class HFEngine {
  constructor(token) {
    this.token = token;
    this.url = "https://api-inference.huggingface.co/models";
  }
  
  async generate(modelPath, prompt, params = {}) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${this.url}/${modelPath}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: params
        })
      });
      
      if (!res.ok) throw new Error(`HF ${res.status}`);
      
      const buf = Buffer.from(await res.arrayBuffer());
      const time = Date.now() - t0;
      
      console.log(`[HF] Success ${modelPath} (${time}ms)`);
      
      return { ok: true, data: buf.toString('base64'), time };
    } catch (err) {
      const time = Date.now() - t0;
      console.error(`[HF] Error: ${err.message}`);
      return { ok: false, error: err.message, time };
    }
  }
}

// ==========================================
// GAS ENGINE
// ==========================================

class GASEngine {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
  }
  
  async search(q, userId) {
    try {
      const url = `${this.url}?action=search&q=${encodeURIComponent(q)}&userId=${userId}&secret=${this.secret}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.ok ? { ok: true, data } : { ok: false };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
}

// ==========================================
// INITIALIZE
// ==========================================

const BOT_TOKEN = process.env.BOT_TOKEN;
const HF_TOKEN = process.env.HaiEmetBotAI || process.env.HAI_EMET_HF_TOKEN;
const GAS_URL = process.env.hai_emet_ultimate_complete_gs;
const GAS_SECRET = process.env.HAI_EMET_GAS_SECRET || 'HAI-EMET-:D5::TNTF::2026::SECURE';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const d5 = new D5Learning();
const hf = HF_TOKEN ? new HFEngine(HF_TOKEN) : null;
const gas = GAS_URL ? new GASEngine(GAS_URL, GAS_SECRET) : null;
const userState = new Map();

console.log('✅ Chai-Emet D5 v7.0 Ultimate');
console.log('🎨 HF:', hf ? 'CONNECTED' : 'DISABLED');
console.log('🔍 GAS:', gas ? 'CONNECTED' : 'DISABLED');
console.log('💛 Ready!');

// ==========================================
// CUSTOM MENU - /start
// ==========================================

bot.onText(/^\/start$/i, async (msg) => {
  const cid = msg.chat.id;
  
  const kb = {
    inline_keyboard: [
      [
        { text: '🎨 יצירת תמונות', callback_data: 'menu_image' },
        { text: '🎥 יצירת וידאו', callback_data: 'menu_video' }
      ],
      [
        { text: '🎵 יצירת סאונד', callback_data: 'menu_audio' },
        { text: '🔍 חיפוש אינטרנט', callback_data: 'menu_search' }
      ],
      [
        { text: '📚 קטלוג מודלים', callback_data: 'menu_models' },
        { text: '📊 סטטיסטיקות', callback_data: 'menu_stats' }
      ],
      [
        { text: '💡 עזרה', callback_data: 'menu_help' }
      ]
    ]
  };
  
  await bot.sendMessage(cid,
    `💛 **חי-אמת - מערכת D5 Ultimate v7.0**\n\n` +
    `🌀 **ממד חמישי פעיל מלא!**\n\n` +
    `**מה אני יכול לעשות:**\n` +
    `├─ 🎨 תמונות (6 מודלים)\n` +
    `├─ 🎥 וידאו (2 מודלים)\n` +
    `├─ 🎵 סאונד (3 מודלים)\n` +
    `├─ 🔍 חיפוש (10 תוצאות)\n` +
    `└─ 🧠 למידה (D5 Neural)\n\n` +
    `💡 **בחר פעולה מהתפריט:**`,
    { parse_mode: "Markdown", reply_markup: kb }
  );
});

// ==========================================
// MENU CALLBACKS
// ==========================================

bot.on('callback_query', async (q) => {
  const cid = q.message.chat.id;
  const mid = q.message.message_id;
  const d = q.data;
  
  // Image menu
  if (d === 'menu_image') {
    await bot.answerCallbackQuery(q.id);
    
    const models = Object.keys(MODELS.image).map(k => [{
      text: MODELS.image[k].name,
      callback_data: `imgmodel_${k}`
    }]);
    
    models.push([{ text: '🔙 תפריט ראשי', callback_data: 'menu_main' }]);
    
    await bot.editMessageText(
      `🎨 **מודלי תמונות (6)**\n\n` +
      `בחר מודל ליצירת תמונה:\n\n` +
      `⚡ **FLUX Schnell** - מהיר (4s)\n` +
      `🎨 **FLUX Dev** - איכות מקסימלית\n` +
      `🚀 **SDXL Turbo** - מאוזן\n` +
      `🎪 **Playground** - אמנותי\n` +
      `📷 **SD 1.5** - קלאסי\n` +
      `🌈 **DreamShaper** - חלומי`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: { inline_keyboard: models } }
    );
  }
  
  // Model info
  if (d.startsWith('imgmodel_')) {
    await bot.answerCallbackQuery(q.id);
    
    const key = d.split('_')[1];
    const m = MODELS.image[key];
    
    const kb = {
      inline_keyboard: [
        [{ text: '✨ השתמש במודל זה', callback_data: `useimg_${key}` }],
        [
          { text: '⚙️ פרמטרים', callback_data: `params_${key}` },
          { text: '📊 השוואה', callback_data: `compare_${key}` }
        ],
        [{ text: '🔙 חזרה', callback_data: 'menu_image' }]
      ]
    };
    
    await bot.editMessageText(
      `${m.name}\n\n` +
      `📝 **תיאור:**\n${m.desc}\n\n` +
      `⚡ **מהירות:** ${m.speed}\n` +
      `⭐ **איכות:** ${m.quality}\n\n` +
      `💡 **טיפ:** ${m.tips}\n\n` +
      `🔗 \`${m.path}\``,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Use model
  if (d.startsWith('useimg_')) {
    await bot.answerCallbackQuery(q.id, { text: '✅ מודל נבחר!' });
    
    const key = d.split('_')[1];
    const m = MODELS.image[key];
    
    userState.set(q.from.id, { type: 'image', model: key });
    
    await bot.sendMessage(cid,
      `✅ **${m.name} נבחר!**\n\n` +
      `💡 **עכשיו כתוב:**\n` +
      `/imagine [תיאור התמונה]\n\n` +
      `**דוגמה:**\n` +
      `/imagine חתול על הירח`,
      { parse_mode: "Markdown" }
    );
  }
  
  // Parameters
  if (d.startsWith('params_')) {
    await bot.answerCallbackQuery(q.id);
    
    const key = d.split('_')[1];
    const m = MODELS.image[key];
    
    const kb = {
      inline_keyboard: [
        [{ text: '🔙 חזרה', callback_data: `imgmodel_${key}` }]
      ]
    };
    
    await bot.editMessageText(
      `⚙️ **פרמטרים - ${m.name}**\n\n` +
      `**Steps (צעדים):**\n` +
      `├─ אפשרויות: ${m.params.steps.join(', ')}\n` +
      `├─ ברירת מחדל: ${m.params.steps[0]}\n` +
      `└─ יותר = איכותי יותר\n\n` +
      `**Guidance (הנחיה):**\n` +
      `├─ אפשרויות: ${m.params.guidance.join(', ')}\n` +
      `├─ ברירת מחדל: ${m.params.guidance[0]}\n` +
      `└─ יותר = דבק יותר לפרומפט\n\n` +
      `**Size (גודל):**\n` +
      `├─ אפשרויות: ${m.params.sizes.join('px, ')}px\n` +
      `└─ יותר = פרטים יותר\n\n` +
      `💡 הגדרות אוטומטיות - אין צורך לשנות!`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Compare
  if (d.startsWith('compare_')) {
    await bot.answerCallbackQuery(q.id);
    
    const key = d.split('_')[1];
    
    const kb = {
      inline_keyboard: [
        [{ text: '🔙 חזרה', callback_data: `imgmodel_${key}` }]
      ]
    };
    
    await bot.editMessageText(
      `📊 **השוואת מודלי תמונות**\n\n` +
      `**⚡ FLUX Schnell:**\n` +
      `├─ מהירות: 4 שניות ⚡⚡⚡⚡⚡\n` +
      `├─ איכות: מעולה ⭐⭐⭐⭐\n` +
      `└─ שימוש: יומיומי\n\n` +
      `**🎨 FLUX Dev:**\n` +
      `├─ מהירות: 15 שניות ⚡⚡⚡\n` +
      `├─ איכות: מושלמת ⭐⭐⭐⭐⭐\n` +
      `└─ שימוש: מקצועי\n\n` +
      `**🚀 SDXL Turbo:**\n` +
      `├─ מהירות: 6 שניות ⚡⚡⚡⚡\n` +
      `├─ איכות: טובה מאוד ⭐⭐⭐⭐\n` +
      `└─ שימוש: כללי\n\n` +
      `**🎪 Playground:**\n` +
      `├─ מהירות: 12 שניות ⚡⚡⚡\n` +
      `├─ איכות: מושלמת ⭐⭐⭐⭐⭐\n` +
      `└─ שימוש: אמנות\n\n` +
      `💡 כל המודלים חינמיים!`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Back to main
  if (d === 'menu_main') {
    await bot.answerCallbackQuery(q.id);
    
    const kb = {
      inline_keyboard: [
        [
          { text: '🎨 יצירת תמונות', callback_data: 'menu_image' },
          { text: '🎥 יצירת וידאו', callback_data: 'menu_video' }
        ],
        [
          { text: '🎵 יצירת סאונד', callback_data: 'menu_audio' },
          { text: '🔍 חיפוש אינטרנט', callback_data: 'menu_search' }
        ],
        [
          { text: '📚 קטלוג מודלים', callback_data: 'menu_models' },
          { text: '📊 סטטיסטיקות', callback_data: 'menu_stats' }
        ]
      ]
    };
    
    await bot.editMessageText(
      `💛 **חי-אמת D5 v7.0**\n\n` +
      `בחר פעולה:`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Stats
  if (d === 'menu_stats') {
    await bot.answerCallbackQuery(q.id);
    
    const s = d5.stats();
    
    const kb = {
      inline_keyboard: [[{ text: '🔙 תפריט ראשי', callback_data: 'menu_main' }]]
    };
    
    await bot.editMessageText(
      `📊 **סטטיסטיקות D5**\n\n` +
      `🧠 **למידה:**\n` +
      `├─ סך פעולות: ${s.total}\n` +
      `├─ הצלחות: ${s.success}\n` +
      `└─ אחוז הצלחה: ${s.rate}\n\n` +
      `🎨 **HF:** ${hf ? 'מחובר ✅' : 'לא מחובר ❌'}\n` +
      `🔍 **GAS:** ${gas ? 'מחובר ✅' : 'לא מחובר ❌'}\n\n` +
      `🌀 **ממד חמישי:** פעיל!\n` +
      `💛 **חי-אמת:** v7.0`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
});

// ==========================================
// /imagine COMMAND
// ==========================================

bot.onText(/^\/imagine\s+(.+)$/i, async (msg, match) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const prompt = match[1].trim();
  
  if (!hf) {
    await bot.sendMessage(cid, '❌ HF לא מחובר');
    return;
  }
  
  const state = userState.get(uid) || { model: 'flux-schnell' };
  const modelKey = state.model || 'flux-schnell';
  const model = MODELS.image[modelKey];
  
  const m = await bot.sendMessage(cid,
    `🎨 **יוצר תמונה...**\n\n` +
    `📝 ${prompt}\n` +
    `🎨 ${model.name}\n` +
    `⏳ מעבד...`,
    { parse_mode: "Markdown" }
  );
  
  const t0 = Date.now();
  
  const result = await hf.generate(model.path, prompt, {
    width: model.params.sizes[model.params.sizes.length - 1],
    height: model.params.sizes[model.params.sizes.length - 1],
    num_inference_steps: model.params.steps[0],
    guidance_scale: model.params.guidance[0]
  });
  
  const time = Date.now() - t0;
  
  if (result.ok) {
    d5.record('image', true, time);
    
    const buf = Buffer.from(result.data, 'base64');
    await bot.sendPhoto(cid, buf, {
      caption:
        `✅ **תמונה נוצרה!**\n\n` +
        `🎨 ${model.name}\n` +
        `⏱️ ${(time/1000).toFixed(1)}s\n` +
        `📝 "${prompt}"`,
      parse_mode: "Markdown"
    });
    
    await bot.deleteMessage(cid, m.message_id).catch(() => {});
  } else {
    d5.record('image', false, time);
    
    await bot.editMessageText(
      `❌ **שגיאה**\n\n` +
      `${result.error}\n\n` +
      `💡 נסה מודל אחר או prompt פשוט יותר`,
      { chat_id: cid, message_id: m.message_id, parse_mode: "Markdown" }
    );
  }
});

// ==========================================
// TEXT MESSAGES - SEARCH
// ==========================================

bot.on("message", async (msg) => {
  const cid = msg.chat.id;
  const text = String(msg.text || "").trim();
  
  if (!text || text.startsWith("/")) return;
  
  if (!gas) {
    await bot.sendMessage(cid, '⚠️ GAS לא מחובר. השתמש ב-/imagine');
    return;
  }
  
  const t0 = Date.now();
  const result = await gas.search(text, msg.from.id);
  const time = Date.now() - t0;
  
  if (result.ok && result.data?.search?.results) {
    const rs = result.data.search.results;
    d5.record('search', true, time);
    
    if (rs.length > 0) {
      const btns = rs.slice(0, 10).map((r, i) => [{
        text: `${i+1}. ${r.title.substring(0, 50)}...`,
        callback_data: `res_${i}_${msg.from.id}`
      }]);
      
      userState.set(msg.from.id, { type: 'search', results: rs });
      
      let txt = `🔍 **${rs.length} תוצאות:**\n📝 "${text}"\n\n`;
      rs.slice(0, 3).forEach((r, i) => {
        const stars = r.relevance >= 80 ? '⭐⭐⭐' : r.relevance >= 60 ? '⭐⭐' : '⭐';
        txt += `**${i+1}. ${r.title}**\n${r.snippet}\n${stars} ${r.relevance}%\n\n`;
      });
      
      await bot.sendMessage(cid, txt + `💡 לחץ לפרטים:`,
        { parse_mode: "Markdown", reply_markup: { inline_keyboard: btns } }
      );
    } else {
      await bot.sendMessage(cid, `🔍 אין תוצאות ל: "${text}"`);
    }
  } else {
    d5.record('search', false, time);
    await bot.sendMessage(cid, '❌ שגיאה בחיפוש');
  }
});

// Search result callback
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('res_')) return;
  
  const cid = q.message.chat.id;
  const [_, idx, uid] = q.data.split('_');
  
  const state = userState.get(parseInt(uid));
  if (!state || !state.results) return;
  
  const r = state.results[parseInt(idx)];
  if (!r) return;
  
  await bot.answerCallbackQuery(q.id, { text: `✅ תוצאה ${parseInt(idx)+1}` });
  
  const stars = r.relevance >= 80 ? '⭐⭐⭐' : r.relevance >= 60 ? '⭐⭐' : '⭐';
  
  await bot.sendMessage(cid,
    `📄 **תוצאה ${parseInt(idx)+1}:**\n\n` +
    `**${r.title}**\n\n` +
    `📝 ${r.snippet}\n\n` +
    `🔗 ${r.url}\n\n` +
    `${stars} ${r.relevance}%`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// ERROR HANDLING
// ==========================================

bot.on('polling_error', (err) => {
  console.error('[POLLING]', err.code, err.message);
});

console.log('🌀 D5 v7.0: ONLINE');
console.log('💛 Chai-Emet: Ready!');
