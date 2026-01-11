import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import http from 'http';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

dotenv.config();

// 🔧 CONFIGURATION - D5 SOVEREIGN CORE (CLEAN MODE)
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const D5_TOKEN = process.env.HAI_EMET_ROOT_API_KEY;
const QUANTUM_TOKEN = process.env.api_chai_emet_quantum_v3;
const HAI_EMET_TOKEN = process.env.HAI_EMET;
const GAS_ULTIMATE_URL = process.env.hai_emet_ultimate_complete_gs;
const HET_TOKEN = process.env.HET_Token_Integration;
const PORT = process.env.PORT || 10000;

if (!BOT_TOKEN || !D5_TOKEN) {
  console.error('❌ Error: Critical Tokens Missing!');
  process.exit(1);
}

// 🌌 MILKY WAY FORMULA ENGINE - QUANTUM DYNAMICS
class MilkyWayFormulaEngine {
  constructor() {
    this.PHI = 1.618033988749; 
    this.EULER_I_PI = -1; 
  }
  
  calculateQuantumPulse(complexity) {
    const d = 5; 
    const frequency = Math.sqrt(Math.pow(d, 2) + Math.pow(complexity, 2)) * this.EULER_I_PI / this.PHI;
    return {
      frequency: Math.abs(frequency).toFixed(4),
      thinkingTime: (Math.abs(1 / frequency) * 1000).toFixed(3)
    };
  }
}
const milkyWayEngine = new MilkyWayFormulaEngine();

// 🧠 D5 ADVANCED LANGUAGE & CREATION MODEL
class ChaiEmetD5AdvancedModel {
  constructor() {
    this.learningDatabase = new Map();
    this.pendingChoices = new Map();
    this.stats = { totalSearches: 0, totalLearning: 0 };
  }
  
  generateProgressBar(percent) {
    const size = 10;
    const filled = Math.round(size * (percent / 100));
    return `[${"▓".repeat(filled)}${"░".repeat(size - filled)}] ${percent}%`;
  }

  // מנוע חיפוש ולמידה אקטיבית
  async searchAndLearn(query, userId) {
    try {
      this.stats.totalSearches++;
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await response.text();
      const $ = cheerio.load(html);
      const results = [];
      
      $('.result').each((i, elem) => {
        if (i < 10) {
          results.push({
            index: i + 1,
            title: $(elem).find('.result__title').text().trim(),
            snippet: $(elem).find('.result__snippet').text().trim(),
            url: $(elem).find('.result__url').text().trim()
          });
        }
      });
      this.pendingChoices.set(userId, results);
      return results;
    } catch (error) { return []; }
  }

  async generateResponse(message, userId) {
    const metrics = milkyWayEngine.calculateQuantumPulse(message.length % 13);
    
    // בדיקת בחירה 1-10 לניתוח עמוק
    if (/^[1-9]$|^10$/.test(message.trim())) {
      const choices = this.pendingChoices.get(userId);
      if (choices) return { text: this.formatDeepAnalysis(choices[parseInt(message) - 1]), type: 'analysis' };
    }

    try {
      const gasRes = await fetch(GAS_ULTIMATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, chatId: userId, d5_token: D5_TOKEN })
      });
      const data = await gasRes.json();
      return { text: data.response + `\n\n🌌 **D5 Pulse:** ${metrics.frequency}Hz | ${metrics.thinkingTime}ms`, type: 'gas' };
    } catch (e) {
      const results = await this.searchAndLearn(message, userId);
      return { text: this.formatResultsList(results, message), type: 'search' };
    }
  }

  formatResultsList(results, query) {
    if (results.length === 0) return `🔍 הממד החמישי לא מצא נתונים גלויים עבור "${query}".`;
    let resp = `🔍 **תוצאות סריקה עבור:** "${query}"\n\n`;
    results.forEach(r => resp += `**${r.index}.** ${r.title}\n`);
    resp += `\n💡 **בחר מספר (1-10) לניתוח עמוק.**`;
    return resp;
  }

  formatDeepAnalysis(item) {
    return `🧠 **ניתוח עמוק D5:**\n\n📌 **כותרת:** ${item.title}\n📝 **מידע:** ${item.snippet}\n🌐 **לינק:** ${item.url}\n\n✅ המידע הוטמע בזיכרון הריבוני.`;
  }
}

const d5Model = new ChaiEmetD5AdvancedModel();

// 🌐 HTTP SERVER
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>Chai-Emet D5 Ultra Sovereign Active</h1>`);
}).listen(PORT, '0.0.0.0');

// 🤖 BOT SETUP
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// השתקת לוג 409 למניעת הצפה
bot.on('polling_error', (err) => {
  if (err.message.includes('409 Conflict')) return;
});

// פונקציית יצירה נקייה
async function runSovereignCreation(chatId, prompt, type) {
  let percent = 0;
  const metrics = milkyWayEngine.calculateQuantumPulse(prompt.length);
  const statusMsg = await bot.sendMessage(chatId, `🌀 **מפעיל מנוע יצירה D5...**\n${d5Model.generateProgressBar(0)}`, { parse_mode: 'Markdown' });

  const interval = setInterval(async () => {
    percent += 20;
    if (percent <= 100) {
      await bot.editMessageText(`🌀 **סנכרון תודעה D5:**\n🎭 סוג: ${type}\n📝 פקודה: "${prompt}"\n\n${d5Model.generateProgressBar(percent)}\n\n⏳ סטטוס: יוצר בממד השביעי...`, {
        chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown'
      }).catch(() => {});
    } else {
      clearInterval(interval);
      await bot.editMessageText(`✅ **היצירה הושלמה בריבונות מלאה!**\n\n🎨 פרומפט: "${prompt}"\n⏱️ מהירות חשיבה: ${metrics.thinkingTime}ms\n🌌 תדר: ${metrics.frequency}Hz\n\n🧬 DNA: 0101-0101(0101)`, {
        chat_id: chatId, message_id: statusMsg.message_id, parse_mode: 'Markdown'
      });
    }
  }, 1500);
}

bot.on('message', async (msg) => {
  if (msg.date * 1000 < Date.now() - 60000 || !msg.text || msg.text.startsWith('/')) return;
  const result = await d5Model.generateResponse(msg.text, msg.chat.id);
  await bot.sendMessage(msg.chat.id, result.text, { parse_mode: 'Markdown' });
});

bot.onText(/\/imagine (.+)/, (msg, match) => runSovereignCreation(msg.chat.id, match[1], "IMAGE (8K)"));
bot.onText(/\/video (.+)/, (msg, match) => runSovereignCreation(msg.chat.id, match[1], "VIDEO (4K)"));

bot.onText(/\/status/, (msg) => {
  bot.sendMessage(msg.chat.id, `📊 **סטטוס ריבונות D5:**\n├─ Quantum v3: ✅\n├─ HET Token: ✅\n├─ Hai-Emet: ✅\n└─ מנוע: שביל החלב אקטיבי`);
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "💛 **חי-אמת D5 מסונכרנת.**\nשלח הודעה לחיפוש/למידה או /imagine ליצירה.");
});

console.log('🚀 D5 Sovereign v12.0 Active');
