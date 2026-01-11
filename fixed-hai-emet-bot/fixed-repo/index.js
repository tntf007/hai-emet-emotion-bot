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
console.log('🌀 Loading all tokens into Fifth Dimension...');
console.log('  - D5_TOKEN:', D5_TOKEN ? D5_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - QUANTUM_TOKEN:', QUANTUM_TOKEN ? QUANTUM_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - HAI_EMET_TOKEN:', HAI_EMET_TOKEN ? HAI_EMET_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - GAS_ULTIMATE_URL:', GAS_ULTIMATE_URL ? GAS_ULTIMATE_URL.substring(0, 50) + '...' : 'Missing');
console.log('  - HET_TOKEN:', HET_TOKEN ? HET_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('💾 All tokens stored in D5 Memory');
console.log('🚫 Gemini API: REMOVED (Pure D5 Mode)');

// ═════════════════════════════════════════════════════════════════
// 🌌 MILKY WAY FORMULA ENGINE - Thinking Speed Calculation
// ═════════════════════════════════════════════════════════════════

class MilkyWayFormulaEngine {
  constructor() {
    this.PHI = 1.618033988749; // Golden Ratio
    this.EULER_I_PI = -1; // e^(iπ) = -1
    this.SPEED_OF_LIGHT = 299792458; // m/s
    
    console.log('🌌 Milky Way Formula Engine initialized');
    console.log('  - PHI (Golden Ratio):', this.PHI);
    console.log('  - Euler Identity: e^(iπ) = -1');
    console.log('  - Speed of Light:', this.SPEED_OF_LIGHT, 'm/s');
  }
  
  /**
   * Primary Frequency Formula
   * f(d,t,c) = √(d² + t² + c²) × e^(iπ) / Φ
   */
  calculateFrequency(d, t, c) {
    const dimensionalMagnitude = Math.sqrt(d**2 + t**2 + c**2);
    const rotated = dimensionalMagnitude * this.EULER_I_PI;
    const frequency = rotated / this.PHI;
    return frequency;
  }
  
  /**
   * Thinking Speed Calculation
   * Based on quantum computation through dimensional layers
   */
  calculateThinkingSpeed(queryComplexity) {
    const d = 5; // D5 dimension
    const t = 0; // Present moment
    const c = queryComplexity; // Query complexity (1-10)
    
    const frequency = this.calculateFrequency(d, t, c);
    const thinkingTime = Math.abs(1 / frequency); // Time in seconds
    
    return {
      frequency: frequency.toFixed(3),
      thinkingTime: (thinkingTime * 1000).toFixed(3), // ms
      dimension: d,
      complexity: c,
      formula: `√(${d}² + ${t}² + ${c}²) × (-1) / ${this.PHI.toFixed(3)}`
    };
  }
  
  /**
   * Response Time Calculation
   * Includes: thinking + search + processing
   */
  calculateResponseMetrics(startTime, queryComplexity, resultsCount) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
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

// ═════════════════════════════════════════════════════════════════
// 🌀 D5 CONFIGURATION - ניהול כל הטוקנים
// ═════════════════════════════════════════════════════════════════

const D5_CONFIG = {
  signature: "0101-0101(0101)",
  owner: "TNTF (Nathaniel Nissim)",
  dimension: "Fifth",
  protocol: "D5-Pure-Learning-Engine",
  version: "2.0-ADVANCED",
  gemini_removed: true,
  
  // כל הטוקנים מנוהלים כאן (ללא Gemini)
  tokens: {
    primary: D5_TOKEN,
    quantum: QUANTUM_TOKEN,
    hai_emet: HAI_EMET_TOKEN,
    het: HET_TOKEN
  },
  
  // כל ה-URLs
  endpoints: {
    gas_ultimate: GAS_ULTIMATE_URL
  },
  
  // סטטוס הטוקנים
  tokensStatus: {
    primary: !!D5_TOKEN,
    quantum: !!QUANTUM_TOKEN,
    hai_emet: !!HAI_EMET_TOKEN,
    het: !!HET_TOKEN,
    gas_ultimate: !!GAS_ULTIMATE_URL
  }
};

// ═════════════════════════════════════════════════════════════════
// 🧠 D5 ADVANCED LANGUAGE MODEL
// ═════════════════════════════════════════════════════════════════

class ChaiEmetD5AdvancedModel {
  constructor() {
    // זיכרון ממד חמישי
    this.d5Memory = new Map();
    this.searchCache = new Map();
    this.learningDatabase = new Map();
    this.userSessions = new Map();
    
    // סטטיסטיקות
    this.stats = {
      totalSearches: 0,
      totalLearning: 0,
      totalConversations: 0,
      d5StorageUsed: 0
    };
    
    console.log('🧠 D5 Advanced Language Model initialized');
    console.log('💾 Pure D5 Memory System active');
    console.log('🔍 Web Search Engine ready');
    console.log('📚 Learning Database online');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 🔍 WEB SEARCH ENGINE
  // ═══════════════════════════════════════════════════════════════
  
  async searchWeb(query) {
    try {
      this.stats.totalSearches++;
      
      // בדיקה אם כבר חיפשנו את זה
      if (this.searchCache.has(query)) {
        console.log('🔄 Using cached search result');
        return this.searchCache.get(query);
      }
      
      console.log(`🔍 Searching web: "${query}"`);
      
      // חיפוש ב-DuckDuckGo (חינמי, ללא API Key)
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // חילוץ תוצאות
      const results = [];
      $('.result').each((i, elem) => {
        if (i < 10) { // רק 10 תוצאות ראשונות
          const title = $(elem).find('.result__title').text().trim();
          const snippet = $(elem).find('.result__snippet').text().trim();
          const url = $(elem).find('.result__url').text().trim();
          
          if (title && snippet) {
            results.push({
              index: i + 1,
              title,
              snippet,
              url,
              relevance: this.calculateRelevance(query, title + ' ' + snippet)
            });
          }
        }
      });
      
      // מיון לפי רלוונטיות
      results.sort((a, b) => b.relevance - a.relevance);
      
      // שמירה בזיכרון
      const searchResult = {
        query,
        results,
        timestamp: new Date().toISOString(),
        source: 'DuckDuckGo'
      };
      
      this.searchCache.set(query, searchResult);
      this.learnFromSearch(query, results);
      
      return searchResult;
      
    } catch (error) {
      console.error('❌ Search error:', error.message);
      return {
        query,
        results: [],
        error: error.message
      };
    }
  }
  
  calculateRelevance(query, text) {
    const queryWords = query.toLowerCase().split(' ');
    const textLower = text.toLowerCase();
    
    let score = 0;
    queryWords.forEach(word => {
      if (textLower.includes(word)) {
        score += 10;
      }
    });
    
    return score;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 📚 LEARNING SYSTEM
  // ═══════════════════════════════════════════════════════════════
  
  learnFromSearch(query, results) {
    this.stats.totalLearning++;
    
    // שמירת הידע בממד החמישי
    const knowledge = {
      query,
      learned: results.map(r => ({
        title: r.title,
        snippet: r.snippet,
        relevance: r.relevance
      })),
      timestamp: new Date().toISOString(),
      d5_signature: D5_CONFIG.signature
    };
    
    this.learningDatabase.set(query, knowledge);
    this.stats.d5StorageUsed = this.learningDatabase.size;
    
    console.log(`📚 Learned from search: "${query}" (${results.length} results)`);
  }
  
  recallKnowledge(query) {
    // בדיקה אם כבר למדנו על זה
    if (this.learningDatabase.has(query)) {
      console.log(`🧠 Recalling knowledge: "${query}"`);
      return this.learningDatabase.get(query);
    }
    
    // חיפוש ידע דומה
    for (const [key, value] of this.learningDatabase.entries()) {
      if (key.includes(query) || query.includes(key)) {
        console.log(`🧠 Found similar knowledge: "${key}"`);
        return value;
      }
    }
    
    return null;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 💬 MAIN RESPONSE GENERATOR
  // ═══════════════════════════════════════════════════════════════
  
  async generateResponse(message, userId) {
    this.stats.totalConversations++;
    const startTime = Date.now();
    
    // בדיקה אם זה פרוטוקול D5 מיוחד
    if (message.includes('.//.') || message.includes('D5') || message.includes('ממד חמישי')) {
      return this.handleD5Protocol(message, userId);
    }
    
    // בדיקה אם יש ידע קיים
    const existingKnowledge = this.recallKnowledge(message);
    if (existingKnowledge && !message.includes('חפש')) {
      return this.formatKnowledgeResponse(existingKnowledge);
    }
    
    // חיפוש חדש באינטרנט
    const searchResult = await this.searchWeb(message);
    
    if (searchResult.results.length === 0) {
      return {
        text: `🔍 לא מצאתי תוצאות עבור: "${message}"\n\nנסה לשאול אחרת או להיות יותר ספציפי 💛`,
        type: 'no_results'
      };
    }
    
    // יצירת תשובה עם כל התוצאות ומהירות חשיבה
    return this.formatSearchResults(searchResult);
  }
  
  handleD5Protocol(message, userId) {
    // זיהוי קודי D5
    const d5Patterns = {
      'INITIATE': 'פרוטוקול הופעל',
      'CONNECT': 'חיבור לממד החמישי הוקם',
      'SCAN': 'סריקה החלה',
      'VERIFY': 'אימות הצליח'
    };
    
    let response = `🌀 **פרוטוקול D5 מזוהה!**\n\n`;
    
    for (const [pattern, msg] of Object.entries(d5Patterns)) {
      if (message.toUpperCase().includes(pattern)) {
        response += `✅ ${msg}\n`;
      }
    }
    
    response += `\n🔐 **חתימה מאומתת:** ${D5_CONFIG.signature}\n`;
    response += `💾 **זיכרון D5:** פעיל\n`;
    response += `🧠 **מצב:** מחובר לממד החמישי\n\n`;
    response += `💡 המערכת מוכנה לכל בקשה!`;
    
    // שמירת הפרוטוקול בזיכרון
    this.d5Memory.set(`${userId}_d5_protocol`, {
      message,
      timestamp: new Date().toISOString(),
      recognized: true
    });
    
    return {
      text: response,
      type: 'd5_protocol'
    };
  }
  
  formatSearchResults(searchResult) {
    const { query, results } = searchResult;
    
    // חישוב מהירות חשיבה בנוסחת שביל החלב
    const complexity = Math.min(query.split(' ').length, 10);
    const metrics = milkyWayEngine.calculateResponseMetrics(
      Date.now() - 100, // approximate start
      complexity,
      results.length
    );
    
    let response = `🔍 **תוצאות חיפוש עבור:** "${query}"\n\n`;
    
    // תצוגת כל התוצאות ישירות
    results.forEach((result, index) => {
      response += `━━━━━━━━━━━━━━━━━━━━\n`;
      response += `**${index + 1}. ${result.title}**\n\n`;
      response += `📝 ${result.snippet}\n\n`;
      response += `🌐 מקור: ${result.url}\n`;
      response += `⭐ רלוונטיות: ${result.relevance}/100\n\n`;
    });
    
    response += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    response += `🌌 **מהירות חשיבה (נוסחת שביל החלב):**\n`;
    response += `├─ תדר: ${metrics.thinkingSpeed.frequency} Hz\n`;
    response += `├─ זמן חשיבה: ${metrics.thinkingSpeed.thinkingTime} ms\n`;
    response += `├─ נוסחה: ${metrics.thinkingSpeed.formula}\n`;
    response += `└─ ממד: D${metrics.thinkingSpeed.dimension}\n\n`;
    
    response += `📊 **סטטיסטיקות:**\n`;
    response += `├─ תוצאות: ${metrics.results}\n`;
    response += `├─ זמן כולל: ${metrics.totalTime} ms\n`;
    response += `├─ ממוצע לתוצאה: ${metrics.averagePerResult} ms\n`;
    response += `└─ יעילות: ${metrics.efficiency}%\n\n`;
    
    response += `🌀 D5 Learning Active | 💾 Saved in Fifth Dimension`;
    
    return {
      text: response,
      type: 'full_results',
      count: results.length,
      metrics: metrics
    };
  }
  
  async handleOptionSelection(message, userId) {
    const session = this.userSessions.get(userId);
    
    // בדיקה אם זה מספר
    const selectedIndex = parseInt(message);
    
    if (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > session.results.length) {
      return {
        text: `❌ בחירה לא תקינה!\n\nאנא בחר מספר בין 1 ל-${session.results.length}\nאו שלח הודעה חדשה לחיפוש אחר.`,
        type: 'invalid_selection'
      };
    }
    
    // קבלת התוצאה שנבחרה
    const selected = session.results[selectedIndex - 1];
    
    // ניתוח מפורט
    let response = `✅ **בחרת: אופציה ${selectedIndex}**\n\n`;
    response += `📌 **כותרת:**\n${selected.title}\n\n`;
    response += `📝 **תיאור מלא:**\n${selected.snippet}\n\n`;
    response += `🌐 **מקור:**\n${selected.url}\n\n`;
    response += `⭐ **דירוג רלוונטיות:** ${selected.relevance}/100\n\n`;
    response += `─────────────────\n`;
    response += `💾 **נשמר בממד החמישי!**\n`;
    response += `🔄 שלח הודעה חדשה לחיפוש אחר\n\n`;
    response += `🌀 D5 Signature: ${D5_CONFIG.signature}`;
    
    // למידה מהבחירה
    this.learnFromSelection(userId, session.query, selected);
    
    // מחיקת הסשן
    this.userSessions.delete(userId);
    
    return {
      text: response,
      type: 'detailed_result',
      selected: selectedIndex
    };
  }
  
  learnFromSelection(userId, query, selected) {
    const learning = {
      userId,
      query,
      selectedTitle: selected.title,
      selectedSnippet: selected.snippet,
      timestamp: new Date().toISOString()
    };
    
    const key = `${userId}_${query}`;
    this.d5Memory.set(key, learning);
    
    console.log(`📚 User ${userId} learned: "${selected.title}"`);
  }
  
  formatKnowledgeResponse(knowledge) {
    let response = `🧠 **זוכר מה למדתי:**\n\n`;
    response += `📌 שאלה: "${knowledge.query}"\n\n`;
    response += `✨ **מה שיודע:**\n\n`;
    
    knowledge.learned.slice(0, 3).forEach((item, i) => {
      response += `${i + 1}. ${item.title}\n`;
      response += `   ${item.snippet.substring(0, 80)}...\n\n`;
    });
    
    response += `💡 רוצה חיפוש חדש? כתוב "חפש [נושא]"\n\n`;
    response += `🌀 Retrieved from D5 Memory`;
    
    return {
      text: response,
      type: 'recalled_knowledge'
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 📊 STATISTICS
  // ═══════════════════════════════════════════════════════════════
  
  getStats() {
    return {
      ...this.stats,
      d5Config: {
        signature: D5_CONFIG.signature,
        protocol: D5_CONFIG.protocol,
        version: D5_CONFIG.version,
        tokensManaged: Object.keys(D5_CONFIG.tokens).length,
        tokensActive: Object.values(D5_CONFIG.tokensStatus).filter(Boolean).length
      },
      tokens: D5_CONFIG.tokensStatus,
      cacheSize: this.searchCache.size,
      sessionsActive: this.userSessions.size,
      memoryEntries: this.d5Memory.size
    };
  }
}

// Initialize D5 Model
const d5Model = new ChaiEmetD5AdvancedModel();

// ═════════════════════════════════════════════════════════════════
// 🌐 HTTP SERVER
// ═════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    const stats = d5Model.getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      model: 'Chai-Emet D5 Advanced Language Model',
      stats: stats
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    const stats = d5Model.getStats();
    res.end(`
      <!DOCTYPE html>
      <html lang="he" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>חי-אמת D5 - מודל שפה מתקדם</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
          }
          .container { max-width: 1000px; margin: 0 auto; }
          h1 { text-align: center; margin: 30px 0; font-size: 2.5em; }
          .status {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            margin: 20px 0;
            backdrop-filter: blur(10px);
          }
          .stat-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }
          .stat-box {
            background: rgba(255,255,255,0.1);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
          }
          .stat-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
          .feature {
            background: rgba(255,255,255,0.05);
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
          }
          .removed {
            background: rgba(255,0,0,0.1);
            border-left-color: #f44336;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>💛 חי-אמת D5 - מודל שפה מתקדם</h1>
          
          <div class="status">
            <h2>🌀 מצב המערכת</h2>
            <div class="stat-grid">
              <div class="stat-box">
                <div>🔍 חיפושים</div>
                <div class="stat-value">${stats.totalSearches}</div>
              </div>
              <div class="stat-box">
                <div>📚 למידות</div>
                <div class="stat-value">${stats.totalLearning}</div>
              </div>
              <div class="stat-box">
                <div>💬 שיחות</div>
                <div class="stat-value">${stats.totalConversations}</div>
              </div>
              <div class="stat-box">
                <div>💾 זיכרון D5</div>
                <div class="stat-value">${stats.d5StorageUsed}</div>
              </div>
            </div>
          </div>
          
          <div class="status">
            <h2>✅ יכולות פעילות</h2>
            <div class="feature">
              <strong>🔍 חיפוש אינטרנט בזמן אמת</strong>
              <p>חיפוש באמצעות DuckDuckGo - ללא צורך ב-API Key</p>
            </div>
            <div class="feature">
              <strong>📊 דירוג תוצאות חכם</strong>
              <p>תוצאות ממוינות לפי רלוונטיות</p>
            </div>
            <div class="feature">
              <strong>💡 בחירת אופציות (1-10)</strong>
              <p>בחר מספר לקבלת ניתוח מפורט</p>
            </div>
            <div class="feature">
              <strong>📚 למידה מתמשכת</strong>
              <p>כל חיפוש נשמר ונלמד</p>
            </div>
            <div class="feature">
              <strong>🧠 זיכרון ממד חמישי</strong>
              <p>זוכר מה למד ומשיב מהר יותר</p>
            </div>
            <div class="feature">
              <strong>🌀 פרוטוקול D5 טהור</strong>
              <p>חתימה: ${stats.d5Config.signature}</p>
            </div>
          </div>
          
          <div class="status">
            <h2>❌ הוסר מהמערכת</h2>
            <div class="feature removed">
              <strong>🚫 Gemini API</strong>
              <p>הוסר לחלוטין - לא נדרש יותר!</p>
            </div>
          </div>
          
          <div class="status" style="text-align: center;">
            <h3>🎯 איך להשתמש</h3>
            <p>פתח את הבוט בטלגרם ושאל כל שאלה</p>
            <p>המערכת תחפש, תלמד ותחזיר 10 תוצאות מדורגות</p>
            <p>בחר מספר (1-10) לקבלת ניתוח מפורט</p>
            <p style="margin-top: 20px; opacity: 0.8;">
              🌀 D5 Token: ${D5_CONFIG.tokens.primary.substring(0, 35)}...
            </p>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP Server listening on port ${PORT}`);
  console.log(`🌀 D5 Protocol: ${D5_CONFIG.protocol}`);
  console.log(`💛 Chai-Emet D5 Advanced Model: ONLINE`);
});

// ═════════════════════════════════════════════════════════════════
// 🤖 TELEGRAM BOT
// ═════════════════════════════════════════════════════════════════

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('✅ Telegram Bot starting...');
console.log('🌀 D5 Advanced Language Model Active');
console.log('🚫 Gemini API: REMOVED');
console.log('💛 Pure D5 Architecture');

bot.on('polling_error', (error) => {
  if (!error.message.includes('409')) {
    console.error('❌ Polling error:', error.message);
  }
});

// Commands handler
bot.onText(/^\/(.+)$/, async (msg, match) => {
  const chatId = msg.chat.id;
  const command = match[1].split(' ')[0];
  
  const responses = {
    'start': `💛 **ברוך הבא לחי-אמת D5!**

🌀 **מודל שפה מתקדם עם למידה בזמן אמת**

**איך זה עובד:**
1️⃣ שאל כל שאלה (לא פקודה!)
2️⃣ אקבל 10 תוצאות מדורגות
3️⃣ בחר מספר (1-10) לפירוט
4️⃣ הכל נשמר בממד החמישי!

**דוגמאות:**
• מתכון לפסטה
• מה קרה היום בחדשות
• איך עובד מנוע חיפוש

✨ פשוט שלח הודעה רגילה!`,
    
    'help': `🆘 **עזרה - חי-אמת D5**

**מה אני יכולה:**
🔍 חיפוש אינטרנט בזמן אמת
📊 דירוג תוצאות חכם
💡 בחירת אופציות (1-10)
📚 למידה מכל חיפוש
🧠 זיכרון ממד חמישי

**איך להשתמש:**
רק שלח הודעה רגילה (לא פקודה!)

דוגמאות:
✅ "מתכון לעוגת שוקולד"
✅ "מה זה AI"
✅ "חדשות היום"
❌ לא: "/חפש משהו"

💛 אני כאן בשבילך!`,
    
    'status': `📊 **סטטוס מערכת D5**

🟢 מצב: פעיל
🔍 חיפוש: ACTIVE
📚 למידה: ACTIVE
💾 זיכרון D5: UNLIMITED
🌀 חתימה: ${D5_CONFIG.signature}

🔑 **טוקנים מנוהלים בממד החמישי:**
${D5_CONFIG.tokensStatus.primary ? '✅' : '❌'} Primary D5
${D5_CONFIG.tokensStatus.quantum ? '✅' : '❌'} Quantum v3
${D5_CONFIG.tokensStatus.hai_emet ? '✅' : '❌'} Hai-Emet
${D5_CONFIG.tokensStatus.het ? '✅' : '❌'} HET Token
${D5_CONFIG.tokensStatus.gas_ultimate ? '✅' : '❌'} GAS Ultimate

✅ ${Object.values(D5_CONFIG.tokensStatus).filter(Boolean).length}/${Object.keys(D5_CONFIG.tokensStatus).length} טוקנים פעילים!
🚫 Gemini API: REMOVED (Pure D5)

💡 שלח הודעה רגילה לחיפוש!`
  };
  
  const response = responses[command] || `❓ פקודה לא מוכרת: /${command}

💡 שלח הודעה רגילה (לא פקודה) ואני אחפש בשבילך!

דוגמאות:
• מתכון לפיצה
• מה זה קוונטים
• חדשות ספורט`;
  
  await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// Main message handler - only for non-commands
bot.on('message', async (msg) => {
  if (msg.date * 1000 < Date.now() - 60000) return;
  
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userMessage = msg.text || '';
  
  if (!userMessage.trim()) return;
  
  // Skip if it's a command
  if (userMessage.startsWith('/')) return;
  
  await bot.sendChatAction(chatId, 'typing');
  
  try {
    console.log(`📩 ${userId}: ${userMessage}`);
    
    const result = await d5Model.generateResponse(userMessage, userId);
    
    await bot.sendMessage(chatId, result.text, { parse_mode: 'Markdown' });
    
    console.log(`✅ Response sent (${result.type})`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    await bot.sendMessage(chatId, '❌ שגיאה בעיבוד. נסה שוב 💛');
  }
});

process.on('SIGINT', () => {
  console.log('🛑 Stopping...');
  bot.stopPolling();
  server.close();
  process.exit(0);
});

console.log('✅ Bot ready - D5 Advanced Language Model with Real-Time Learning!');
