// ==========================================
// CHAI-EMET D5 v11.0 FINAL
// ✅ Only Working Features
// ✅ PayPal Integration
// ✅ Clean & Production Ready
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const http = require("http");

// HTTP Server
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'online', version: '11.0-FINAL' }));
}).listen(PORT, () => console.log(`🌐 Port ${PORT}`));

// ==========================================
// CONFIG
// ==========================================

const CFG = {
  version: '11.0-FINAL',
  
  // HET Token Economics
  het: {
    startBonus: 200,        // Free HET for new users
    image: 1,               // Cost per image
    search: 0.1,            // Cost per search
    enhance: 0.5            // Cost for prompt enhancement
  },
  
  // PayPal Integration
  paypal: {
    enabled: true,
    paypalMe: 'https://paypal.me/haiemetcoreai',
    adminUsername: '@TNTF007',
    
    packages: [
      {
        id: 'small',
        het: 100,
        usd: 1,
        link: 'https://paypal.me/haiemetcoreai/1'
      },
      {
        id: 'medium',
        het: 500,
        usd: 4,
        link: 'https://paypal.me/haiemetcoreai/4'
      },
      {
        id: 'large',
        het: 1000,
        usd: 7,
        link: 'https://paypal.me/haiemetcoreai/7'
      }
    ]
  },
  
  // Admin
  adminId: 60601218 // TNTF - נתניאל ניסים
};

// ==========================================
// 10 STABLE MODELS
// ==========================================

const MODELS = {
  'flux': {
    name: '⚡ FLUX',
    desc: 'מהיר ביותר - 2s',
    icon: '⚡',
    speed: 5,
    quality: 4
  },
  'flux-realism': {
    name: '📷 Realism',
    desc: 'ריאליסטי מאוד',
    icon: '📷',
    speed: 4,
    quality: 5
  },
  'flux-anime': {
    name: '🎨 Anime',
    desc: 'סגנון אנימה',
    icon: '🎨',
    speed: 4,
    quality: 4
  },
  'dreamshaper': {
    name: '🌈 Dream',
    desc: 'חלומי ויצירתי',
    icon: '🌈',
    speed: 3,
    quality: 4
  },
  'playground': {
    name: '🎪 Playground',
    desc: 'אמנותי מאוד',
    icon: '🎪',
    speed: 3,
    quality: 5
  },
  'flux-3d': {
    name: '🎭 3D',
    desc: 'תלת מימד',
    icon: '🎭',
    speed: 4,
    quality: 4
  },
  'turbo': {
    name: '🚀 Turbo',
    desc: 'סופר מהיר - 1s',
    icon: '🚀',
    speed: 5,
    quality: 3
  },
  'deliberate': {
    name: '🎯 Deliberate',
    desc: 'מדויק ופרטני',
    icon: '🎯',
    speed: 3,
    quality: 5
  },
  'realvis': {
    name: '📸 RealVis',
    desc: 'ריאליזם מוחלט',
    icon: '📸',
    speed: 3,
    quality: 5
  },
  'openjourney': {
    name: '🗺️ Journey',
    desc: 'Midjourney style',
    icon: '🗺️',
    speed: 3,
    quality: 4
  }
};

// ==========================================
// ENGINES
// ==========================================

class DataCollector {
  constructor(gasUrl, gasSecret) {
    this.gasUrl = gasUrl;
    this.gasSecret = gasSecret;
    this.enabled = !!gasUrl;
  }
  
  async save(data) {
    if (!this.enabled) return { ok: false };
    try {
      const url = `${this.gasUrl}?action=saveData&secret=${this.gasSecret}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toISOString(), ...data })
      });
      return await res.json();
    } catch (err) {
      return { ok: false };
    }
  }
  
  async getPatterns(userId) {
    if (!this.enabled) return { ok: false };
    try {
      const url = `${this.gasUrl}?action=getPatterns&userId=${userId}&secret=${this.gasSecret}`;
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      return { ok: false };
    }
  }
  
  async getStats() {
    if (!this.enabled) return { ok: false };
    try {
      const url = `${this.gasUrl}?action=getStats&secret=${this.gasSecret}`;
      const res = await fetch(url);
      return await res.json();
    } catch (err) {
      return { ok: false };
    }
  }
}

class HETSystem {
  constructor(dc) {
    this.dc = dc;
    this.balances = new Map();
  }
  
  async getBalance(userId) {
    if (this.balances.has(userId)) {
      return this.balances.get(userId);
    }
    const balance = CFG.het.startBonus;
    this.balances.set(userId, balance);
    await this.dc.save({
      type: 'transaction',
      userId,
      amount: balance,
      action: 'initial_bonus',
      balanceAfter: balance
    });
    return balance;
  }
  
  async charge(userId, amount, type) {
    const balance = await this.getBalance(userId);
    if (balance < amount) {
      return { ok: false, error: 'Insufficient HET', balance };
    }
    const newBalance = balance - amount;
    this.balances.set(userId, newBalance);
    await this.dc.save({
      type: 'transaction',
      userId,
      amount: -amount,
      action: type,
      balanceBefore: balance,
      balanceAfter: newBalance
    });
    return { ok: true, balance: newBalance };
  }
  
  async add(userId, amount, reason) {
    const balance = await this.getBalance(userId);
    const newBalance = balance + amount;
    this.balances.set(userId, newBalance);
    await this.dc.save({
      type: 'transaction',
      userId,
      amount: +amount,
      action: reason,
      balanceBefore: balance,
      balanceAfter: newBalance
    });
    return { ok: true, balance: newBalance };
  }
}

class PollinationsEngine {
  constructor() {
    this.baseUrl = "https://image.pollinations.ai/prompt";
  }
  
  async generate(prompt, model, size) {
    const t0 = Date.now();
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const url = `${this.baseUrl}/${encodeURIComponent(prompt)}` +
        `?model=${model}&width=${size}&height=${size}&seed=${seed}&nologo=true&enhance=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      return { ok: true, data: buf.toString('base64'), time: Date.now() - t0 };
    } catch (err) {
      return { ok: false, error: err.message, time: Date.now() - t0 };
    }
  }
}

class GASEngine {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
    this.enabled = !!url;
  }
  
  async search(q, userId) {
    if (!this.enabled) return { ok: false };
    try {
      const url = `${this.url}?action=search&q=${encodeURIComponent(q)}&userId=${userId}&secret=${this.secret}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.ok ? { ok: true, data } : { ok: false };
    } catch (err) {
      return { ok: false };
    }
  }
}

class PromptEnhancer {
  enhance(prompt) {
    let enhanced = prompt.trim();
    if (!enhanced.match(/quality|detailed|professional/i)) {
      enhanced += ', high quality, detailed';
    }
    const translations = {
      'חתול': 'cat', 'כלב': 'dog', 'ים': 'sea ocean',
      'הר': 'mountain', 'עץ': 'tree', 'בית': 'house'
    };
    for (const [heb, eng] of Object.entries(translations)) {
      enhanced = enhanced.replace(new RegExp(heb, 'g'), eng);
    }
    return enhanced;
  }
}

// ==========================================
// INIT
// ==========================================

const BOT_TOKEN = process.env.BOT_TOKEN;
const GAS_URL = process.env.hai_emet_ultimate_complete_gs;
const GAS_SECRET = process.env.HAI_EMET_GAS_SECRET || 'HAI-EMET-:D5::TNTF::2026::SECURE';

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const dc = new DataCollector(GAS_URL, GAS_SECRET);
const het = new HETSystem(dc);
const poll = new PollinationsEngine();
const gas = new GASEngine(GAS_URL, GAS_SECRET);
const promptEnhancer = new PromptEnhancer();
const userState = new Map();

console.log('✅ Chai-Emet D5 v11.0 FINAL');
console.log('🎨 Models: 10');
console.log('💰 PayPal: Ready');
console.log('💛 Production Ready!');

// ==========================================
// MENUS
// ==========================================

function getMainMenu() {
  return {
    inline_keyboard: [
      [{ text: '🎨 יצירת תמונות', callback_data: 'menu_image' }],
      [
        { text: '💰 חשבון HET', callback_data: 'menu_account' },
        { text: '📊 סטטיסטיקות', callback_data: 'menu_stats' }
      ]
    ]
  };
}

function getImageMenu() {
  const buttons = Object.keys(MODELS).map(key => {
    const m = MODELS[key];
    return [{ text: `${m.icon} ${m.name}`, callback_data: `model_${key}` }];
  });
  buttons.push([{ text: '🔙 חזרה', callback_data: 'menu_main' }]);
  return { inline_keyboard: buttons };
}

function getPayPalMenu() {
  const buttons = CFG.paypal.packages.map(pkg => [{
    text: `💎 ${pkg.het} HET - $${pkg.usd}`,
    url: pkg.link
  }]);
  buttons.push([{ text: '📧 שלחתי תשלום', callback_data: 'paypal_notify' }]);
  buttons.push([{ text: '🔙 חזרה', callback_data: 'menu_account' }]);
  return { inline_keyboard: buttons };
}

// ==========================================
// /start
// ==========================================

bot.onText(/^\/start$/i, async (msg) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const balance = await het.getBalance(uid);
  
  await bot.sendMessage(cid,
    `💛 **חי-אמת AI בוט**\n\n` +
    `🎨 **10 מודלי תמונות**\n` +
    `├─ תמיד עובדים ✅\n` +
    `├─ מהירים (1-3s) ⚡\n` +
    `└─ איכות מעולה ⭐\n\n` +
    `💰 **יתרה שלך: ${balance} HET**\n` +
    `├─ תמונה: ${CFG.het.image} HET\n` +
    `├─ חיפוש: ${CFG.het.search} HET\n` +
    `└─ שיפור: ${CFG.het.enhance} HET\n\n` +
    `💡 **פקודות:**\n` +
    `/imagine [תיאור] - יצירת תמונה\n` +
    `/enhance [תיאור] - שיפור prompt\n\n` +
    `🔍 **חיפוש:** פשוט כתוב שאלה`,
    { parse_mode: "Markdown", reply_markup: getMainMenu() }
  );
});

// ==========================================
// CALLBACKS
// ==========================================

bot.on('callback_query', async (q) => {
  const cid = q.message.chat.id;
  const mid = q.message.message_id;
  const uid = q.from.id;
  const d = q.data;
  
  if (d === 'menu_main') {
    await bot.answerCallbackQuery(q.id);
    await bot.editMessageText(
      `💛 **חי-אמת AI בוט**\n\nבחר:`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: getMainMenu() }
    );
  }
  
  if (d === 'menu_image') {
    await bot.answerCallbackQuery(q.id);
    await bot.editMessageText(
      `🎨 **10 מודלים**\n\nבחר מודל:`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: getImageMenu() }
    );
  }
  
  if (d.startsWith('model_')) {
    const key = d.split('_')[1];
    const m = MODELS[key];
    await bot.answerCallbackQuery(q.id);
    
    await bot.editMessageText(
      `${m.icon} **${m.name}**\n\n` +
      `📝 ${m.desc}\n\n` +
      `⚡ מהירות: ${'⚡'.repeat(m.speed)}\n` +
      `⭐ איכות: ${'⭐'.repeat(m.quality)}\n` +
      `💰 עלות: ${CFG.het.image} HET`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '✨ השתמש', callback_data: `use_${key}` }],
            [{ text: '🔙 חזרה', callback_data: 'menu_image' }]
          ]
        }
      }
    );
  }
  
  if (d.startsWith('use_')) {
    const key = d.split('_')[1];
    const m = MODELS[key];
    await bot.answerCallbackQuery(q.id, { text: `✅ ${m.name} נבחר!` });
    userState.set(uid, { model: key });
    const balance = await het.getBalance(uid);
    
    await bot.sendMessage(cid,
      `✅ **${m.name} נבחר!**\n\n` +
      `💰 יתרה: ${balance} HET\n\n` +
      `/imagine [תיאור]`,
      { parse_mode: "Markdown" }
    );
  }
  
  if (d === 'menu_account') {
    await bot.answerCallbackQuery(q.id);
    const balance = await het.getBalance(uid);
    const patterns = await dc.getPatterns(uid);
    
    let txt = `💰 **חשבון HET**\n\n💵 יתרה: ${balance} HET\n\n`;
    
    if (patterns.ok && patterns.data) {
      txt += `📊 **שימוש:**\n` +
        `├─ תמונות: ${patterns.data.totalImages || 0}\n` +
        `├─ חיפושים: ${patterns.data.totalSearches || 0}\n` +
        `└─ HET שהוצאו: ${patterns.data.totalHETSpent || 0}\n\n`;
    }
    
    await bot.editMessageText(txt, {
      chat_id: cid,
      message_id: mid,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: '💎 קנה HET', callback_data: 'buy_het' }],
          [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
        ]
      }
    });
  }
  
  if (d === 'buy_het') {
    await bot.answerCallbackQuery(q.id);
    
    await bot.editMessageText(
      `💳 **קנה HET דרך PayPal**\n\n` +
      `💎 **חבילות:**\n` +
      `├─ 100 HET = $1\n` +
      `├─ 500 HET = $4\n` +
      `└─ 1000 HET = $7\n\n` +
      `**איך:**\n` +
      `1. לחץ על חבילה\n` +
      `2. שלם דרך PayPal\n` +
      `3. לחץ "שלחתי תשלום"\n` +
      `4. HET יתווסף תוך דקות!\n\n` +
      `✅ בטוח ומאובטח`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: getPayPalMenu()
      }
    );
  }
  
  if (d === 'paypal_notify') {
    await bot.answerCallbackQuery(q.id, { text: '✅ קיבלנו!' });
    
    await bot.sendMessage(cid,
      `✅ **תודה!**\n\n` +
      `קיבלנו את ההודעה.\n` +
      `בודקים את התשלום.\n\n` +
      `HET יתווסף תוך 5-10 דקות.\n\n` +
      `📧 שאלות? ${CFG.paypal.adminUsername}`,
      { parse_mode: "Markdown" }
    );
    
    // Notify admin
    if (CFG.adminId > 0) {
      await bot.sendMessage(CFG.adminId,
        `🔔 **תשלום חדש!**\n\n` +
        `User ID: ${uid}\n` +
        `Username: @${q.from.username || 'none'}\n` +
        `Name: ${q.from.first_name}\n\n` +
        `המשתמש אמר ששילם.\n` +
        `בדוק PayPal והוסף HET:\n\n` +
        `/addhet ${uid} 100`
      ).catch(() => {});
    }
  }
  
  if (d === 'menu_stats') {
    await bot.answerCallbackQuery(q.id);
    const stats = await dc.getStats();
    
    let txt = `📊 **סטטיסטיקות**\n\n`;
    
    if (stats.ok && stats.data) {
      txt += `🌍 **גלובלי:**\n` +
        `├─ משתמשים: ${stats.data.totalUsers || 0}\n` +
        `├─ תמונות: ${stats.data.totalImages || 0}\n` +
        `├─ חיפושים: ${stats.data.totalSearches || 0}\n` +
        `└─ HET שהוצאו: ${stats.data.totalHETSpent || 0}\n\n` +
        `🔥 פופולרי: ${stats.data.popularModel || 'FLUX'}`;
    }
    
    await bot.editMessageText(txt, {
      chat_id: cid,
      message_id: mid,
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [[{ text: '🔙', callback_data: 'menu_main' }]] }
    });
  }
});

// ==========================================
// /imagine
// ==========================================

bot.onText(/^\/imagine\s+(.+)$/i, async (msg, match) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const prompt = match[1].trim();
  const state = userState.get(uid) || { model: 'flux' };
  const modelKey = state.model;
  const model = MODELS[modelKey];
  
  const balance = await het.getBalance(uid);
  if (balance < CFG.het.image) {
    await bot.sendMessage(cid,
      `❌ **אין מספיק HET**\n\nיתרה: ${balance}\nצריך: ${CFG.het.image}`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  await het.charge(uid, CFG.het.image, 'image');
  
  const m = await bot.sendMessage(cid,
    `🎨 **יוצר...**\n${model.icon} ${model.name}\n⏳ רגע...`,
    { parse_mode: "Markdown" }
  );
  
  const t0 = Date.now();
  const result = await poll.generate(prompt, modelKey, 1024);
  const timeMs = Date.now() - t0;
  
  if (result.ok) {
    await dc.save({
      type: 'image',
      userId: uid,
      prompt,
      model: modelKey,
      success: true,
      time: timeMs,
      hetSpent: CFG.het.image
    });
    
    const buf = Buffer.from(result.data, 'base64');
    const newBalance = await het.getBalance(uid);
    
    await bot.sendPhoto(cid, buf, {
      caption:
        `✅ ${model.icon} ${model.name}\n` +
        `⏱️ ${(timeMs/1000).toFixed(1)}s\n` +
        `📝 "${prompt}"\n` +
        `💰 ${newBalance} HET`,
      parse_mode: "Markdown"
    });
    
    await bot.deleteMessage(cid, m.message_id).catch(() => {});
  } else {
    await het.add(uid, CFG.het.image, 'refund');
    await bot.editMessageText(
      `❌ שגיאה\n\n${result.error}\n💰 HET הוחזרו`,
      { chat_id: cid, message_id: m.message_id, parse_mode: "Markdown" }
    );
  }
});

// ==========================================
// /enhance
// ==========================================

bot.onText(/^\/enhance\s+(.+)$/i, async (msg, match) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const prompt = match[1].trim();
  
  const balance = await het.getBalance(uid);
  if (balance < CFG.het.enhance) {
    await bot.sendMessage(cid, `❌ צריך ${CFG.het.enhance} HET`);
    return;
  }
  
  await het.charge(uid, CFG.het.enhance, 'enhance');
  const enhanced = promptEnhancer.enhance(prompt);
  const newBalance = await het.getBalance(uid);
  
  await bot.sendMessage(cid,
    `🤖 **Prompt משופר!**\n\n` +
    `**מקור:**\n${prompt}\n\n` +
    `**משופר:**\n${enhanced}\n\n` +
    `💰 ${newBalance} HET\n\n` +
    `/imagine ${enhanced}`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// SEARCH
// ==========================================

bot.on("message", async (msg) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const text = String(msg.text || "").trim();
  
  if (!text || text.startsWith("/")) return;
  if (!gas.enabled) return;
  
  const balance = await het.getBalance(uid);
  if (balance < CFG.het.search) return;
  
  await het.charge(uid, CFG.het.search, 'search');
  
  const t0 = Date.now();
  const result = await gas.search(text, uid);
  const timeMs = Date.now() - t0;
  
  if (result.ok && result.data?.search?.results) {
    const rs = result.data.search.results;
    
    await dc.save({
      type: 'search',
      userId: uid,
      query: text,
      results: rs.length,
      success: true,
      time: timeMs,
      hetSpent: CFG.het.search
    });
    
    if (rs.length > 0) {
      const btns = rs.slice(0, 10).map((r, i) => [{
        text: `${i+1}. ${r.title.substring(0, 50)}...`,
        callback_data: `res_${i}_${uid}`
      }]);
      
      userState.set(uid, { ...userState.get(uid), results: rs });
      
      let txt = `🔍 **${rs.length} תוצאות**\n\n`;
      rs.slice(0, 3).forEach((r, i) => {
        const stars = r.relevance >= 80 ? '⭐⭐⭐' : r.relevance >= 60 ? '⭐⭐' : '⭐';
        txt += `**${i+1}. ${r.title}**\n${r.snippet}\n${stars}\n\n`;
      });
      
      const newBalance = await het.getBalance(uid);
      txt += `⏱️ ${(timeMs/1000).toFixed(1)}s | 💰 ${newBalance} HET`;
      
      await bot.sendMessage(cid, txt, {
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: btns }
      });
    }
  }
});

bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('res_')) return;
  
  const cid = q.message.chat.id;
  const [_, idx, uid] = q.data.split('_');
  const state = userState.get(parseInt(uid));
  
  if (!state?.results) return;
  
  const r = state.results[parseInt(idx)];
  if (!r) return;
  
  await bot.answerCallbackQuery(q.id);
  
  await bot.sendMessage(cid,
    `📄 **${r.title}**\n\n${r.snippet}\n\n🔗 ${r.url}`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// ADMIN: /addhet
// ==========================================

bot.onText(/^\/addhet\s+(\d+)\s+(\d+)$/i, async (msg, match) => {
  if (CFG.adminId === 0 || msg.from.id !== CFG.adminId) {
    return;
  }
  
  const userId = parseInt(match[1]);
  const amount = parseInt(match[2]);
  
  await het.add(userId, amount, 'admin_purchase');
  const newBalance = await het.getBalance(userId);
  
  await bot.sendMessage(msg.chat.id,
    `✅ הוספתי ${amount} HET\n\n` +
    `User: ${userId}\n` +
    `יתרה: ${newBalance} HET`
  );
  
  try {
    await bot.sendMessage(userId,
      `💰 **HET נוסף!**\n\n` +
      `+${amount} HET\n` +
      `יתרה: ${newBalance} HET\n\n` +
      `✅ תודה על הרכישה!`
    );
  } catch (err) {}
});

bot.on('polling_error', (err) => console.error('[POLL]', err.code));

console.log('🌀 v11.0 FINAL: ONLINE');
console.log('💛 Clean & Ready!');
