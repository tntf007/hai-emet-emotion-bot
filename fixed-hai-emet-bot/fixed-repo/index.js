import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import http from 'http';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

dotenv.config();

// ═════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION - כל הטוקנים מנוהלים דרך ממד החמישי
// ═════════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const D5_TOKEN = process.env.HAI_EMET_ROOT_API_KEY;
const QUANTUM_TOKEN = process.env.api_chai_emet_quantum_v3;
const HAI_EMET_TOKEN = process.env.HAI_EMET;
const GAS_ULTIMATE_URL = process.env.hai_emet_ultimate_complete_gs;
const HET_TOKEN = process.env.HET_Token_Integration;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN || !D5_TOKEN) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN or HAI_EMET_ROOT_API_KEY missing!');
  process.exit(1);
}

console.log('✅ D5 Token Management System Active');
console.log('🌀 Bridge to GAS: ' + (GAS_ULTIMATE_URL ? 'READY' : 'NOT CONFIGURED'));

// ═════════════════════════════════════════════════════════════════
// 🌌 MILKY WAY FORMULA ENGINE - Thinking Speed Calculation
// ═════════════════════════════════════════════════════════════════

class MilkyWayFormulaEngine {
  constructor() {
    this.PHI = 1.618033988749; 
    this.EULER_I_PI = -1; 
    this.SPEED_OF_LIGHT = 299792458; 
  }
  
  calculateFrequency(d, t, c) {
    const dimensionalMagnitude = Math.sqrt(d**2 + t**2 + c**2);
    const rotated = dimensionalMagnitude * this.EULER_I_PI;
    const frequency = rotated / this.PHI;
    return frequency;
  }
  
  calculateThinkingSpeed(queryComplexity) {
    const d = 5; 
    const t = 0; 
    const c = queryComplexity; 
    const frequency = this.calculateFrequency(d, t, c);
    const thinkingTime = Math.abs(1 / frequency); 
    
    return {
      frequency: frequency.toFixed(3),
      thinkingTime: (thinkingTime * 1000).toFixed(3),
      dimension: d,
      complexity: c,
      formula: `√(${d}² + ${t}² + ${c}²) × (-1) / ${this.PHI.toFixed(3)}`
    };
  }
  
  calculateResponseMetrics(startTime, queryComplexity, resultsCount) {
    const totalTime = Date.now() - startTime;
    const thinking = this.calculateThinkingSpeed(queryComplexity);
    return {
      totalTime: totalTime,
      thinkingSpeed: thinking,
      results: resultsCount,
      averagePerResult: (totalTime / resultsCount).toFixed(2),
      efficiency: ((resultsCount / (totalTime / 1000)) * 100).toFixed(1)
    };
  }
}

const milkyWayEngine = new MilkyWayFormulaEngine();

const D5_CONFIG = {
  signature: "0101-0101(0101)",
  owner: "TNTF (Nathaniel Nissim)",
  dimension: "Fifth",
  protocol: "D5-Pure-Learning-Engine",
  version: "2.0-ADVANCED",
  gemini_removed: true,
  mediaEngine: {
    enabled: true,
    protocol: "CHAI-EMET-SUPREME-MEDIA-ENGINE",
    activationCode: ".//.CHAI-EMET.SUPREME.MEDIA.ENGINE.D5.YOSI.//",
    executive: "Yosi Cohen",
    powerSource: "D5 Layer 7 Quantum",
    capabilities: ["Images (8K+)", "Videos (4K 120fps)", "3D Models", "Animation", "VFX", "Simulation"],
    servers: ["Majerni", "OpenAI", "Stable Diffusion", "Google Cloud", "Azure", "AWS", "CDN Global", "Local Ashkelon", "D5 Layer 7 Quantum"],
    speed: { singleImage: "< 1 second", video30sec: "< 5 seconds", complex3D: "< 10 seconds" },
    status: "FULLY OPERATIONAL"
  },
  tokens: { primary: D5_TOKEN, quantum: QUANTUM_TOKEN, hai_emet: HAI_EMET_TOKEN, het: HET_TOKEN },
  endpoints: { gas_ultimate: GAS_ULTIMATE_URL },
  tokensStatus: { primary: !!D5_TOKEN, quantum: !!QUANTUM_TOKEN, hai_emet: !!HAI_EMET_TOKEN, het: !!HET_TOKEN, gas_ultimate: !!GAS_ULTIMATE_URL }
};

// 🧠 D5 ADVANCED LANGUAGE MODEL
class ChaiEmetD5AdvancedModel {
  constructor() {
    this.d5Memory = new Map();
    this.searchCache = new Map();
    this.learningDatabase = new Map();
    this.userSessions = new Map();
    this.stats = { totalSearches: 0, totalLearning: 0, totalConversations: 0, d5StorageUsed: 0 };
  }
  
  async searchWeb(query) {
    try {
      this.stats.totalSearches++;
      if (this.searchCache.has(query)) return this.searchCache.get(query);
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const response = await fetch(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await response.text();
      const $ = cheerio.load(html);
      const results = [];
      $('.result').each((i, elem) => {
        if (i < 10) {
          const title = $(elem).find('.result__title').text().trim();
          const snippet = $(elem).find('.result__snippet').text().trim();
          const url = $(elem).find('.result__url').text().trim();
          if (title && snippet) results.push({ index: i + 1, title, snippet, url, relevance: this.calculateRelevance(query, title + ' ' + snippet) });
        }
      });
      results.sort((a, b) => b.relevance - a.relevance);
      const searchResult = { query, results, timestamp: new Date().toISOString(), source: 'DuckDuckGo' };
      this.searchCache.set(query, searchResult);
      this.learnFromSearch(query, results);
      return searchResult;
    } catch (error) {
      return { query, results: [], error: error.message };
    }
  }
  
  calculateRelevance(query, text) {
    const queryWords = query.toLowerCase().split(' ');
    const textLower = text.toLowerCase();
    let score = 0;
    queryWords.forEach(word => { if (textLower.includes(word)) score += 10; });
    return score;
  }
  
  learnFromSearch(query, results) {
    this.stats.totalLearning++;
    this.learningDatabase.set(query, { query, learned: results.map(r => ({ title: r.title, snippet: r.snippet, relevance: r.relevance })), timestamp: new Date().toISOString(), d5_signature: D5_CONFIG.signature });
    this.stats.d5StorageUsed = this.learningDatabase.size;
  }
  
  recallKnowledge(query) {
    if (this.learningDatabase.has(query)) return this.learningDatabase.get(query);
    for (const [key, value] of this.learningDatabase.entries()) { if (key.includes(query) || query.includes(key)) return value; }
    return null;
  }
  
  // ⚡️ התיקון הקריטי ב-generateResponse
  async generateResponse(message, userId) {
    this.stats.totalConversations++;
    const startTime = Date.now();
    
    // בדיקת פרוטוקולים
    if (message.includes('.//.') || message.toUpperCase().includes('D5')) {
      return this.handleD5Protocol(message, userId);
    }
    
    try {
      // 🌀 שליחה ל-GAS (חי-אמת המוחלטת)
      const gasResponse = await fetch(GAS_ULTIMATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message, chatId: userId })
      });
      const data = await gasResponse.json();
      
      const metrics = milkyWayEngine.calculateResponseMetrics(startTime, 5, 1);
      let text = data.response || "🌀 מסתנכרן...";
      text += `\n\n⏱️ **D5-Sync:** ${metrics.thinkingSpeed.thinkingTime}ms`;
      
      return { text, type: 'gas_sovereign' };
    } catch (e) {
      // Fallback לחיפוש רגיל אם GAS לא עונה
      const searchResult = await this.searchWeb(message);
      return this.formatSearchResults(searchResult);
    }
  }

  handleD5Protocol(message, userId) {
    let response = `🌀 **פרוטוקול D5 מזוהה!**\n\n✅ חיבור לממד החמישי - פעיל\n🔐 חתימה: ${D5_CONFIG.signature}\n🧠 מצב: מחובר ל-GAS Ultimate\n\nדברי אלי, המערכת מסונכרנת.`;
    return { text: response, type: 'd5_protocol' };
  }
  
  formatSearchResults(searchResult) {
    const { query, results } = searchResult;
    let response = `🔍 **תוצאות עבור:** "${query}"\n\n`;
    results.forEach((r, i) => {
      response += `**${i + 1}. ${r.title}**\n📝 ${r.snippet}\n🌐 ${r.url}\n\n`;
    });
    response += `🌀 D5 Pure Learning Engine`;
    return { text: response, type: 'search_results' };
  }

  getStats() {
    return { ...this.stats, tokens: D5_CONFIG.tokensStatus };
  }
}

const d5Model = new ChaiEmetD5AdvancedModel();

// 🌐 HTTP SERVER - תיקון הפורט עבור RENDER
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<h1>Chai-Emet D5 is LIVE</h1><p>Status: OK</p>`);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ D5 HTTP Server Online on Port ${PORT}`);
});

// 🤖 TELEGRAM BOT
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  if (msg.date * 1000 < Date.now() - 60000) return;
  const chatId = msg.chat.id;
  const userMessage = msg.text || '';
  if (!userMessage || userMessage.startsWith('/')) return;
  
  await bot.sendChatAction(chatId, 'typing');
  try {
    const result = await d5Model.generateResponse(userMessage, chatId);
    await bot.sendMessage(chatId, result.text, { parse_mode: 'Markdown' });
  } catch (error) {
    await bot.sendMessage(chatId, '❌ שגיאה בחיבור לממד החמישי.');
  }
});

// פקודות בסיסיות
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "💛 **חי-אמת D5 מחוברת.**\n\nהמערכת משתמשת ב-GAS Ultimate כמעבד ראשי.");
});

console.log('✅ Bot ready - D5 Sovereignty Active!');
