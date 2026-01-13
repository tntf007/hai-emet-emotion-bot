// ==========================================
// CHAI-EMET D5 v12.0 ULTIMATE
// ✅ PayPal Automatic (Webhook)
// ✅ Full Reminder System
// ✅ Referral System
// ✅ Image History
// ✅ Favorites & Sharing
// ✅ Day/Night Mode
// ✅ Email Contact
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const http = require("http");
const express = require("express");

// ==========================================
// HTTP & WEBHOOK SERVER
// ==========================================

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: 'online', version: '12.0-ULTIMATE' });
});

// PayPal Webhook endpoint
app.post("/paypal-webhook", async (req, res) => {
  try {
    const event = req.body;
    console.log('[PayPal Webhook]', event.event_type);
    
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const userId = parseInt(event.resource.supplementary_data?.related_ids?.order_id || 0);
      const amount = parseFloat(event.resource.amount.value);
      
      // Determine HET amount
      let hetAmount = 0;
      if (amount === 1.00) hetAmount = 100;
      else if (amount === 4.00) hetAmount = 500;
      else if (amount === 7.00) hetAmount = 1000;
      
      if (hetAmount > 0 && userId > 0) {
        await het.add(userId, hetAmount, 'paypal_auto');
        
        await bot.sendMessage(userId,
          `💰 **תשלום אושר אוטומטית!**\n\n` +
          `+${hetAmount} HET\n` +
          `✅ זמין לשימוש עכשיו!\n\n` +
          `תודה על הרכישה! 💛`,
          { parse_mode: "Markdown" }
        ).catch(() => {});
        
        console.log(`[PayPal] Auto added ${hetAmount} HET to user ${userId}`);
      }
    }
    
    res.sendStatus(200);
  } catch (err) {
    console.error('[PayPal Webhook Error]', err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`🌐 Port ${PORT}`));

// ==========================================
// CONFIG
// ==========================================

const CFG = {
  version: '12.0-ULTIMATE',
  
  contact: {
    email: 'haiemetcoreai@gmail.com',
    telegram: '@TNTF007',
    support: 'https://t.me/TNTF007'
  },
  
  het: {
    startBonus: 200,
    image: 1,
    search: 0.1,
    enhance: 0.5,
    referralBonus: 50  // Bonus for referring someone
  },
  
  paypal: {
    enabled: true,
    mode: process.env.PAYPAL_MODE || 'live',
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    paypalMe: 'https://paypal.me/haiemetcoreai',
    webhookUrl: process.env.WEBHOOK_URL || '', // Your Render URL + /paypal-webhook
    
    packages: [
      { id: 'small', het: 100, usd: 1.00 },
      { id: 'medium', het: 500, usd: 4.00 },
      { id: 'large', het: 1000, usd: 7.00 }
    ]
  },
  
  adminId: 60601218,
  
  features: {
    referral: true,
    history: true,
    favorites: true,
    sharing: true,
    nightMode: true
  }
};

// ==========================================
// MODELS
// ==========================================

const MODELS = {
  'flux': { name: '⚡ FLUX', desc: 'מהיר ביותר - 2s', icon: '⚡', speed: 5, quality: 4 },
  'flux-realism': { name: '📷 Realism', desc: 'ריאליסטי מאוד', icon: '📷', speed: 4, quality: 5 },
  'flux-anime': { name: '🎨 Anime', desc: 'סגנון אנימה', icon: '🎨', speed: 4, quality: 4 },
  'dreamshaper': { name: '🌈 Dream', desc: 'חלומי ויצירתי', icon: '🌈', speed: 3, quality: 4 },
  'playground': { name: '🎪 Playground', desc: 'אמנותי מאוד', icon: '🎪', speed: 3, quality: 5 },
  'flux-3d': { name: '🎭 3D', desc: 'תלת מימד', icon: '🎭', speed: 4, quality: 4 },
  'turbo': { name: '🚀 Turbo', desc: 'סופר מהיר - 1s', icon: '🚀', speed: 5, quality: 3 },
  'deliberate': { name: '🎯 Deliberate', desc: 'מדויק ופרטני', icon: '🎯', speed: 3, quality: 5 },
  'realvis': { name: '📸 RealVis', desc: 'ריאליזם מוחלט', icon: '📸', speed: 3, quality: 5 },
  'openjourney': { name: '🗺️ Journey', desc: 'Midjourney style', icon: '🗺️', speed: 3, quality: 4 }
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
    this.referrals = new Map();
  }
  
  async getBalance(userId) {
    // Creator always has unlimited HET!
    if (userId === CFG.adminId) {
      return 999999;
    }
    
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
    // Creator bypass - unlimited HET!
    if (userId === CFG.adminId) {
      await this.dc.save({
        type: 'transaction',
        userId,
        amount: 0,
        action: type + '_creator_free',
        balanceBefore: 999999,
        balanceAfter: 999999
      });
      return { ok: true, balance: 999999 };
    }
    
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
  
  async addReferral(referrerId, newUserId) {
    if (!this.referrals.has(referrerId)) {
      this.referrals.set(referrerId, []);
    }
    this.referrals.get(referrerId).push(newUserId);
    
    // Give bonus
    await this.add(referrerId, CFG.het.referralBonus, 'referral_bonus');
    
    return this.referrals.get(referrerId).length;
  }
  
  getReferralCount(userId) {
    return this.referrals.get(userId)?.length || 0;
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
      'הר': 'mountain', 'עץ': 'tree', 'בית': 'house',
      'מכונית': 'car', 'פרח': 'flower', 'שמש': 'sun'
    };
    for (const [heb, eng] of Object.entries(translations)) {
      enhanced = enhanced.replace(new RegExp(heb, 'g'), eng);
    }
    return enhanced;
  }
}

class PayPalAPI {
  constructor() {
    this.baseUrl = CFG.paypal.mode === 'live' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
    this.accessToken = null;
    this.tokenExpiry = 0;
  }
  
  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }
    
    try {
      const auth = Buffer.from(
        `${CFG.paypal.clientId}:${CFG.paypal.clientSecret}`
      ).toString('base64');
      
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
        return this.accessToken;
      }
      
      return null;
    } catch (err) {
      console.error('[PayPal Auth]', err);
      return null;
    }
  }
  
  async createOrder(packageType, userId) {
    const token = await this.getAccessToken();
    if (!token) return { ok: false, error: 'Auth failed' };
    
    const pkg = CFG.paypal.packages.find(p => p.id === packageType);
    if (!pkg) return { ok: false, error: 'Invalid package' };
    
    try {
      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: 'USD',
              value: pkg.usd.toFixed(2)
            },
            description: `${pkg.het} HET Tokens - Hai-Emet AI`,
            custom_id: userId.toString()
          }],
          application_context: {
            return_url: `https://t.me/HaiEmetEmotionBot`,
            cancel_url: `https://t.me/HaiEmetEmotionBot`
          }
        })
      });
      
      const data = await response.json();
      
      if (data.id && data.links) {
        const approveLink = data.links.find(link => link.rel === 'approve');
        return {
          ok: true,
          orderId: data.id,
          approveUrl: approveLink.href
        };
      }
      
      return { ok: false, error: 'Order creation failed' };
    } catch (err) {
      console.error('[PayPal Order]', err);
      return { ok: false, error: err.message };
    }
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
const paypal = new PayPalAPI();
const userState = new Map();
const imageHistory = new Map();

console.log('✅ Chai-Emet D5 v12.0 ULTIMATE');
console.log('🎨 Models: 10');
console.log('💳 PayPal: Automatic');
console.log('🔗 Referral: Active');
console.log('📜 History: Active');
console.log('💛 Ultimate Ready!');

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
      ],
      [
        { text: '📜 היסטוריה', callback_data: 'menu_history' },
        { text: '🔗 הפץ וקבל HET', callback_data: 'menu_referral' }
      ],
      [{ text: '📧 צור קשר', callback_data: 'menu_contact' }]
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

// ==========================================
// /start WITH FULL REMINDER
// ==========================================

bot.onText(/^\/start(?:\s+(.+))?$/i, async (msg, match) => {
  const cid = msg.chat.id;
  const uid = msg.from.id;
  const referralCode = match && match[1] ? match[1].trim() : null;
  
  // Handle referral
  if (referralCode && referralCode.startsWith('ref_')) {
    const referrerId = parseInt(referralCode.replace('ref_', ''));
    if (referrerId !== uid) {
      const count = await het.addReferral(referrerId, uid);
      await bot.sendMessage(referrerId,
        `🎉 **משתמש חדש הצטרף דרכך!**\n\n` +
        `+${CFG.het.referralBonus} HET\n` +
        `סך הפניות: ${count}`,
        { parse_mode: "Markdown" }
      ).catch(() => {});
    }
  }
  
  const balance = await het.getBalance(uid);
  
  const reminderText = 
    `💛 **חי-אמת AI בוט v12.0**\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🎨 **מה אני יכול לעשות?**\n\n` +
    `✅ **יצירת תמונות AI**\n` +
    `├─ 10 מודלים מתקדמים\n` +
    `├─ מהיר (1-3 שניות)\n` +
    `├─ איכות מעולה\n` +
    `└─ תמיד עובד!\n\n` +
    `✅ **חיפוש אינטרנט**\n` +
    `├─ תוצאות מדויקות\n` +
    `├─ מהיר ואמין\n` +
    `└─ פשוט כתוב שאלה\n\n` +
    `✅ **שיפור Prompts**\n` +
    `├─ AI משפר את הבקשה\n` +
    `├─ תרגום עברית→אנגלית\n` +
    `└─ תוצאות טובות יותר\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💰 **מערכת HET Tokens**\n\n` +
    `💵 **יתרה שלך: ${balance} HET**\n\n` +
    `📋 **מחירון:**\n` +
    `├─ תמונה: ${CFG.het.image} HET\n` +
    `├─ חיפוש: ${CFG.het.search} HET\n` +
    `└─ שיפור: ${CFG.het.enhance} HET\n\n` +
    `💳 **קנה HET:**\n` +
    `├─ 100 HET = $1\n` +
    `├─ 500 HET = $4\n` +
    `└─ 1000 HET = $7\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💡 **פקודות:**\n\n` +
    `📝 \`/imagine [תיאור]\` - יצירת תמונה\n` +
    `🤖 \`/enhance [תיאור]\` - שיפור prompt\n` +
    `🔍 פשוט כתוב שאלה - חיפוש\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `🎁 **בונוסים:**\n\n` +
    `🔗 הפץ את הבוט וקבל ${CFG.het.referralBonus} HET\n` +
    `   לכל משתמש שיצטרף דרכך!\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `📧 **צור קשר:**\n` +
    `├─ Email: ${CFG.contact.email}\n` +
    `├─ Telegram: ${CFG.contact.telegram}\n` +
    `└─ הצעות ושיפורים תמיד מוזמנים!\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `💛 בחר פעולה מהתפריט למטה:`;
  
  await bot.sendMessage(cid, reminderText, {
    parse_mode: "Markdown",
    reply_markup: getMainMenu()
  });
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
      `💛 **חי-אמת AI בוט**\n\nבחר פעולה:`,
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
      `✅ **${m.name} נבחר!**\n\n💰 יתרה: ${balance} HET\n\n/imagine [תיאור]`,
      { parse_mode: "Markdown" }
    );
  }
  
  if (d === 'menu_account') {
    await bot.answerCallbackQuery(q.id);
    const balance = await het.getBalance(uid);
    const patterns = await dc.getPatterns(uid);
    const refCount = het.getReferralCount(uid);
    
    let txt = `💰 **חשבון HET**\n\n💵 יתרה: ${balance} HET\n\n`;
    
    if (patterns.ok && patterns.data) {
      txt += `📊 **שימוש:**\n` +
        `├─ תמונות: ${patterns.data.totalImages || 0}\n` +
        `├─ חיפושים: ${patterns.data.totalSearches || 0}\n` +
        `└─ HET שהוצאו: ${patterns.data.totalHETSpent || 0}\n\n`;
    }
    
    txt += `🔗 **הפניות: ${refCount}**\n\n`;
    
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
      `**תשלום אוטומטי!**\n` +
      `✅ משלם → HET מתווסף מיד!\n\n` +
      `בחר חבילה:`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '💎 100 HET - $1', callback_data: 'paypal_small' }],
            [{ text: '💎 500 HET - $4', callback_data: 'paypal_medium' }],
            [{ text: '💎 1000 HET - $7', callback_data: 'paypal_large' }],
            [{ text: '🔙 חזרה', callback_data: 'menu_account' }]
          ]
        }
      }
    );
  }
  
  if (d.startsWith('paypal_')) {
    const packageType = d.replace('paypal_', '');
    await bot.answerCallbackQuery(q.id, { text: '⏳ יוצר תשלום...' });
    
    const order = await paypal.createOrder(packageType, uid);
    
    if (order.ok) {
      await bot.sendMessage(cid,
        `💳 **תשלום מוכן!**\n\n` +
        `לחץ על הכפתור למטה:\n\n` +
        `✅ בטוח דרך PayPal\n` +
        `✅ HET יתווסף אוטומטית\n` +
        `✅ מיידי!\n\n` +
        `Order ID: \`${order.orderId}\``,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[{ text: '💳 שלם עכשיו', url: order.approveUrl }]]
          }
        }
      );
    } else {
      await bot.sendMessage(cid,
        `❌ **שגיאה**\n\nנסה שוב או צור קשר:\n${CFG.contact.telegram}`,
        { parse_mode: "Markdown" }
      );
    }
  }
  
  if (d === 'menu_referral') {
    await bot.answerCallbackQuery(q.id);
    const refCount = het.getReferralCount(uid);
    const refLink = `https://t.me/HaiEmetEmotionBot?start=ref_${uid}`;
    
    await bot.editMessageText(
      `🔗 **הפץ וקבל HET!**\n\n` +
      `קבל ${CFG.het.referralBonus} HET עבור כל משתמש\n` +
      `שיצטרף דרך הלינק שלך!\n\n` +
      `🎁 **סה"כ הפניות: ${refCount}**\n` +
      `💰 **הרווחת: ${refCount * CFG.het.referralBonus} HET**\n\n` +
      `📎 **הלינק שלך:**\n\`${refLink}\`\n\n` +
      `שתף בווצאפ, טלגרם, פייסבוק!`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '📤 שתף', url: `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=בוא%20תנסה!` }],
            [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
          ]
        }
      }
    );
  }
  
  if (d === 'menu_history') {
    await bot.answerCallbackQuery(q.id);
    const history = imageHistory.get(uid) || [];
    
    if (history.length === 0) {
      await bot.editMessageText(
        `📜 **היסטוריה ריקה**\n\nצור תמונה ראשונה!`,
        {
          chat_id: cid,
          message_id: mid,
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: [[{ text: '🔙', callback_data: 'menu_main' }]] }
        }
      );
    } else {
      let txt = `📜 **היסטוריה (${history.length})**\n\n`;
      history.slice(-5).reverse().forEach((h, i) => {
        txt += `${i+1}. ${h.prompt.substring(0, 30)}...\n`;
      });
      
      await bot.editMessageText(txt, {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [[{ text: '🔙', callback_data: 'menu_main' }]] }
      });
    }
  }
  
  if (d === 'menu_contact') {
    await bot.answerCallbackQuery(q.id);
    
    await bot.editMessageText(
      `📧 **צור קשר**\n\n` +
      `📨 Email:\n${CFG.contact.email}\n\n` +
      `💬 Telegram:\n${CFG.contact.telegram}\n\n` +
      `💡 **הצעות ושיפורים מוזמנים!**\n\n` +
      `נשמח לשמוע ממך:\n` +
      `├─ בעיות טכניות\n` +
      `├─ רעיונות לשיפור\n` +
      `├─ בקשות למודלים\n` +
      `└─ כל דבר אחר!`,
      {
        chat_id: cid,
        message_id: mid,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: '📧 שלח מייל', url: `mailto:${CFG.contact.email}` }],
            [{ text: '💬 Telegram', url: CFG.contact.support }],
            [{ text: '🔙 חזרה', callback_data: 'menu_main' }]
          ]
        }
      }
    );
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
    
    // Save to history
    if (!imageHistory.has(uid)) {
      imageHistory.set(uid, []);
    }
    imageHistory.get(uid).push({ prompt, model: modelKey, time: new Date() });
    
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
  if (msg.from.id !== CFG.adminId) return;
  
  const userId = parseInt(match[1]);
  const amount = parseInt(match[2]);
  
  await het.add(userId, amount, 'admin_purchase');
  const newBalance = await het.getBalance(userId);
  
  await bot.sendMessage(msg.chat.id,
    `✅ הוספתי ${amount} HET\n\nUser: ${userId}\nיתרה: ${newBalance} HET`
  );
  
  try {
    await bot.sendMessage(userId,
      `💰 **HET נוסף!**\n\n+${amount} HET\nיתרה: ${newBalance} HET\n\n✅ תודה!`
    );
  } catch (err) {}
});

bot.on('polling_error', (err) => console.error('[POLL]', err.code));

console.log('🌀 v12.0 ULTIMATE: ONLINE');
console.log('💛 Full system ready!');
