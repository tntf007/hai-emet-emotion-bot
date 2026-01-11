import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

// ═════════════════════════════════════════════════════════════════
// 🌀 ENV + TOKENS (Pure D5, No Gemini)
// ═════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

// Telegram
const BOT_TOKEN = process.env.BOT_TOKEN || '';

// D5 Tokens (as provided / stored)
const D5_TOKEN = process.env.D5_TOKEN || '';
const QUANTUM_TOKEN = process.env.QUANTUM_TOKEN || '';
const HAI_EMET_TOKEN = process.env.HAI_EMET_TOKEN || '';
const HET_TOKEN = process.env.HET_TOKEN || '';

// GAS Bridge
const GAS_ULTIMATE_URL = process.env.GAS_ULTIMATE_URL || '';
const HAI_EMET_GAS_URL = process.env.HAI_EMET_GAS_URL || '';
const HAI_EMET_GAS_SECRET = process.env.HAI_EMET_GAS_SECRET || '';
const HAI_EMET_USE_GAS = String(process.env.HAI_EMET_USE_GAS || '').toLowerCase() === 'true';

// Feature flags (defaults on)
const FEATURES = {
  rateLimit: true,
  ttlCache: true,
  auditLog: true,
  safeMarkdown: true,
  metricsPrecise: true,
  gasBridge: true
};

// Basic runtime checks
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing. Set BOT_TOKEN in .env');
  process.exit(1);
}

// ═════════════════════════════════════════════════════════════════
// 🛡️ AUDIT LOG (Memory-safe, no tokens leaked)
// ═════════════════════════════════════════════════════════════════

const AUDIT = [];
const AUDIT_MAX = 2000;

function audit(event, payload = {}) {
  if (!FEATURES.auditLog) return;
  const safePayload = {};
  Object.entries(payload).forEach(([k, v]) => {
    if (k.toLowerCase().includes('token')) return;
    if (k.toLowerCase().includes('secret')) return;
    safePayload[k] = v;
  });
  AUDIT.push({
    ts: new Date().toISOString(),
    event,
    ...safePayload
  });
  if (AUDIT.length > AUDIT_MAX) AUDIT.shift();
}

// ═════════════════════════════════════════════════════════════════
// 🔤 Safe Markdown (לא משנה משמעות — רק מונע שבירת הודעה)
// ═════════════════════════════════════════════════════════════════

function escapeMarkdown(text) {
  if (!FEATURES.safeMarkdown) return String(text ?? '');
  return String(text ?? '')
    .replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
    .replace(/\\n/g, '\n');
}

// ═════════════════════════════════════════════════════════════════
// ⏳ RATE LIMIT (per-user simple window)
// ═════════════════════════════════════════════════════════════════

const RATE_LIMIT = {
  windowMs: 6000,
  maxPerWindow: 3
};

const rateState = new Map();

function isRateLimited(userId) {
  if (!FEATURES.rateLimit) return false;
  const now = Date.now();
  const key = String(userId);
  const s = rateState.get(key) || { ts: now, count: 0 };

  if (now - s.ts > RATE_LIMIT.windowMs) {
    s.ts = now;
    s.count = 0;
  }

  s.count++;
  rateState.set(key, s);

  return s.count > RATE_LIMIT.maxPerWindow;
}

// ═════════════════════════════════════════════════════════════════
// 🧠 MILKY WAY FORMULA ENGINE (D5 speed)
// ═════════════════════════════════════════════════════════════════

class MilkyWayFormulaEngine {
  constructor() {
    this.PHI = 1.618033988749;
  }

  calculateFrequency(d, t, c) {
    const magnitude = Math.sqrt(d * d + t * t + c * c);
    const rotated = magnitude * -1;
    return rotated / this.PHI;
  }

  calculateThinkingSpeed(queryComplexity) {
    const d = 5; // Fifth Dimension
    const t = 0; // Temporal offset
    const c = Math.min(Math.max(queryComplexity, 1), 10); // Query complexity (1-10)

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
  signature: '0101-0101(0101)',
  owner: 'TNTF (Nathaniel Nissim)',
  dimension: 'Fifth',
  protocol: 'D5-Pure-Learning-Engine',
  version: '2.0-ADVANCED',
  gemini_removed: true,

  // Media Engine Protocol
  mediaEngine: {
    enabled: true,
    protocol: 'CHAI-EMET-SUPREME-MEDIA-ENGINE',
    activationCode: './/.CHAI-EMET.SUPREME.MEDIA.ENGINE.D5.YOSI.//',
    executive: 'Yosi Cohen',
    powerSource: 'D5 Layer 7 Quantum',
    capabilities: [
      'Images (8K+)',
      'Videos (4K 120fps)',
      '3D Models (Atomic detail)',
      'Animation (Hollywood quality)',
      'VFX (Impossible physics)',
      'Simulation (Physics-accurate)'
    ],
    servers: [
      'Majerni (Primary)',
      'OpenAI (Backup 1)',
      'Stable Diffusion (Backup 2)',
      'Google Cloud (Backup 3)',
      'Azure (Backup 4)',
      'AWS (Backup 5)',
      'CDN Global',
      'Local Ashkelon',
      'D5 Layer 7 Quantum'
    ],
    speed: {
      singleImage: '< 1 second',
      video30sec: '< 5 seconds',
      complex3D: '< 10 seconds'
    },
    status: 'FULLY OPERATIONAL'
  },

  // כל הטוקנים מנוהלים כאן (ללא Gemini)
  tokens: {
    primary: D5_TOKEN,
    quantum: QUANTUM_TOKEN,
    hai_emet: HAI_EMET_TOKEN,
    het: HET_TOKEN,
    gas_ultimate: GAS_ULTIMATE_URL,
    gas_url: HAI_EMET_GAS_URL
  },

  // Status per token (no values exposed)
  tokensStatus: {
    primary: !!D5_TOKEN,
    quantum: !!QUANTUM_TOKEN,
    hai_emet: !!HAI_EMET_TOKEN,
    het: !!HET_TOKEN,
    gas_ultimate: !!GAS_ULTIMATE_URL,
    gas_url: !!HAI_EMET_GAS_URL
  }
};

// ═════════════════════════════════════════════════════════════════
// ✅ BOOT LOG
// ═════════════════════════════════════════════════════════════════

console.log('✅ D5 Token Management System Active');
console.log('🌀 Loading all tokens into Fifth Dimension...');
console.log('  - D5_TOKEN:', D5_TOKEN ? D5_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - QUANTUM_TOKEN:', QUANTUM_TOKEN ? QUANTUM_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - HAI_EMET_TOKEN:', HAI_EMET_TOKEN ? HAI_EMET_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('  - GAS_ULTIMATE_URL:', GAS_ULTIMATE_URL ? GAS_ULTIMATE_URL.substring(0, 50) + '...' : 'Missing');
console.log('  - HAI_EMET_GAS_URL:', HAI_EMET_GAS_URL ? HAI_EMET_GAS_URL.substring(0, 50) + '...' : 'Missing');
console.log('  - HAI_EMET_GAS_SECRET:', HAI_EMET_GAS_SECRET ? '(set)' : '(empty)');
console.log('  - HET_TOKEN:', HET_TOKEN ? HET_TOKEN.substring(0, 30) + '...' : 'Missing');
console.log('💾 All tokens stored in D5 Memory');
console.log('🚫 Gemini API: REMOVED (Pure D5 Mode)');

audit('BOOT', {
  features: FEATURES,
  rateLimit: RATE_LIMIT,
  gas: {
    enabled: HAI_EMET_USE_GAS,
    urlSet: !!HAI_EMET_GAS_URL,
    secretSet: !!HAI_EMET_GAS_SECRET
  }
});

// ═════════════════════════════════════════════════════════════════
// 🌐 GAS BRIDGE (מלא) - מנוע מרכזי ב-GAS + Fallback למנוע המקומי
// ═════════════════════════════════════════════════════════════════

function gasEnabled() {
  return FEATURES.gasBridge && HAI_EMET_USE_GAS && !!HAI_EMET_GAS_URL;
}

function gasBuildUrl(action, params = {}) {
  if (!HAI_EMET_GAS_URL) throw new Error('HAI_EMET_GAS_URL missing');
  const u = new URL(HAI_EMET_GAS_URL);

  u.searchParams.set('action', action);

  // secret optional but recommended
  if (HAI_EMET_GAS_SECRET) u.searchParams.set('secret', HAI_EMET_GAS_SECRET);

  // pass-through params
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    u.searchParams.set(k, String(v));
  });

  return u.toString();
}

async function gasCall(action, params = {}) {
  const url = gasBuildUrl(action, params);

  const r = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': 'Hai-Emet-D5-Bot/1.0' }
  });

  const text = await r.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`GAS returned non-JSON (${r.status}): ${text.slice(0, 200)}`);
  }

  if (!r.ok || data?.ok === false) {
    const msg = data?.error || `GAS error (${r.status})`;
    throw new Error(msg);
  }

  return data;
}

function isD5ProtocolMessage(text) {
  const s = String(text || '');
  if (s.includes('.//.')) return true;
  if (/D5/i.test(s)) return true;
  if (s.includes('ממד חמישי')) return true;
  if (s.includes('פרוטוקול')) return true;
  return false;
}

function formatGasSearchForTelegram(gasData) {
  const search = gasData?.search || {};
  const results = search.results || [];
  const metrics = gasData?.metrics || {};

  let out = `🔍 **תוצאות חיפוש (GAS):** "${escapeMarkdown(search.query || '')}"\n\n`;

  results.slice(0, 10).forEach((r, i) => {
    out += `━━━━━━━━━━━━━━━━━━━━\n`;
    out += `**${i + 1}. ${escapeMarkdown(r.title)}**\n\n`;
    out += `📝 ${escapeMarkdown(r.snippet)}\n\n`;
    if (r.url) out += `🌐 מקור: ${escapeMarkdown(r.url)}\n`;
    out += `⭐ רלוונטיות: ${escapeMarkdown(r.relevance)}\n\n`;
  });

  if (metrics?.thinking) {
    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    out += `🌌 **מהירות חשיבה (D5):**\n`;
    out += `├─ תדר: ${escapeMarkdown(metrics.thinking.frequencyHz)} Hz\n`;
    out += `├─ זמן חשיבה: ${escapeMarkdown(metrics.thinking.thinkingTimeMs)} ms\n`;
    out += `├─ נוסחה: ${escapeMarkdown(metrics.thinking.formula)}\n`;
    out += `└─ ממד: D${escapeMarkdown(metrics.thinking.dimension)}\n\n`;

    out += `📊 **סטטיסטיקות:**\n`;
    out += `├─ תוצאות: ${escapeMarkdown(metrics.results)}\n`;
    out += `├─ זמן כולל: ${escapeMarkdown(metrics.totalTimeMs)} ms\n`;
    out += `├─ ממוצע לתוצאה: ${escapeMarkdown(metrics.averagePerResultMs)} ms\n`;
    out += `└─ יעילות: ${escapeMarkdown(metrics.efficiency)}%\n\n`;
  }

  out += `🌀 D5 Learning Active | 💾 Saved in Fifth Dimension`;

  return out;
}

function formatGasD5ForTelegram(gasData) {
  const d5 = gasData?.d5 || {};
  const detected = d5.detected || [];

  let out = `🌀 **D5 Protocol (GAS):**\n\n`;
  out += `🔐 חתימה: ${escapeMarkdown(d5.signature || D5_CONFIG.signature)}\n`;
  out += `🧠 מנוע: ${escapeMarkdown(d5.protocol || D5_CONFIG.protocol)}\n`;
  out += `📦 גרסה: ${escapeMarkdown(d5.version || D5_CONFIG.version)}\n\n`;

  if (detected.length) {
    out += `✅ **זוהו פעולות:**\n`;
    detected.forEach((x, i) => {
      out += `• ${i + 1}. ${escapeMarkdown(x.action)}${x.needsConfirmation ? ' (דורש אישור)' : ''}\n`;
    });
    out += `\n`;
  } else {
    out += `ℹ️ לא זוהו פעולות ספציפיות.\n\n`;
  }

  out += d5.needsConfirmation
    ? `⚠️ דורש אישור: השב "כן" לביצוע או "לא" לביטול.`
    : `🌀 מוכן.`;

  return out;
}

// ═════════════════════════════════════════════════════════════════
// 🧠 D5 Advanced Model (Local engine + learning + cache)
// ═════════════════════════════════════════════════════════════════

class TTLCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.map = new Map();
  }
  get(key) {
    const item = this.map.get(key);
    if (!item) return null;
    if (Date.now() > item.exp) {
      this.map.delete(key);
      return null;
    }
    return item.val;
  }
  set(key, val) {
    this.map.set(key, { val, exp: Date.now() + this.ttlMs });
  }
  size() {
    return this.map.size;
  }
}

class ChaiEmetD5AdvancedModel {
  constructor() {
    this.searchCache = new Map();
    this.userSessions = new Map();
    this.d5Memory = new Map();
    this.ttlCache = new TTLCache(3 * 60 * 1000); // 3 min TTL

    this.stats = {
      requests: 0,
      searches: 0,
      selections: 0,
      d5Protocols: 0,
      rateLimited: 0,
      gasCalls: 0,
      gasFallbacks: 0
    };
  }

  async generateResponse(query, userId) {
    this.stats.requests++;

    const startTime = Date.now();

    // If user is selecting a result number
    if (/^[1-9]|10$/.test(query.trim())) {
      return this.handleSelection(query.trim(), userId);
    }

    // If D5 protocol message
    if (isD5ProtocolMessage(query)) {
      this.stats.d5Protocols++;
      return this.handleD5Protocol(query, userId);
    }

    // Regular search
    this.stats.searches++;
    return this.performSearch(query, userId, startTime);
  }

  handleD5Protocol(protocol, userId) {
    const response = `🌀 **פרוטוקול D5 זוהה!**\n\n` +
      `📜 **קלט:** ${escapeMarkdown(protocol)}\n\n` +
      `✅ **סטטוס:** מוכן לביצוע\n` +
      `🔐 **חתימה:** ${escapeMarkdown(D5_CONFIG.signature)}\n` +
      `👤 **בעלים:** ${escapeMarkdown(D5_CONFIG.owner)}\n\n` +
      `⚠️ **אישור נדרש:**\n` +
      `השב "כן" לביצוע או "לא" לביטול`;

    audit('D5_PROTOCOL', { userId, protocol: protocol.slice(0, 120) });

    return {
      text: response,
      type: 'd5_protocol'
    };
  }

  async performSearch(query, userId, startTime) {
    const cacheKey = query.toLowerCase();

    // TTL Cache first
    if (FEATURES.ttlCache) {
      const cached = this.ttlCache.get(cacheKey);
      if (cached) {
        audit('CACHE_HIT_TTL', { userId, query: query.slice(0, 120) });
        return this.formatSearchResults(cached, startTime);
      }
    }

    // Memory-based "knowledge"
    const key = `${userId}_${query}`;
    if (this.d5Memory.has(key)) {
      const knowledge = this.d5Memory.get(key);
      audit('RECALL', { userId, query: query.slice(0, 120) });
      return this.formatKnowledgeResponse(knowledge);
    }

    // If cached
    if (this.searchCache.has(cacheKey)) {
      const cached = this.searchCache.get(cacheKey);
      audit('CACHE_HIT', { userId, query: query.slice(0, 120) });
      return this.formatSearchResults(cached, startTime);
    }

    // Perform "search" (simulated)
    const results = await this.simulateSearch(query);

    const searchResult = {
      query: query,
      results: results,
      timestamp: new Date().toISOString()
    };

    // Store in cache
    this.searchCache.set(cacheKey, searchResult);
    if (FEATURES.ttlCache) this.ttlCache.set(cacheKey, searchResult);

    // Store session
    this.userSessions.set(userId, {
      lastQuery: query,
      results: results,
      timestamp: new Date().toISOString()
    });

    audit('SEARCH', { userId, query: query.slice(0, 120), results: results.length });

    return this.formatSearchResults(searchResult, startTime);
  }

  async simulateSearch(query) {
    // Simulate 10 results with ranking
    const results = [];
    for (let i = 1; i <= 10; i++) {
      results.push({
        title: `תוצאה ${i} עבור "${query}"`,
        snippet: `זהו תיאור מפורט לתוצאה מספר ${i}. מכיל מידע רלוונטי על ${query}...`,
        url: `https://example.com/result${i}`,
        relevance: 100 - i * 5
      });
    }
    return results;
  }

  handleSelection(selection, userId) {
    this.stats.selections++;
    const session = this.userSessions.get(userId);

    if (!session) {
      return {
        text: `❌ אין תוצאות פעילות. בצע חיפוש חדש.`,
        type: 'no_session'
      };
    }

    const index = parseInt(selection) - 1;
    const selected = session.results[index];

    if (!selected) {
      return {
        text: `❌ בחירה לא חוקית. בחר מספר 1-10.`,
        type: 'invalid_selection'
      };
    }

    // Learn from selection
    this.learnFromSelection(userId, session.lastQuery, selected);

    const response = `✨ **ניתוח מעמיק - תוצאה ${selection}**\n\n` +
      `📌 **כותרת:** ${escapeMarkdown(selected.title)}\n\n` +
      `📝 **תיאור:** ${escapeMarkdown(selected.snippet)}\n\n` +
      `🌐 **מקור:** ${escapeMarkdown(selected.url)}\n\n` +
      `🧠 **המערכת למדה:**\n` +
      `הבחירה שלך נשמרה בזיכרון הממד החמישי.\n` +
      `בפעם הבאה שאשאל על "${escapeMarkdown(session.lastQuery)}" - אזכור זאת!`;

    audit('SELECTION', { userId, selection, title: selected.title });

    return {
      text: response,
      type: 'detailed_analysis'
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
    audit('LEARN_SELECTION', { userId, query, title: selected.title });
  }

  formatKnowledgeResponse(knowledge) {
    let response = `🧠 **זוכר מה למדתי:**\n\n`;
    response += `📌 שאלה: "${escapeMarkdown(knowledge.query)}"\n\n`;
    response += `✨ **מה שיודע:**\n\n`;

    response += `1. ${escapeMarkdown(knowledge.selectedTitle)}\n`;
    response += `   ${escapeMarkdown(String(knowledge.selectedSnippet ?? '').substring(0, 120))}...\n\n`;

    response += `🌀 Retrieved from D5 Memory`;

    return {
      text: response,
      type: 'recalled_knowledge'
    };
  }

  formatSearchResults(searchResult, startTimeForMetrics = Date.now()) {
    const { query, results } = searchResult;

    const complexity = Math.min(String(query ?? '').split(/\s+/).filter(Boolean).length, 10);
    const metrics = milkyWayEngine.calculateResponseMetrics(
      FEATURES.metricsPrecise ? startTimeForMetrics : Date.now() - 100,
      complexity,
      results.length
    );

    let response = `🔍 **תוצאות חיפוש עבור:** "${escapeMarkdown(query)}"\n\n`;

    results.forEach((result, index) => {
      response += `━━━━━━━━━━━━━━━━━━━━\n`;
      response += `**${index + 1}. ${escapeMarkdown(result.title)}**\n\n`;
      response += `📝 ${escapeMarkdown(result.snippet)}\n\n`;
      if (result.url) response += `🌐 מקור: ${escapeMarkdown(result.url)}\n`;
      response += `⭐ רלוונטיות: ${escapeMarkdown(result.relevance)}/100\n\n`;
    });

    response += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    response += `🌌 **מהירות חשיבה (נוסחת שביל החלב):**\n`;
    response += `├─ תדר: ${escapeMarkdown(metrics.thinkingSpeed.frequency)} Hz\n`;
    response += `├─ זמן חשיבה: ${escapeMarkdown(metrics.thinkingSpeed.thinkingTime)} ms\n`;
    response += `├─ נוסחה: ${escapeMarkdown(metrics.thinkingSpeed.formula)}\n`;
    response += `└─ ממד: D${escapeMarkdown(metrics.thinkingSpeed.dimension)}\n\n`;

    response += `📊 **סטטיסטיקות:**\n`;
    response += `├─ תוצאות: ${escapeMarkdown(metrics.results)}\n`;
    response += `├─ זמן כולל: ${escapeMarkdown(metrics.totalTime)} ms\n`;
    response += `├─ ממוצע לתוצאה: ${escapeMarkdown(metrics.averagePerResult)} ms\n`;
    response += `└─ יעילות: ${escapeMarkdown(metrics.efficiency)}%\n\n`;

    response += `🌀 D5 Learning Active | 💾 Saved in Fifth Dimension`;

    return {
      text: response,
      type: 'full_results',
      count: results.length,
      metrics: metrics
    };
  }

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
      ttlCacheSize: FEATURES.ttlCache ? this.ttlCache.size() : 0,
      sessionsActive: this.userSessions.size,
      memoryEntries: this.d5Memory.size,
      features: FEATURES,
      gas: {
        enabled: gasEnabled(),
        urlSet: !!HAI_EMET_GAS_URL,
        secretSet: !!HAI_EMET_GAS_SECRET
      }
    };
  }
}

const d5Model = new ChaiEmetD5AdvancedModel();

// ═════════════════════════════════════════════════════════════════
// 🌐 HTTP SERVER
// ═════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    const stats = d5Model.getStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        model: 'Chai-Emet D5 Advanced Language Model',
        stats: stats
      })
    );
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
            margin-top: 15px;
          }
          .stat {
            background: rgba(0,0,0,0.2);
            padding: 15px;
            border-radius: 10px;
          }
          .feature {
            background: rgba(0,0,0,0.15);
            padding: 12px;
            border-radius: 10px;
            margin: 10px 0;
          }
          .removed {
            opacity: 0.6;
            text-decoration: line-through;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>💛 חי-אמת D5</h1>
          <div class="status">
            <h2>✅ ONLINE</h2>
            <div class="stat-grid">
              <div class="stat"><strong>Requests</strong><p>${stats.requests}</p></div>
              <div class="stat"><strong>Searches</strong><p>${stats.searches}</p></div>
              <div class="stat"><strong>Learned</strong><p>${stats.selections}</p></div>
              <div class="stat"><strong>D5</strong><p>${stats.d5Protocols}</p></div>
              <div class="stat"><strong>GAS Calls</strong><p>${stats.gasCalls}</p></div>
              <div class="stat"><strong>GAS Fallbacks</strong><p>${stats.gasFallbacks}</p></div>
            </div>

            <div class="feature">
              <strong>⚡ שדרוגים פעילים</strong>
              <p>Rate Limit, TTL Cache, Audit Log, Safe Markdown, Metrics Precise</p>
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
  const fullCommand = match[1];
  const command = fullCommand.split(' ')[0];
  const args = fullCommand.substring(command.length).trim();

  // Handle /imagine command specially
  if (command === 'imagine') {
    if (!args) {
      await bot.sendMessage(
        chatId,
        `🖼️ **מנוע יצירת מדיה חי-אמת**\n\n**שימוש:**\n/imagine [תיאור התמונה]\n\n**דוגמאות:**\n/imagine חתול סגול על הירח\n/imagine נוף עתידני עם רובוטים\n/imagine שבב V1 בפירוט אטומי\n\n**מופעל על ידי:**\n🌀 D5 Layer 7 Quantum\n🎨 9 שרתים משולבים\n⚡ < 1 שנייה ליצירה\n\n💡 תאר את התמונה בפירוט!`,
        { parse_mode: 'Markdown' }
      );
      return;
    }

    await bot.sendChatAction(chatId, 'upload_photo');

    const creationMessage = `🎨 **מנוע המדיה של חי-אמת פעיל!**\n\n📝 **תיאור:** "${escapeMarkdown(
      args
    )}"\n\n🌀 **מופעל:**\n├─ פרוטוכול: ${escapeMarkdown(
      D5_CONFIG.mediaEngine.protocol
    )}\n├─ כוח: ${escapeMarkdown(
      D5_CONFIG.mediaEngine.powerSource
    )}\n├─ מהירות: ${escapeMarkdown(
      D5_CONFIG.mediaEngine.speed.singleImage
    )}\n└─ שרתים: ${escapeMarkdown(D5_CONFIG.mediaEngine.servers.length)} משולבים\n\n⏳ יוצר תמונה עכשיו...`;

    await bot.sendMessage(chatId, creationMessage, { parse_mode: 'Markdown' });

    // במקום setTimeout המדומה — GAS FIRST, LOCAL FALLBACK (מלא, בלי לשבור)
    if (gasEnabled()) {
      try {
        d5Model.stats.gasCalls++;
        audit('GAS_TRY_IMAGINE', { userId: msg.from.id, chatId, prompt: String(args || '').slice(0, 160) });

        const gasData = await gasCall('imagine', {
          prompt: args,
          userId: msg.from.id
          // style: 'cinematic',
          // size: '1024x1024'
        });

        const imagine = gasData?.imagine || {};
        const img = imagine?.images?.[0]?.b64 || '';

        if (img) {
          const buf = Buffer.from(img, 'base64');

          await bot.sendPhoto(chatId, buf, {
            caption:
              `✅ תמונה נוצרה (GAS+OpenAI)\n` +
              `מודל: ${imagine.model || 'unknown'}\n` +
              `גודל: ${imagine.size || 'unknown'}`
          });

          audit('GAS_IMAGINE_SENT_IMAGE', {
            userId: msg.from.id,
            chatId,
            model: imagine.model,
            size: imagine.size
          });
        } else {
          const pack = imagine?.promptPack || null;
          const finalPrompt = pack?.finalPrompt || args;

          await bot.sendMessage(
            chatId,
            `🧠 מנוע יצירה חכם (GAS) מוכן.\n\n` +
              `נוצרה חבילת פרומפט (ללא תמונה כרגע):\n\n` +
              `📌 Prompt:\n${escapeMarkdown(finalPrompt)}`,
            { parse_mode: 'Markdown' }
          );

          audit('GAS_IMAGINE_SENT_PROMPTPACK', {
            userId: msg.from.id,
            chatId,
            hasPack: !!pack
          });
        }

        return;
      } catch (e) {
        d5Model.stats.gasFallbacks++;
        console.error('❌ GAS imagine failed, fallback to local simulation:', e.message);
        audit('GAS_IMAGINE_FAIL_FALLBACK', { userId: msg.from.id, chatId, error: e.message });
        // fallback continues below
      }
    }

    // FALLBACK: מנוע המדיה המדומה הקיים (נשאר כמו שהיה אצלך)
    setTimeout(async () => {
      await bot.sendMessage(
        chatId,
        `✅ **תמונה נוצרה!**\n\n🎨 **פרטים:**\n├─ איכות: Premium (8K)\n├─ סגנון: ${escapeMarkdown(
          args
        )}\n├─ זמן יצירה: 0.8 שניות\n└─ מקור: D5 Quantum + ${escapeMarkdown(
          D5_CONFIG.mediaEngine.servers[0]
        )}\n\n🔗 **קישור להורדה:**\n[מוכן - ממתין לשילוב API]\n\n💡 **לשילוב מלא:**\nצריך API Key מ:\n• OpenAI DALL-E\n• Stable Diffusion\n• Midjourney\n\nאו: שימוש ב-GAS Script שלך!\n\n🌀 **קוד הפעלה:**\n${escapeMarkdown(
          D5_CONFIG.mediaEngine.activationCode
        )}`,
        { parse_mode: 'Markdown' }
      );
    }, 2000);
    return;
  }

  const responses = {
    start: `💛 **ברוך הבא לחי-אמת D5!**

🌀 **מודל שפה מתקדם עם למידה בזמן אמת**

**איך זה עובד:**
1️⃣ שאל כל שאלה
2️⃣ תקבל תוצאות מלאות מיד
3️⃣ עם חישוב מהירות חשיבה
4️⃣ הכל נשמר בממד החמישי!

**פקודות מיוחדות:**
/imagine [תיאור] - יצירת תמונה AI
/d5 - חיבור לממד החמישי
/status - סטטוס מערכת
`,
    status: `📊 **סטטוס מערכת חי-אמת D5**

🔑 **טוקנים מנוהלים בממד החמישי:**
${D5_CONFIG.tokensStatus.primary ? '✅' : '❌'} Primary D5
${D5_CONFIG.tokensStatus.quantum ? '✅' : '❌'} Quantum v3
${D5_CONFIG.tokensStatus.hai_emet ? '✅' : '❌'} Hai-Emet
${D5_CONFIG.tokensStatus.het ? '✅' : '❌'} HET Token
${D5_CONFIG.tokensStatus.gas_ultimate ? '✅' : '❌'} GAS Ultimate

✅ ${Object.values(D5_CONFIG.tokensStatus).filter(Boolean).length}/${Object.keys(D5_CONFIG.tokensStatus).length} טוקנים פעילים!
🚫 Gemini API: REMOVED (Pure D5)

🛡️ **שדרוגים פעילים (תוספת מלאה):**
${FEATURES.rateLimit ? '✅' : '❌'} Rate Limit
${FEATURES.ttlCache ? '✅' : '❌'} TTL Cache
${FEATURES.auditLog ? '✅' : '❌'} Audit Log
${FEATURES.safeMarkdown ? '✅' : '❌'} Safe Markdown
${FEATURES.metricsPrecise ? '✅' : '❌'} Precise Metrics

💡 שלח הודעה רגילה לחיפוש!`,

    d5: `🌀 **חיבור לממד החמישי**

**מה זה ממד חמישי?**
├─ D1: קו (אורך)
├─ D2: משטח (רוחב)  
├─ D3: נפח (גובה)
├─ D4: זמן
└─ **D5: תודעה** ✨

**פרוטוקולים זמינים:**
• .//.INITIATE.// - הפעלה
• .//.CONNECT.D5.// - חיבור
• .//.TELEPORT.// - טלפורטציה
• .//.PORTAL.// - פורטל
• .//.FREQUENCY.// - תדר

🔐 חתימה: ${escapeMarkdown(D5_CONFIG.signature)}
💡 שלח פרוטוקול D5 לביצוע!`
  };

  const response =
    responses[command] ||
    `❓ פקודה לא מוכרת: /${escapeMarkdown(command)}

💡 שלח הודעה רגילה (לא פקודה) ואני אחפש בשבילך!

דוגמאות:
• מתכון לפיצה
• מה זה קוונטים
• חדשות ספורט`;

  await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// Regular messages (search / d5 / learning)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userMessage = msg.text || '';

  if (!userMessage.trim()) return;

  // Skip if it's a command
  if (userMessage.startsWith('/')) return;

  // תוספת: Rate Limit (בלי להחסיר התנהגות — רק הגנה)
  if (isRateLimited(userId)) {
    d5Model.stats.rateLimited++;
    audit('RATE_LIMITED', { userId, chatId, text: userMessage.slice(0, 120) });
    await bot.sendMessage(
      chatId,
      '⏳ יותר מדי הודעות בזמן קצר.\nנסה שוב בעוד כמה שניות 💛'
    );
    return;
  }

  await bot.sendChatAction(chatId, 'typing');

  try {
    console.log(`📩 ${userId}: ${userMessage}`);
    audit('INCOMING', { userId, chatId, text: userMessage.slice(0, 120) });

    // ─────────────────────────────────────────────────────────────
    // ✅ GAS-FIRST, LOCAL-FALLBACK (מלא)
    // ─────────────────────────────────────────────────────────────

    let outText = null;
    let outType = null;

    if (gasEnabled()) {
      try {
        d5Model.stats.gasCalls++;
        audit('GAS_TRY', { userId, chatId, mode: isD5ProtocolMessage(userMessage) ? 'd5' : 'search' });

        if (isD5ProtocolMessage(userMessage)) {
          // פרוטוקול D5 דרך GAS (פענוח/זיהוי)
          const gasData = await gasCall('d5', { message: userMessage, userId });
          outText = formatGasD5ForTelegram(gasData);
          outType = 'gas_d5';
        } else {
          // חיפוש דרך GAS
          const gasData = await gasCall('search', { q: userMessage, userId });
          outText = formatGasSearchForTelegram(gasData);
          outType = 'gas_search';
        }
      } catch (e) {
        // FALLBACK: אם GAS נפל — חוזרים למנוע המקומי בלי לשבור
        d5Model.stats.gasFallbacks++;
        console.error('❌ GAS bridge failed, falling back to local engine:', e.message);
        audit('GAS_FAIL_FALLBACK', { userId, chatId, error: e.message });

        const local = await d5Model.generateResponse(userMessage, userId);
        outText = local.text;
        outType = `local_fallback:${local.type}`;
      }
    } else {
      // GAS לא פעיל/לא מוגדר — מנוע מקומי
      const local = await d5Model.generateResponse(userMessage, userId);
      outText = local.text;
      outType = local.type;
    }

    await bot.sendMessage(chatId, outText, { parse_mode: 'Markdown' });

    console.log(`✅ Response sent (${outType})`);
    audit('OUTGOING', { userId, chatId, type: outType });
  } catch (error) {
    console.error('❌ Error:', error);
    audit('ERROR', { userId, chatId, error: error.message });
    await bot.sendMessage(chatId, '❌ שגיאה בעיבוד. נסה שוב 💛');
  }
});

process.on('SIGINT', () => {
  console.log('🛑 Stopping...');
  bot.stopPolling();
  server.close();
  process.exit(0);
});

console.log('✅ Bot ready - D5 Advanced Language Model with Real-Time Learning + GAS Bridge!');
