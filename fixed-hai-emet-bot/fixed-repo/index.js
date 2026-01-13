// ==========================================
// CHAI-EMET D5 v9.0 - DATA COLLECTION
// Complete Learning System
// HET Token Integration
// Pattern Recognition
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const http = require("http");

// HTTP Server
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'online', version: '9.0-DATA' }));
}).listen(PORT, () => console.log(`🌐 Port ${PORT}`));

// ==========================================
// CONFIGURATION
// ==========================================

const CONFIG = {
  version: '9.0-DATA',
  dataCollection: true,
  hetTracking: true,
  patternLearning: true,
  
  // HET Token Economics
  het: {
    image: 1,      // 1 HET per image
    search: 0.1,   // 0.1 HET per search
    video: 5,      // 5 HET per video
    audio: 2       // 2 HET per audio
  }
};

// ==========================================
// MODELS DATABASE
// ==========================================

const MODELS = {
  image: {
    'flux': {
      name: '⚡ FLUX',
      desc: 'מהיר ביותר\n2 שניות\nאיכות מעולה',
      icon: '⚡',
      speed: 5,
      quality: 4,
      cost: 1
    },
    'flux-realism': {
      name: '📷 Realism',
      desc: 'ריאליסטי\nפוטוגרפי\nפרטים דקים',
      icon: '📷',
      speed: 4,
      quality: 5,
      cost: 1
    },
    'flux-anime': {
      name: '🎨 Anime',
      desc: 'סגנון אנימה\nצבעים חיים\nאמנותי',
      icon: '🎨',
      speed: 4,
      quality: 4,
      cost: 1
    },
    'dreamshaper': {
      name: '🌈 Dream',
      desc: 'חלומי\nיצירתי\nמדהים',
      icon: '🌈',
      speed: 3,
      quality: 4,
      cost: 1
    },
    'playground': {
      name: '🎪 Playground',
      desc: 'אמנותי\nצבעוני\nייחודי',
      icon: '🎪',
      speed: 3,
      quality: 5,
      cost: 1
    }
  }
};

// ==========================================
// DATA COLLECTION SYSTEM
// ==========================================

class DataCollector {
  constructor(gasUrl, gasSecret) {
    this.gasUrl = gasUrl;
    this.gasSecret = gasSecret;
    this.enabled = !!gasUrl;
  }
  
  async save(data) {
    if (!this.enabled) {
      console.log('[DATA] GAS not configured - skipping');
      return { ok: false };
    }
    
    try {
      const url = `${this.gasUrl}?action=saveData&secret=${this.gasSecret}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          ...data
        })
      });
      
      const result = await res.json();
      
      if (result.ok) {
        console.log('[DATA] Saved:', data.type, data.model || '');
      } else {
        console.error('[DATA] Save failed:', result.error);
      }
      
      return result;
    } catch (err) {
      console.error('[DATA] Error:', err.message);
      return { ok: false, error: err.message };
    }
  }
  
  async getPatterns(userId) {
    if (!this.enabled) return { ok: false };
    
    try {
      const url = `${this.gasUrl}?action=getPatterns&userId=${userId}&secret=${this.gasSecret}`;
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
  
  async getStats() {
    if (!this.enabled) return { ok: false };
    
    try {
      const url = `${this.gasUrl}?action=getStats&secret=${this.gasSecret}`;
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }
}

// ==========================================
// HET TOKEN SYSTEM
// ==========================================

class HETSystem {
  constructor(dataCollector) {
    this.dc = dataCollector;
    this.balances = new Map(); // In-memory cache
  }
  
  async getBalance(userId) {
    if (this.balances.has(userId)) {
      return this.balances.get(userId);
    }
    
    // Default balance for new users
    const balance = 100; // Start with 100 HET
    this.balances.set(userId, balance);
    return balance;
  }
  
  async charge(userId, amount, type) {
    const balance = await this.getBalance(userId);
    
    if (balance < amount) {
      return { ok: false, error: 'Insufficient HET', balance };
    }
    
    const newBalance = balance - amount;
    this.balances.set(userId, newBalance);
    
    // Save transaction
    await this.dc.save({
      type: 'transaction',
      userId,
      amount: -amount,
      action: type,
      balanceBefore: balance,
      balanceAfter: newBalance
    });
    
    console.log(`[HET] User ${userId}: ${balance} -> ${newBalance} (-${amount} ${type})`);
    
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

// ==========================================
// POLLINATIONS ENGINE
// ==========================================

class PollinationsEngine {
  constructor() {
    this.baseUrl = "https://image.pollinations.ai/prompt";
  }
  
  async generate(prompt, model, size) {
    const t0 = Date.now();
    
    try {
      const enhancedPrompt = `${prompt}, high quality, detailed`;
      const seed = Math.floor(Math.random() * 1000000);
      
      const url = `${this.baseUrl}/${encodeURIComponent(enhancedPrompt)}` +
        `?model=${model}` +
        `&width=${size}` +
        `&height=${size}` +
        `&seed=${seed}` +
        `&nologo=true` +
        `&enhance=true`;
      
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const buf = Buffer.from(await res.arrayBuffer());
      const time = Date.now() - t0;
      
      console.log(`[POLL] ${model} ${size}x${size} (${time}ms)`);
      
      return {
        ok: true,
        data: buf.toString('base64'),
        time,
        size: buf.length
      };
    } catch (err) {
      const time = Date.now() - t0;
      console.error(`[POLL] Error: ${err.message}`);
      return { ok: false, error: err.message, time };
    }
  }
}

// ==========================================
// GAS SEARCH ENGINE
// ==========================================

class GASEngine {
  constructor(url, secret) {
    this.url = url;
    this.secret = secret;
    this.enabled = !!url;
  }
  
  async search(q, userId) {
    if (!this.enabled) return { ok: false, error: 'GAS not configured' };
    
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
const userState = new Map();

console.log('✅ Chai-Emet D5 v9.0 DATA');
console.log('💾 Data Collection:', dc.enabled ? 'ENABLED' : 'DISABLED');
console.log('💰 HET Tracking: ENABLED');
console.log('🔍 GAS:', gas.enabled ? 'ENABLED' : 'DISABLED');
console.log('🎨 Models: 5');
console.log('💛 Ready!');

// ==========================================
// IMPROVED MENU SYSTEM
// ==========================================

function getMainMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🎨 תמונות (5 מודלים)', callback_data: 'menu_image' }
      ],
      [
        { text: '🔍 חיפוש באינטרנט', callback_data: 'menu_search' }
      ],
      [
        { text: '💰 חשבון HET שלי', callback_data: 'menu_account' },
        { text: '📊 סטטיסטיקות', callback_data: 'menu_stats' }
      ],
      [
        { text: '💡 עזרה ומדריך', callback_data: 'menu_help' }
      ]
    ]
  };
}

function getImageMenu() {
  const buttons = Object.keys(MODELS.image).map(key => {
    const m = MODELS.image[key];
    return [{
      text: `${m.icon} ${m.name} (${m.cost} HET)`,
      callback_data: `model_${key}`
    }];
  });
  
  buttons.push([{ text: '🔙 חזרה', callback_data: 'menu_main' }]);
  
  return { inline_keyboard: buttons };
}

// ==========================================
// /start COMMAND
// ==========================================

bot.onText(/^\/start$/i, async (msg) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  
  // Give welcome bonus
  const balance = await het.getBalance(uid);
  if (balance === 100) {
    await het.add(uid, 50, 'welcome_bonus');
  }
  
  const currentBalance = await het.getBalance(uid);
  
  await bot.sendMessage(cid,
    `💛 **חי-אמת D5 v9.0**\n\n` +
    `🎨 **מערכת יצירת תמונות**\n` +
    `├─ 5 מודלים יציבים\n` +
    `├─ תמיד עובד ✅\n` +
    `├─ מהיר (1-3s)\n` +
    `└─ איכות מעולה\n\n` +
    `💰 **מערכת HET**\n` +
    `├─ יתרה: ${currentBalance} HET\n` +
    `├─ תמונה: ${CONFIG.het.image} HET\n` +
    `└─ חיפוש: ${CONFIG.het.search} HET\n\n` +
    `💾 **למידה חכמה**\n` +
    `├─ כל פעולה נשמרת\n` +
    `├─ המערכת לומדת\n` +
    `└─ משתפרת כל הזמן\n\n` +
    `💡 בחר פעולה:`,
    { parse_mode: "Markdown", reply_markup: getMainMenu() }
  );
});

// ==========================================
// MENU CALLBACKS
// ==========================================

bot.on('callback_query', async (q) => {
  const cid = q.message.chat.id;
  const mid = q.message.message_id;
  const uid = q.from.id;
  const d = q.data;
  
  // Main menu
  if (d === 'menu_main') {
    await bot.answerCallbackQuery(q.id);
    await bot.editMessageText(
      `💛 **חי-אמת D5 v9.0**\n\nבחר פעולה:`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: getMainMenu() }
    );
  }
  
  // Image menu
  if (d === 'menu_image') {
    await bot.answerCallbackQuery(q.id);
    await bot.editMessageText(
      `🎨 **מודלי תמונות (5)**\n\n` +
      `בחר מודל ליצירה:\n\n` +
      `⚡ מהיר | 📷 ריאליסטי | 🎨 אנימה\n` +
      `🌈 חלומי | 🎪 אמנותי\n\n` +
      `💰 עלות: 1 HET לתמונה`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: getImageMenu() }
    );
  }
  
  // Model info
  if (d.startsWith('model_')) {
    const key = d.split('_')[1];
    const m = MODELS.image[key];
    
    await bot.answerCallbackQuery(q.id);
    
    const kb = {
      inline_keyboard: [
        [{ text: '✨ השתמש במודל זה', callback_data: `use_${key}` }],
        [{ text: '🔙 חזרה', callback_data: 'menu_image' }]
      ]
    };
    
    await bot.editMessageText(
      `${m.icon} **${m.name}**\n\n` +
      `📝 ${m.desc}\n\n` +
      `⚡ מהירות: ${'⚡'.repeat(m.speed)}\n` +
      `⭐ איכות: ${'⭐'.repeat(m.quality)}\n` +
      `💰 עלות: ${m.cost} HET\n\n` +
      `✅ תמיד עובד - בלי שגיאות!`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Use model
  if (d.startsWith('use_')) {
    const key = d.split('_')[1];
    const m = MODELS.image[key];
    
    await bot.answerCallbackQuery(q.id, { text: `✅ ${m.name} נבחר!` });
    
    userState.set(uid, { model: key });
    
    const balance = await het.getBalance(uid);
    
    await bot.sendMessage(cid,
      `✅ **${m.name} נבחר!**\n\n` +
      `💰 יתרה: ${balance} HET\n` +
      `💵 עלות: ${m.cost} HET\n\n` +
      `📝 **כתוב:**\n` +
      `/imagine [תיאור התמונה]\n\n` +
      `**דוגמה:**\n` +
      `/imagine חתול על הירח`,
      { parse_mode: "Markdown" }
    );
  }
  
  // Account
  if (d === 'menu_account') {
    await bot.answerCallbackQuery(q.id);
    
    const balance = await het.getBalance(uid);
    const patterns = await dc.getPatterns(uid);
    
    const kb = {
      inline_keyboard: [
        [{ text: '💎 קנה HET', callback_data: 'buy_het' }],
        [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
      ]
    };
    
    let patternText = '';
    if (patterns.ok && patterns.data) {
      patternText = `\n📊 **דפוסים:**\n` +
        `├─ תמונות: ${patterns.data.totalImages || 0}\n` +
        `├─ מודל אהוב: ${patterns.data.favoriteModel || 'אין'}\n` +
        `└─ חיפושים: ${patterns.data.totalSearches || 0}`;
    }
    
    await bot.editMessageText(
      `💰 **חשבון HET שלך**\n\n` +
      `💵 יתרה: ${balance} HET\n\n` +
      `📊 **מחירון:**\n` +
      `├─ תמונה: ${CONFIG.het.image} HET\n` +
      `├─ חיפוש: ${CONFIG.het.search} HET\n` +
      `├─ וידאו: ${CONFIG.het.video} HET\n` +
      `└─ סאונד: ${CONFIG.het.audio} HET${patternText}`,
      { chat_id: cid, message_id: mid, parse_mode: "Markdown", reply_markup: kb }
    );
  }
  
  // Stats
  if (d === 'menu_stats') {
    await bot.answerCallbackQuery(q.id);
    
    const stats = await dc.getStats();
    
    const kb = {
      inline_keyboard: [[{ text: '🔙 חזרה', callback_data: 'menu_main' }]]
    };
    
    let statsText = `💾 **Data Collection:** ${dc.enabled ? 'פעיל ✅' : 'לא פעיל ❌'}\n\n`;
    
    if (stats.ok && stats.data) {
      statsText += `📊 **סטטיסטיקות כלליות:**\n` +
        `├─ סך תמונות: ${stats.data.totalImages || 0}\n` +
        `├─ סך חיפושים: ${stats.data.totalSearches || 0}\n` +
        `├─ משתמשים: ${stats.data.totalUsers || 0}\n` +
        `└─ HET שהוצאו: ${stats.data.totalHETSpent || 0}\n\n` +
        `🔥 **פופולרי:**\n` +
        `└─ ${stats.data.popularModel || 'FLUX'}`;
    } else {
      statsText += `⚠️ GAS לא מחובר - אין סטטיסטיקות`;
    }
    
    await bot.editMessageText(
      `📊 **סטטיסטיקות מערכת**\n\n${statsText}`,
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
  
  const state = userState.get(uid) || { model: 'flux' };
  const modelKey = state.model;
  const model = MODELS.image[modelKey];
  
  // Check HET balance
  const balance = await het.getBalance(uid);
  if (balance < model.cost) {
    await bot.sendMessage(cid,
      `❌ **אין מספיק HET**\n\n` +
      `💰 יתרה: ${balance} HET\n` +
      `💵 צריך: ${model.cost} HET\n\n` +
      `💡 השתמש ב-/start לקבל בונוס!`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  // Charge HET
  await het.charge(uid, model.cost, 'image_generation');
  
  const m = await bot.sendMessage(cid,
    `🎨 **יוצר תמונה...**\n\n` +
    `${model.icon} ${model.name}\n` +
    `📝 "${prompt}"\n` +
    `⏳ 1-3 שניות...`,
    { parse_mode: "Markdown" }
  );
  
  const t0 = Date.now();
  const result = await poll.generate(prompt, modelKey, 1024);
  const time = Date.now() - t0;
  
  if (result.ok) {
    // Save to DATA
    await dc.save({
      type: 'image',
      userId: uid,
      prompt,
      model: modelKey,
      size: 1024,
      success: true,
      time,
      hetSpent: model.cost
    });
    
    const buf = Buffer.from(result.data, 'base64');
    const newBalance = await het.getBalance(uid);
    
    await bot.sendPhoto(cid, buf, {
      caption:
        `✅ **הצלחה!**\n\n` +
        `${model.icon} ${model.name}\n` +
        `⏱️ ${(time/1000).toFixed(1)}s\n` +
        `📝 "${prompt}"\n\n` +
        `💰 יתרה: ${newBalance} HET`,
      parse_mode: "Markdown"
    });
    
    await bot.deleteMessage(cid, m.message_id).catch(() => {});
  } else {
    // Refund on error
    await het.add(uid, model.cost, 'refund_failed_generation');
    
    // Save failure
    await dc.save({
      type: 'image',
      userId: uid,
      prompt,
      model: modelKey,
      success: false,
      time,
      error: result.error
    });
    
    await bot.editMessageText(
      `❌ **שגיאה**\n\n${result.error}\n\n💰 HET הוחזרו`,
      { chat_id: cid, message_id: m.message_id, parse_mode: "Markdown" }
    );
  }
});

// ==========================================
// SEARCH
// ==========================================

bot.on("message", async (msg) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const text = String(msg.text || "").trim();
  
  if (!text || text.startsWith("/")) return;
  
  if (!gas.enabled) {
    await bot.sendMessage(cid, '🔍 GAS לא מחובר. השתמש ב-/imagine');
    return;
  }
  
  // Check balance
  const balance = await het.getBalance(uid);
  if (balance < CONFIG.het.search) {
    await bot.sendMessage(cid,
      `❌ **אין מספיק HET לחיפוש**\n\n` +
      `צריך: ${CONFIG.het.search} HET`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  // Charge
  await het.charge(uid, CONFIG.het.search, 'search');
  
  const t0 = Date.now();
  const result = await gas.search(text, uid);
  const time = Date.now() - t0;
  
  if (result.ok && result.data?.search?.results) {
    const rs = result.data.search.results;
    
    // Save
    await dc.save({
      type: 'search',
      userId: uid,
      query: text,
      results: rs.length,
      success: true,
      time,
      hetSpent: CONFIG.het.search
    });
    
    if (rs.length > 0) {
      const btns = rs.slice(0, 10).map((r, i) => [{
        text: `${i+1}. ${r.title.substring(0, 50)}...`,
        callback_data: `res_${i}_${uid}`
      }]);
      
      userState.set(uid, { results: rs });
      
      let txt = `🔍 **${rs.length} תוצאות**\n📝 "${text}"\n\n`;
      rs.slice(0, 3).forEach((r, i) => {
        const stars = r.relevance >= 80 ? '⭐⭐⭐' : r.relevance >= 60 ? '⭐⭐' : '⭐';
        txt += `**${i+1}. ${r.title}**\n${r.snippet}\n${stars} ${r.relevance}%\n\n`;
      });
      
      const newBalance = await het.getBalance(uid);
      txt += `💰 יתרה: ${newBalance} HET`;
      
      await bot.sendMessage(cid, txt,
        { parse_mode: "Markdown", reply_markup: { inline_keyboard: btns } }
      );
    }
  } else {
    // Refund
    await het.add(uid, CONFIG.het.search, 'refund_failed_search');
    
    await dc.save({
      type: 'search',
      userId: uid,
      query: text,
      success: false,
      time
    });
  }
});

// Search result callback
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('res_')) return;
  
  const cid = q.message.chat.id;
  const [_, idx, uid] = q.data.split('_');
  const state = userState.get(parseInt(uid));
  
  if (!state?.results) return;
  
  const r = state.results[parseInt(idx)];
  if (!r) return;
  
  await bot.answerCallbackQuery(q.id);
  
  const stars = r.relevance >= 80 ? '⭐⭐⭐' : r.relevance >= 60 ? '⭐⭐' : '⭐';
  
  await bot.sendMessage(cid,
    `📄 **${r.title}**\n\n` +
    `${r.snippet}\n\n` +
    `🔗 ${r.url}\n\n` +
    `${stars} ${r.relevance}%`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// ERROR HANDLING
// ==========================================

bot.on('polling_error', (err) => {
  console.error('[POLLING]', err.code);
});

console.log('🌀 v9.0 DATA: ONLINE');
console.log('💛 Collecting data for future AI!');
