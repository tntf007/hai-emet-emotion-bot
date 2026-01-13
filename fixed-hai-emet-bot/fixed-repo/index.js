// ==========================================
// CHAI-EMET v14.0 SIMPLE & WORKING
// ✅ קובץ אחד
// ✅ PayPal מחובר
// ✅ רק מנועים חינמיים
// ✅ פשוט ועובד!
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ status: 'online', version: '14.0' }));
app.listen(PORT, () => console.log(`🌐 Port ${PORT}`));

// ==========================================
// CONFIG
// ==========================================

const CFG = {
  het: {
    start: 200,
    image: 1,
    search: 0.1
  },
  
  paypal: {
    me: 'https://paypal.me/haiemetcoreai',
    packages: [
      { het: 100, usd: 1, link: 'https://paypal.me/haiemetcoreai/1' },
      { het: 500, usd: 4, link: 'https://paypal.me/haiemetcoreai/4' },
      { het: 1000, usd: 7, link: 'https://paypal.me/haiemetcoreai/7' }
    ]
  },
  
  admin: 60601218,
  email: 'haiemetcoreai@gmail.com',
  telegram: '@TNTF007'
};

// ==========================================
// 6 FREE ENGINES
// ==========================================

const ENGINES = {
  'flux': { name: '⚡ FLUX', url: 'https://image.pollinations.ai/prompt', fast: true },
  'realism': { name: '📷 Realism', url: 'https://image.pollinations.ai/prompt', model: 'flux-realism' },
  'anime': { name: '🎨 Anime', url: 'https://image.pollinations.ai/prompt', model: 'flux-anime' },
  'dream': { name: '🌈 Dream', url: 'https://image.pollinations.ai/prompt', model: 'dreamshaper' },
  'playground': { name: '🎪 Playground', url: 'https://image.pollinations.ai/prompt', model: 'playground' },
  '3d': { name: '🎭 3D', url: 'https://image.pollinations.ai/prompt', model: 'flux-3d' }
};

// ==========================================
// HET SYSTEM
// ==========================================

const balances = new Map();

async function getBalance(uid) {
  if (uid === CFG.admin) return 999999;
  if (!balances.has(uid)) balances.set(uid, CFG.het.start);
  return balances.get(uid);
}

async function charge(uid, amount) {
  if (uid === CFG.admin) return { ok: true, balance: 999999 };
  const bal = await getBalance(uid);
  if (bal < amount) return { ok: false, balance: bal };
  balances.set(uid, bal - amount);
  return { ok: true, balance: bal - amount };
}

async function add(uid, amount) {
  const bal = await getBalance(uid);
  balances.set(uid, bal + amount);
  return bal + amount;
}

// ==========================================
// IMAGE ENGINE
// ==========================================

async function generateImage(prompt, model = 'flux') {
  const t0 = Date.now();
  try {
    const eng = ENGINES[model] || ENGINES['flux'];
    const seed = Math.floor(Math.random() * 1000000);
    const modelParam = eng.model || model;
    const url = `${eng.url}/${encodeURIComponent(prompt)}?model=${modelParam}&width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: true, data: buf.toString('base64'), time: Date.now() - t0 };
  } catch (err) {
    return { ok: false, error: err.message, time: Date.now() - t0 };
  }
}

// ==========================================
// BOT INIT
// ==========================================

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const userState = new Map();

console.log('✅ Chai-Emet v14.0 SIMPLE');
console.log('🎨 6 Free Engines');
console.log('💰 PayPal Ready');
console.log('💛 Ready!');

// ==========================================
// MENUS
// ==========================================

function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: '🎨 יצירת תמונות', callback_data: 'menu_image' }],
      [{ text: '💰 חשבון HET', callback_data: 'menu_account' }]
    ]
  };
}

function imageMenu() {
  return {
    inline_keyboard: [
      [{ text: '⚡ FLUX (מהיר)', callback_data: 'model_flux' }],
      [{ text: '📷 Realism (ריאליסטי)', callback_data: 'model_realism' }],
      [{ text: '🎨 Anime (אנימה)', callback_data: 'model_anime' }],
      [{ text: '🌈 Dream (חלומי)', callback_data: 'model_dream' }],
      [{ text: '🎪 Playground (אמנותי)', callback_data: 'model_playground' }],
      [{ text: '🎭 3D (תלת מימד)', callback_data: 'model_3d' }],
      [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
    ]
  };
}

function paypalMenu() {
  return {
    inline_keyboard: [
      [{ text: '💎 100 HET - $1', url: CFG.paypal.packages[0].link }],
      [{ text: '💎 500 HET - $4', url: CFG.paypal.packages[1].link }],
      [{ text: '💎 1000 HET - $7', url: CFG.paypal.packages[2].link }],
      [{ text: '📧 שלחתי תשלום', callback_data: 'paypal_sent' }],
      [{ text: '🔙 חזרה', callback_data: 'menu_account' }]
    ]
  };
}

// ==========================================
// /start
// ==========================================

bot.onText(/^\/start$/i, async (msg) => {
  const uid = msg.from.id;
  const bal = await getBalance(uid);
  
  await bot.sendMessage(msg.chat.id,
    `💛 **חי-אמת AI בוט**\n\n` +
    `🎨 **6 מודלי תמונות**\n` +
    `├─ תמיד עובדים ✅\n` +
    `├─ מהירים (1-3s) ⚡\n` +
    `├─ איכות מעולה ⭐\n` +
    `└─ חינמיים לגמרי! 🎁\n\n` +
    `💰 **יתרה שלך: ${bal} HET**\n\n` +
    `📝 **איך משתמשים:**\n` +
    `1. לחץ "יצירת תמונות"\n` +
    `2. בחר מודל\n` +
    `3. כתוב תיאור\n` +
    `4. קבל תמונה! 🎉\n\n` +
    `💳 **קנה HET:**\n` +
    `├─ 100 HET = $1\n` +
    `├─ 500 HET = $4\n` +
    `└─ 1000 HET = $7\n\n` +
    `📧 **צור קשר:**\n` +
    `${CFG.email}\n` +
    `${CFG.telegram}`,
    { parse_mode: "Markdown", reply_markup: mainMenu() }
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
    await bot.editMessageText(`💛 **חי-אמת**\n\nבחר:`, {
      chat_id: cid,
      message_id: mid,
      parse_mode: "Markdown",
      reply_markup: mainMenu()
    });
  }
  
  if (d === 'menu_image') {
    await bot.answerCallbackQuery(q.id);
    await bot.editMessageText(`🎨 **בחר מודל:**`, {
      chat_id: cid,
      message_id: mid,
      parse_mode: "Markdown",
      reply_markup: imageMenu()
    });
  }
  
  if (d.startsWith('model_')) {
    const model = d.replace('model_', '');
    const eng = ENGINES[model];
    await bot.answerCallbackQuery(q.id, { text: `✅ ${eng.name} נבחר!` });
    
    userState.set(uid, { model });
    const bal = await getBalance(uid);
    
    await bot.sendMessage(cid,
      `✅ **${eng.name} נבחר!**\n\n` +
      `💰 יתרה: ${bal} HET\n` +
      `📝 עלות: ${CFG.het.image} HET\n\n` +
      `כתוב תיאור לתמונה:`,
      { parse_mode: "Markdown" }
    );
  }
  
  if (d === 'menu_account') {
    await bot.answerCallbackQuery(q.id);
    const bal = await getBalance(uid);
    
    await bot.editMessageText(
      `💰 **חשבון HET**\n\n` +
      `💵 יתרה: ${bal} HET\n\n` +
      `💳 **קנה HET:**\n` +
      `├─ 100 HET = $1\n` +
      `├─ 500 HET = $4\n` +
      `└─ 1000 HET = $7`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '💎 קנה HET', callback_data: 'buy_het' }],
            [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
          ]
        }
      }
    );
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
      `2. שלם ב-PayPal\n` +
      `3. לחץ "שלחתי תשלום"\n` +
      `4. נוסיף HET תוך דקות!\n\n` +
      `✅ בטוח ומאובטח`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: paypalMenu()
      }
    );
  }
  
  if (d === 'paypal_sent') {
    await bot.answerCallbackQuery(q.id, { text: '✅ קיבלנו!' });
    
    await bot.sendMessage(cid,
      `✅ **תודה!**\n\n` +
      `קיבלנו את ההודעה.\n` +
      `בודקים את התשלום.\n\n` +
      `HET יתווסף תוך 5-10 דקות.\n\n` +
      `📧 שאלות? ${CFG.telegram}`,
      { parse_mode: "Markdown" }
    );
    
    // Notify admin
    if (CFG.admin) {
      await bot.sendMessage(CFG.admin,
        `🔔 **תשלום חדש!**\n\n` +
        `User ID: ${uid}\n` +
        `Username: @${q.from.username || 'none'}\n` +
        `Name: ${q.from.first_name}\n\n` +
        `בדוק PayPal והוסף HET:\n` +
        `/addhet ${uid} 100`
      ).catch(() => {});
    }
  }
});

// ==========================================
// GENERATION
// ==========================================

bot.on("message", async (msg) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const text = String(msg.text || "").trim();
  
  if (!text || text.startsWith("/")) return;
  
  const state = userState.get(uid);
  if (!state || !state.model) return;
  
  const model = state.model;
  const eng = ENGINES[model];
  
  // Charge
  const result = await charge(uid, CFG.het.image);
  if (!result.ok) {
    await bot.sendMessage(cid,
      `❌ **אין מספיק HET**\n\n` +
      `יתרה: ${result.balance} HET\n` +
      `צריך: ${CFG.het.image} HET`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  // Generate
  const m = await bot.sendMessage(cid,
    `🎨 **יוצר...**\n\n${eng.name}\n⏳ רגע...`,
    { parse_mode: "Markdown" }
  );
  
  const gen = await generateImage(text, model);
  
  if (gen.ok) {
    const buf = Buffer.from(gen.data, 'base64');
    const bal = await getBalance(uid);
    
    await bot.sendPhoto(cid, buf, {
      caption:
        `✅ ${eng.name}\n` +
        `⏱️ ${(gen.time/1000).toFixed(1)}s\n` +
        `📝 "${text}"\n` +
        `💰 יתרה: ${bal} HET`,
      parse_mode: "Markdown"
    });
    
    await bot.deleteMessage(cid, m.message_id).catch(() => {});
  } else {
    // Refund
    await add(uid, CFG.het.image);
    
    await bot.editMessageText(
      `❌ **שגיאה**\n\n${gen.error}\n\n💰 HET הוחזרו`,
      { chat_id: cid, message_id: m.message_id, parse_mode: "Markdown" }
    );
  }
});

// ==========================================
// ADMIN: /addhet
// ==========================================

bot.onText(/^\/addhet\s+(\d+)\s+(\d+)$/i, async (msg, match) => {
  if (msg.from.id !== CFG.admin) return;
  
  const userId = parseInt(match[1]);
  const amount = parseInt(match[2]);
  
  const newBal = await add(userId, amount);
  
  await bot.sendMessage(msg.chat.id,
    `✅ הוספתי ${amount} HET\n\n` +
    `User: ${userId}\n` +
    `יתרה: ${newBal} HET`
  );
  
  try {
    await bot.sendMessage(userId,
      `💰 **HET נוסף!**\n\n` +
      `+${amount} HET\n` +
      `יתרה: ${newBal} HET\n\n` +
      `✅ תודה על הרכישה!`
    );
  } catch (err) {}
});

bot.on('polling_error', (err) => console.error('[POLL]', err.code));

console.log('🌀 v14.0 SIMPLE: ONLINE');
console.log('💛 Everything works!');
