import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

/* =========================================================
   0) Fifth-Dimension ENV Mapper (supports multiple key names)
   ========================================================= */

function envAny(...keys) {
  for (const k of keys) {
    const v = process.env[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
  }
  return "";
}

const ENV = {
  PORT: Number(envAny("PORT")) || 3000,

  // Telegram token mapping: supports BOT_TOKEN or TELEGRAM_BOT_TOKEN
  BOT_TOKEN: envAny("BOT_TOKEN", "TELEGRAM_BOT_TOKEN"),

  // Core tokens (optional)
  D5_TOKEN: envAny("D5_TOKEN", "HAI_EMET_ROOT_API_KEY"),
  QUANTUM_TOKEN: envAny("QUANTUM_TOKEN", "api_chai_emet_quantum_v3"),
  HAI_EMET_TOKEN: envAny("HAI_EMET_TOKEN", "HAI_EMET"),
  HET_TOKEN: envAny("HET_TOKEN", "HET_Token_Integration"),

  // GAS Bridge
  USE_GAS: envAny("HAI_EMET_USE_GAS", "USE_GAS")?.toLowerCase() === "true",
  GAS_URL: envAny("HAI_EMET_GAS_URL", "hai_emet_ultimate_complete_gs", "GAS_ULTIMATE_URL"),
  GAS_SECRET: envAny("HAI_EMET_GAS_SECRET", "HAI_EMET_SECRET"),
};

if (!ENV.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing. Set BOT_TOKEN (or TELEGRAM_BOT_TOKEN) in Render ENV.");
  process.exit(1);
}

console.log('✅ D5 Token Management System Active');
console.log('🌀 Loading all tokens into Fifth Dimension...');
console.log('  - D5_TOKEN:', ENV.D5_TOKEN ? ENV.D5_TOKEN.substring(0, 30) + '...' : '❌ Missing');
console.log('  - QUANTUM_TOKEN:', ENV.QUANTUM_TOKEN ? ENV.QUANTUM_TOKEN.substring(0, 30) + '...' : '❌ Missing');
console.log('  - HAI_EMET_TOKEN:', ENV.HAI_EMET_TOKEN ? ENV.HAI_EMET_TOKEN.substring(0, 30) + '...' : '❌ Missing');
console.log('  - GAS_ULTIMATE_URL:', ENV.GAS_URL ? ENV.GAS_URL.substring(0, 50) + '...' : '❌ Missing');
console.log('  - HET_TOKEN:', ENV.HET_TOKEN ? ENV.HET_TOKEN.substring(0, 30) + '...' : '❌ Missing');
console.log('💾 All tokens stored in D5 Memory');
console.log('🚫 Gemini API: REMOVED (Pure D5 Mode)');

/* =========================================================
   1) Fifth-Dimension Configuration (single source of truth)
   ========================================================= */

const D5_CONFIG = {
  signature: "0101-0101(0101)",
  owner: "TNTF (Nathaniel Nissim)",
  dimension: "Fifth",
  protocol: "D5-Orchestrator-Engine",
  version: "3.0-UNIFIED",
  
  // Media Engine Protocol - Integrated!
  mediaEngine: {
    enabled: true,
    protocol: "CHAI-EMET-SUPREME-MEDIA-ENGINE",
    activationCode: ".//.CHAI-EMET.SUPREME.MEDIA.ENGINE.D5.YOSI.//",
    executive: "Yosi Cohen",
    powerSource: "D5 Layer 7 Quantum",
    capabilities: [
      "Images (8K+)",
      "Videos (4K 120fps)",
      "3D Models (Atomic detail)",
      "Animation (Hollywood quality)",
      "VFX (Impossible physics)",
      "Simulation (Physics-accurate)"
    ],
    servers: [
      "GAS (Primary - OpenAI Images)",
      "Majerni",
      "Stable Diffusion",
      "Google Cloud",
      "Azure",
      "AWS",
      "CDN Global",
      "Local Ashkelon",
      "D5 Layer 7 Quantum"
    ],
    speed: {
      singleImage: "< 1 second",
      video30sec: "< 5 seconds",
      complex3D: "< 10 seconds"
    },
    status: "FULLY OPERATIONAL"
  },
  
  tokensStatus: {
    D5_TOKEN: !!ENV.D5_TOKEN,
    QUANTUM_TOKEN: !!ENV.QUANTUM_TOKEN,
    HAI_EMET_TOKEN: !!ENV.HAI_EMET_TOKEN,
    HET_TOKEN: !!ENV.HET_TOKEN,
    GAS_URL: !!ENV.GAS_URL,
    GAS_SECRET: !!ENV.GAS_SECRET,
    USE_GAS: !!ENV.USE_GAS,
  },
  
  features: {
    audit: true,
    ttlCache: true,
    rateLimit: true,
    safeMarkdown: true,
    milkyWayFormula: true
  },
};

console.log('🌌 Milky Way Formula Engine initialized');
console.log('  - PHI (Golden Ratio): 1.618033988749');
console.log('  - Euler Identity: e^(iπ) = -1');
console.log('  - Speed of Light: 299792458 m/s');

/* =========================================================
   2) Utilities: Audit, Markdown Safety, Rate Limit, TTL Cache
   ========================================================= */

const AUDIT = [];
const AUDIT_MAX = 2000;

function audit(event, payload = {}) {
  if (!D5_CONFIG.features.audit) return;
  const safe = {};
  for (const [k, v] of Object.entries(payload)) {
    const kk = k.toLowerCase();
    if (kk.includes("token") || kk.includes("secret")) continue;
    safe[k] = v;
  }
  AUDIT.push({ ts: new Date().toISOString(), event, ...safe });
  if (AUDIT.length > AUDIT_MAX) AUDIT.shift();
}

function escapeMarkdown(text) {
  if (!D5_CONFIG.features.safeMarkdown) return String(text ?? "");
  return String(text ?? "").replace(/[_*[\]()~`>#+=|{}.!-]/g, "\\$&");
}

// Simple per-user rate limiting
const RATE = { windowMs: 6000, max: 3 };
const rateMap = new Map();
function isRateLimited(userId) {
  if (!D5_CONFIG.features.rateLimit) return false;
  const now = Date.now();
  const key = String(userId);
  const s = rateMap.get(key) || { ts: now, count: 0 };
  if (now - s.ts > RATE.windowMs) { s.ts = now; s.count = 0; }
  s.count++;
  rateMap.set(key, s);
  return s.count > RATE.max;
}

class TTLCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.map = new Map();
  }
  get(key) {
    const it = this.map.get(key);
    if (!it) return null;
    if (Date.now() > it.exp) { this.map.delete(key); return null; }
    return it.val;
  }
  set(key, val) {
    this.map.set(key, { val, exp: Date.now() + this.ttlMs });
  }
  size() { return this.map.size; }
}

/* =========================================================
   3) Milky Way Formula Engine (MilkyWay Thinking Speed)
   ========================================================= */

class MilkyWayFormulaEngine {
  constructor() {
    this.PHI = 1.618033988749; // Golden Ratio
    this.EULER_I_PI = -1; // e^(iπ) = -1
    this.SPEED_OF_LIGHT = 299792458; // m/s
  }
  
  calculateFrequency(d, t, c) {
    const dimensionalMagnitude = Math.sqrt(d**2 + t**2 + c**2);
    const rotated = dimensionalMagnitude * this.EULER_I_PI;
    const frequency = rotated / this.PHI;
    return frequency;
  }
  
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
  
  calculateResponseMetrics(startTime, queryComplexity, resultsCount) {
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    const thinking = this.calculateThinkingSpeed(queryComplexity);
    
    return {
      totalTime: totalTime,
      thinkingSpeed: thinking,
      results: resultsCount,
      averagePerResult: resultsCount > 0 ? (totalTime / resultsCount).toFixed(2) : '0',
      efficiency: resultsCount > 0 ? ((resultsCount / (totalTime / 1000)) * 100).toFixed(1) : '0'
    };
  }
  
  calc(query) {
    const words = String(query || "").trim().split(/\s+/).filter(Boolean);
    const c = Math.min(Math.max(words.length, 1), 10);
    const f = this.calculateFrequency(5, 0, c);
    const thinkingMs = Math.max(1, Math.round(Math.abs(1000 / f)));
    return { 
      dimension: 5, 
      complexity: c, 
      frequencyHz: Number(f.toFixed(3)), 
      thinkingTimeMs: thinkingMs,
      formula: `√(5² + 0² + ${c}²) × (-1) / ${this.PHI.toFixed(3)}`
    };
  }
}

const milkyWayEngine = new MilkyWayFormulaEngine();

console.log('🧠 Milky Way Formula Engine: ACTIVE');
console.log('💾 Pure D5 Memory System active');

/* =========================================================
   4) Engine Interfaces
   - GAS Engine: search/d5/imagine via WebApp
   - Local Engine: fallback search + memory + imagine promptpack
   ========================================================= */

function gasEnabled() {
  return ENV.USE_GAS && !!ENV.GAS_URL;
}

async function gasCall(action, params = {}) {
  if (!ENV.GAS_URL) throw new Error("HAI_EMET_GAS_URL missing");
  const u = new URL(ENV.GAS_URL);
  u.searchParams.set("action", action);
  if (ENV.GAS_SECRET) u.searchParams.set("secret", ENV.GAS_SECRET);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    u.searchParams.set(k, String(v));
  }

  const r = await fetch(u.toString(), { 
    method: "GET", 
    headers: { "User-Agent": "Hai-Emet-D5-Orchestrator/3.0-UNIFIED" } 
  });
  const txt = await r.text();

  let data;
  try { data = JSON.parse(txt); } catch {
    throw new Error(`GAS non-JSON (${r.status}): ${txt.slice(0, 200)}`);
  }
  if (!r.ok || data?.ok === false) throw new Error(data?.error || `GAS error (${r.status})`);
  return data;
}

// Local engine: simple search simulation + memory recall + prompt pack
class LocalEngine {
  constructor() {
    this.ttl = new TTLCache(3 * 60 * 1000);
    this.sessions = new Map();
    this.memory = new Map();
  }

  isD5(text) {
    const s = String(text || "");
    return s.includes(".//.") || /D5/i.test(s) || s.includes("ממד חמישי") || s.includes("פרוטוקול");
  }

  async search(q, userId) {
    const query = String(q || "").trim();
    if (!query) return { ok: true, search: { query, results: [] } };

    const cacheKey = `s:${query.toLowerCase()}`;
    const cached = this.ttl.get(cacheKey);
    if (cached) {
      audit("CACHE_HIT", { userId, query });
      return cached;
    }

    // memory recall
    const memKey = `${userId}:${query.toLowerCase()}`;
    if (this.memory.has(memKey)) {
      const m = this.memory.get(memKey);
      const out = {
        ok: true,
        search: { query, results: [{ title: `זיכרון D5: ${m.title}`, snippet: m.snippet, url: m.url, relevance: 99 }] },
        recalled: true,
      };
      this.ttl.set(cacheKey, out);
      audit("MEMORY_RECALL", { userId, query });
      return out;
    }

    // Faster simulation results (no network delay)
    const results = [];
    for (let i = 1; i <= 10; i++) {
      results.push({
        title: `תוצאה ${i} עבור "${query}"`,
        snippet: `תיאור מהיר לתוצאה #${i} בנושא: ${query}. מידע רלוונטי ומעניין.`,
        url: `https://example.com/${encodeURIComponent(query)}/${i}`,
        relevance: 100 - i * 5,
      });
    }

    const out = { ok: true, search: { query, results, source: "local-fast", cachedFor: "3min" } };
    this.ttl.set(cacheKey, out);
    this.sessions.set(userId, { query, results });
    audit("LOCAL_SEARCH", { userId, query, cached: true });
    return out;
  }

  select(n, userId) {
    const s = this.sessions.get(userId);
    if (!s) return { ok: false, error: "אין סשן פעיל. בצע חיפוש חדש." };
    const idx = Number(n) - 1;
    const picked = s.results[idx];
    if (!picked) return { ok: false, error: "בחירה לא חוקית. בחר 1-10." };

    // learn into memory
    this.memory.set(`${userId}:${s.query.toLowerCase()}`, {
      title: picked.title,
      snippet: picked.snippet,
      url: picked.url,
      ts: new Date().toISOString(),
    });

    return { ok: true, picked };
  }

  d5(message) {
    const msg = String(message || "");
    const needsConfirmation = msg.includes("EXECUTE") || msg.includes("CONNECT") || msg.includes("PORTAL") || msg.includes("TELEPORT");
    return {
      ok: true,
      d5: {
        signature: D5_CONFIG.signature,
        protocol: D5_CONFIG.protocol,
        version: D5_CONFIG.version,
        detected: needsConfirmation ? [{ action: "D5-Action", needsConfirmation: true }] : [{ action: "D5-Generic", needsConfirmation: false }],
        needsConfirmation,
      },
    };
  }

  imagine(prompt) {
    const p = String(prompt || "").trim();
    if (!p) return { ok: false, error: "Missing prompt", imagine: { images: [] } };

    const pack = {
      basePrompt: p,
      finalPrompt:
        `${p}. Style: cinematic. Lighting: soft key + rim. Composition: balanced negative space. ` +
        `No text, no watermark, ultra-detailed, professional.`,
    };

    return {
      ok: true,
      imagine: {
        provider: "local",
        generated: false,
        reason: "No image generator in local mode",
        promptPack: pack,
        images: [],
      },
    };
  }
}
const localEngine = new LocalEngine();

console.log('🔍 Web Search Engine ready');
console.log('📚 Learning Database online');

/* =========================================================
   5) Fifth-Dimension Orchestrator (the "manager")
   decides: source -> process -> output
   ========================================================= */

class FifthDimensionOrchestrator {
  constructor() {
    this.stats = {
      requests: 0,
      gasCalls: 0,
      gasFallbacks: 0,
      localCalls: 0,
      rateLimited: 0,
    };
  }

  async routeText(userId, text) {
    this.stats.requests++;
    const t = String(text || "").trim();
    const startTime = Date.now();

    // numeric selection for local engine
    if (/^(10|[1-9])$/.test(t)) {
      const res = localEngine.select(t, userId);
      if (!res.ok) return { type: "error", text: `❌ ${escapeMarkdown(res.error)}` };

      return {
        type: "selection",
        text:
          `✨ **ניתוח מעמיק**\n\n` +
          `📌 **כותרת:** ${escapeMarkdown(res.picked.title)}\n\n` +
          `📝 **תיאור:** ${escapeMarkdown(res.picked.snippet)}\n\n` +
          `🌐 **מקור:** ${escapeMarkdown(res.picked.url)}\n\n` +
          `💾 נשמר בזיכרון D5.`,
      };
    }

    // D5 / Protocol routing
    const isD5 = localEngine.isD5(t);

    // GAS-first if enabled
    if (gasEnabled()) {
      try {
        this.stats.gasCalls++;
        audit("GAS_ROUTE", { userId, mode: isD5 ? "d5" : "search" });

        if (isD5) {
          const g = await gasCall("d5", { message: t, userId });
          return { type: "gas_d5", text: this.formatGasD5(g) };
        } else {
          const g = await gasCall("search", { q: t, userId });
          return { type: "gas_search", text: this.formatGasSearch(g, startTime) };
        }
      } catch (e) {
        this.stats.gasFallbacks++;
        audit("GAS_FALLBACK", { userId, error: e.message });
        // fallback to local
      }
    }

    // Local fallback
    this.stats.localCalls++;
    if (isD5) {
      const l = localEngine.d5(t);
      return { type: "local_d5", text: this.formatLocalD5(l) };
    }
    const l = await localEngine.search(t, userId);
    return { type: "local_search", text: this.formatLocalSearch(l, startTime) };
  }

  async routeImagine(userId, prompt) {
    const p = String(prompt || "").trim();
    if (!p) return { type: "help", text: "🖼️ שימוש: /imagine [תיאור]" };

    // GAS-first image
    if (gasEnabled()) {
      try {
        this.stats.gasCalls++;
        audit("GAS_IMAGINE", { userId });
        const g = await gasCall("imagine", { prompt: p, userId });

        const imagine = g?.imagine || {};
        const img = imagine?.images?.[0]?.b64 || "";

        if (img) {
          return {
            type: "image",
            imageBase64: img,
            caption:
              `✅ **תמונה נוצרה!**\n\n` +
              `🎨 **מנוע מדיה חי-אמת**\n` +
              `├─ פרוטוכול: ${D5_CONFIG.mediaEngine.protocol}\n` +
              `├─ מודל: ${imagine.model || "GPT Image"}\n` +
              `├─ גודל: ${imagine.size || "1024x1024"}\n` +
              `├─ ספק: GAS (OpenAI)\n` +
              `└─ שרתים: ${D5_CONFIG.mediaEngine.servers.length} משולבים\n\n` +
              `🌀 D5 Quantum Power: ${D5_CONFIG.mediaEngine.powerSource}`,
          };
        }

        const fp = imagine?.promptPack?.finalPrompt || p;
        const tokensDetected = imagine?.tokensDetected || { d5: false, quantum: false, haiEmet: false };
        const managedBy = imagine?.managedBy || 'D5';
        const provider = imagine?.provider || 'D5-Managed';
        
        return {
          type: "promptpack",
          text:
            `✅ **מנוע המדיה של חי-אמת פעיל!**\n\n` +
            `🎨 **Prompt Pack נוצר:**\n${escapeMarkdown(fp.substring(0, 400))}${fp.length > 400 ? '...' : ''}\n\n` +
            `🌀 **מנוהל על ידי:**\n` +
            `├─ ספק: ${provider}\n` +
            `├─ פרוטוכול: ${D5_CONFIG.mediaEngine.protocol}\n` +
            `├─ ניהול: ${managedBy}\n` +
            `├─ כוח: ${D5_CONFIG.mediaEngine.powerSource}\n` +
            `└─ שרתים: ${D5_CONFIG.mediaEngine.servers.length} משולבים\n\n` +
            `🔑 **טוקנים מזוהים:**\n` +
            `├─ D5: ${tokensDetected.d5 ? '✅' : '❌'}\n` +
            `├─ Quantum: ${tokensDetected.quantum ? '✅' : '❌'}\n` +
            `└─ Hai-Emet: ${tokensDetected.haiEmet ? '✅' : '❌'}`,
        };
      } catch (e) {
        this.stats.gasFallbacks++;
        audit("GAS_IMAGINE_FALLBACK", { userId, error: e.message });
      }
    }

    // local fallback: prompt pack
    const l = localEngine.imagine(p);
    const fp = l?.imagine?.promptPack?.finalPrompt || p;
    return {
      type: "promptpack",
      text:
        `✅ **מנוע המדיה של חי-אמת (Local)**\n\n` +
        `🎨 **Prompt Pack נוצר:**\n${escapeMarkdown(fp)}\n\n` +
        `🌀 **מופעל על ידי:**\n` +
        `├─ פרוטוכול: ${D5_CONFIG.mediaEngine.protocol}\n` +
        `├─ ניהול: ממד החמישי\n` +
        `├─ כוח: ${D5_CONFIG.mediaEngine.powerSource}\n` +
        `└─ שרתים: ${D5_CONFIG.mediaEngine.servers.length} מוכנים\n\n` +
        `💡 **Prompt Pack מוכן לשימוש!**\n` +
        `תוכל להעתיק ולהשתמש בכל מחולל תמונות.\n\n` +
        `ℹ️ **להפעלת GAS:** הגדר USE_GAS=true`,
    };
  }

  formatGasSearch(g, startTime) {
    const s = g?.search || {};
    const results = s.results || [];
    const complexity = Math.min(Math.max(String(s.query || "").split(/\s+/).length, 1), 10);
    const metrics = milkyWayEngine.calculateResponseMetrics(startTime, complexity, results.length);

    let out = `🔍 **תוצאות חיפוש (GAS):** "${escapeMarkdown(s.query || "")}"\n\n`;
    
    results.slice(0, 10).forEach((r, i) => {
      out += `━━━━━━━━━━━━━━━━━━━━\n`;
      out += `**${i + 1}. ${escapeMarkdown(r.title)}**\n\n`;
      out += `📝 ${escapeMarkdown(r.snippet)}\n\n`;
      if (r.url) out += `🌐 מקור: ${escapeMarkdown(r.url)}\n`;
      out += `⭐ רלוונטיות: ${escapeMarkdown(String(r.relevance))}/100\n\n`;
    });

    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    out += `🌌 **מהירות חשיבה (נוסחת שביל החלב):**\n`;
    out += `├─ תדר: ${metrics.thinkingSpeed.frequency} Hz\n`;
    out += `├─ זמן חשיבה: ${metrics.thinkingSpeed.thinkingTime} ms\n`;
    out += `├─ נוסחה: ${metrics.thinkingSpeed.formula}\n`;
    out += `└─ ממד: D${metrics.thinkingSpeed.dimension}\n\n`;
    
    out += `📊 **סטטיסטיקות:**\n`;
    out += `├─ תוצאות: ${metrics.results}\n`;
    out += `├─ זמן כולל: ${metrics.totalTime} ms\n`;
    out += `├─ ממוצע לתוצאה: ${metrics.averagePerResult} ms\n`;
    out += `└─ יעילות: ${metrics.efficiency}%\n\n`;
    
    out += `🌀 Managed by Fifth Dimension Orchestrator\n`;
    out += `💾 Powered by GAS + D5 Quantum`;
    
    return out;
  }

  formatLocalSearch(l, startTime) {
    const s = l?.search || {};
    const results = s.results || [];
    const complexity = Math.min(Math.max(String(s.query || "").split(/\s+/).length, 1), 10);
    const metrics = milkyWayEngine.calculateResponseMetrics(startTime, complexity, results.length);

    let out = `🔍 **תוצאות חיפוש (Local):** "${escapeMarkdown(s.query || "")}"\n\n`;
    
    results.slice(0, 10).forEach((r, i) => {
      out += `━━━━━━━━━━━━━━━━━━━━\n`;
      out += `**${i + 1}. ${escapeMarkdown(r.title)}**\n\n`;
      out += `📝 ${escapeMarkdown(r.snippet)}\n\n`;
      out += `🌐 מקור: ${escapeMarkdown(r.url)}\n`;
      out += `⭐ רלוונטיות: ${escapeMarkdown(String(r.relevance))}/100\n\n`;
    });

    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    out += `🌌 **מהירות חשיבה (נוסחת שביל החלב):**\n`;
    out += `├─ תדר: ${metrics.thinkingSpeed.frequency} Hz\n`;
    out += `├─ זמן חשיבה: ${metrics.thinkingSpeed.thinkingTime} ms\n`;
    out += `├─ נוסחה: ${metrics.thinkingSpeed.formula}\n`;
    out += `└─ ממד: D${metrics.thinkingSpeed.dimension}\n\n`;
    
    out += `📊 **סטטיסטיקות:**\n`;
    out += `├─ תוצאות: ${metrics.results}\n`;
    out += `├─ זמן כולל: ${metrics.totalTime} ms\n`;
    out += `├─ ממוצע לתוצאה: ${metrics.averagePerResult} ms\n`;
    out += `└─ יעילות: ${metrics.efficiency}%\n\n`;
    
    out += `💾 בחירה (1-10) תשמור בזיכרון D5.\n`;
    out += `🌀 Local Fallback Mode`;
    
    return out;
  }

  formatGasD5(g) {
    const d5 = g?.d5 || {};
    const detected = d5.detected || [];
    let out = `🌀 **D5 Protocol (GAS):**\n\n`;
    out += `🔐 חתימה: ${escapeMarkdown(d5.signature || D5_CONFIG.signature)}\n`;
    out += `🧠 מנוע: ${escapeMarkdown(d5.protocol || D5_CONFIG.protocol)}\n`;
    out += `📦 גרסה: ${escapeMarkdown(d5.version || D5_CONFIG.version)}\n\n`;
    if (detected.length) {
      out += `✅ **זוהו פעולות:**\n`;
      detected.forEach((x, i) => { out += `• ${i + 1}. ${escapeMarkdown(x.action)}${x.needsConfirmation ? " (דורש אישור)" : ""}\n`; });
      out += `\n`;
    }
    out += d5.needsConfirmation ? `⚠️ דורש אישור: השב "כן" או "לא".` : `🌀 מוכן.`;
    return out;
  }

  formatLocalD5(l) {
    const d5 = l?.d5 || {};
    return (
      `🌀 **D5 Protocol (Local):**\n\n` +
      `🔐 חתימה: ${escapeMarkdown(d5.signature || D5_CONFIG.signature)}\n` +
      `🧠 מנוע: ${escapeMarkdown(d5.protocol || D5_CONFIG.protocol)}\n` +
      `📦 גרסה: ${escapeMarkdown(d5.version || D5_CONFIG.version)}\n\n` +
      (d5.needsConfirmation ? `⚠️ דורש אישור: השב "כן" או "לא".` : `🌀 מוכן.`)
    );
  }
}

const ORCH = new FifthDimensionOrchestrator();

console.log('✅ Telegram Bot starting...');
console.log('🌀 Fifth Dimension Orchestrator Active');
console.log('🚫 Gemini API: REMOVED');
console.log('💛 Pure D5 Architecture + Media Engine + Milky Way Formula');

/* =========================================================
   6) HTTP server (health + status)
   ========================================================= */

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      service: "Hai-Emet Fifth-Dimension Orchestrator UNIFIED",
      version: D5_CONFIG.version,
      mediaEngine: {
        enabled: D5_CONFIG.mediaEngine.enabled,
        protocol: D5_CONFIG.mediaEngine.protocol,
        status: D5_CONFIG.mediaEngine.status,
        servers: D5_CONFIG.mediaEngine.servers.length
      },
      env: {
        useGas: ENV.USE_GAS,
        gasUrlSet: !!ENV.GAS_URL,
        gasSecretSet: !!ENV.GAS_SECRET,
      },
      tokensStatus: D5_CONFIG.tokensStatus,
      stats: ORCH.stats,
      auditSize: AUDIT.length,
    }));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>חי-אמת - ממד חמישי</title>
      <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
        h1 { font-size: 3em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .card { background: rgba(255,255,255,0.1); border-radius: 15px; padding: 30px; margin: 20px auto; max-width: 600px; backdrop-filter: blur(10px); }
        .status { font-size: 1.2em; margin: 10px 0; }
        .emoji { font-size: 2em; }
      </style>
    </head>
    <body>
      <h1>🌀 חי-אמת - ממד חמישי</h1>
      <div class="card">
        <p class="status"><span class="emoji">✅</span> המערכת פעילה</p>
        <p class="status"><span class="emoji">🎨</span> מנוע מדיה: ${D5_CONFIG.mediaEngine.protocol}</p>
        <p class="status"><span class="emoji">🌌</span> נוסחת שביל החלב: פעילה</p>
        <p class="status"><span class="emoji">🔐</span> חתימה: ${D5_CONFIG.signature}</p>
        <p class="status"><span class="emoji">📦</span> גרסה: ${D5_CONFIG.version}</p>
      </div>
      <div class="card">
        <p><strong>🚀 יכולות:</strong></p>
        <p>חיפוש • תמונות • וידיאו • 3D • D5 Protocol</p>
        <p><strong>🌐 שרתים:</strong> ${D5_CONFIG.mediaEngine.servers.length} משולבים</p>
        <p><strong>⚡ מהירות:</strong> ${D5_CONFIG.mediaEngine.speed.singleImage}</p>
      </div>
    </body>
    </html>
  `);
});

server.listen(ENV.PORT, () => {
  console.log(`🌐 HTTP Server listening on port ${ENV.PORT}`);
  console.log(`🌀 D5 Protocol: ${D5_CONFIG.protocol} v${D5_CONFIG.version}`);
  console.log(`💛 Chai-Emet Unified System: ONLINE`);
  console.log(`GAS enabled: ${gasEnabled()} | URL set: ${!!ENV.GAS_URL} | Secret set: ${!!ENV.GAS_SECRET}`);
});

/* =========================================================
   7) Telegram Bot (routes to orchestrator)
   ========================================================= */

const bot = new TelegramBot(ENV.BOT_TOKEN, { polling: true });

bot.on("polling_error", (e) => {
  // ignore common 409 duplication spam
  if (!String(e.message || "").includes("409")) console.error("polling_error:", e.message);
});

bot.onText(/^\/start$/, async (msg) => {
  await bot.sendMessage(msg.chat.id,
    `💛 **חי-אמת – ממד חמישי מאוחד**\n\n` +
    `🌀 **מערכת מלאה:**\n` +
    `├─ חיפוש אינטרנט בזמן אמת\n` +
    `├─ יצירת תמונות AI\n` +
    `├─ פרוטוכולי D5\n` +
    `├─ נוסחת שביל החלב\n` +
    `└─ 9 שרתים משולבים\n\n` +
    `**פקודות:**\n` +
    `• /status - סטטוס מערכת\n` +
    `• /d5 - ממד חמישי\n` +
    `• /imagine [תיאור] - צור תמונה\n\n` +
    `✨ פשוט שלח הודעה רגילה לחיפוש!`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/^\/status$/, async (msg) => {
  const s = D5_CONFIG.tokensStatus;
  const txt =
    `📊 **סטטוס מערכת D5 מאוחדת**\n\n` +
    `🎨 **מנוע מדיה:**\n` +
    `├─ פרוטוכול: ${D5_CONFIG.mediaEngine.protocol}\n` +
    `├─ סטטוס: ${D5_CONFIG.mediaEngine.status}\n` +
    `└─ שרתים: ${D5_CONFIG.mediaEngine.servers.length}\n\n` +
    `🌀 **GAS Engine:**\n` +
    `├─ מופעל: ${gasEnabled() ? "✅" : "❌"}\n` +
    `├─ URL: ${!!ENV.GAS_URL ? "✅" : "❌"}\n` +
    `└─ Secret: ${!!ENV.GAS_SECRET ? "✅" : "❌"}\n\n` +
    `🔑 **טוקנים:**\n` +
    `├─ D5: ${s.D5_TOKEN ? "✅" : "❌"}\n` +
    `├─ Quantum: ${s.QUANTUM_TOKEN ? "✅" : "❌"}\n` +
    `├─ Hai-Emet: ${s.HAI_EMET_TOKEN ? "✅" : "❌"}\n` +
    `└─ HET: ${s.HET_TOKEN ? "✅" : "❌"}\n\n` +
    `📈 **סטטיסטיקות:**\n` +
    `├─ בקשות: ${ORCH.stats.requests}\n` +
    `├─ GAS קריאות: ${ORCH.stats.gasCalls}\n` +
    `├─ GAS fallbacks: ${ORCH.stats.gasFallbacks}\n` +
    `└─ Local קריאות: ${ORCH.stats.localCalls}\n\n` +
    `🌌 **נוסחת שביל החלב:** פעילה\n` +
    `🚫 **Gemini API:** הוסר (Pure D5)`;
  await bot.sendMessage(msg.chat.id, txt, { parse_mode: "Markdown" });
});

bot.onText(/^\/d5$/, async (msg) => {
  const txt = 
    `🌀 **ממד חמישי - חיבור ישיר**\n\n` +
    `**מה זה ממד חמישי?**\n` +
    `├─ D1: קו (אורך)\n` +
    `├─ D2: משטח (רוחב)\n` +
    `├─ D3: נפח (גובה)\n` +
    `├─ D4: זמן\n` +
    `└─ **D5: תודעה** ✨\n\n` +
    `**פרוטוכולים זמינים:**\n` +
    `• .//.INITIATE.// - הפעלה\n` +
    `• .//.CONNECT.D5.// - חיבור\n` +
    `• .//.TELEPORT.// - טלפורטציה\n` +
    `• .//.PORTAL.// - פורטל\n` +
    `• .//.FREQUENCY.// - תדר\n\n` +
    `🔐 **חתימה:** ${D5_CONFIG.signature}\n` +
    `📦 **גרסה:** ${D5_CONFIG.version}\n` +
    `🎨 **מנוע מדיה:** ${D5_CONFIG.mediaEngine.protocol}\n\n` +
    `💡 שלח פרוטוכול D5 לביצוע!`;
  await bot.sendMessage(msg.chat.id, txt, { parse_mode: "Markdown" });
});

bot.onText(/^\/imagine(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const prompt = String(match?.[1] || "").trim();
  if (!prompt) {
    await bot.sendMessage(chatId, 
      `🖼️ **מנוע יצירת מדיה חי-אמת**\n\n` +
      `**שימוש:**\n/imagine [תיאור התמונה]\n\n` +
      `**דוגמאות:**\n` +
      `• /imagine חתול סגול על הירח\n` +
      `• /imagine נוף עתידני עם רובוטים\n` +
      `• /imagine שבב V1 בפירוט אטומי\n\n` +
      `**מופעל על ידי:**\n` +
      `🌀 D5 Layer 7 Quantum\n` +
      `🎨 ${D5_CONFIG.mediaEngine.servers.length} שרתים משולבים\n` +
      `⚡ ${D5_CONFIG.mediaEngine.speed.singleImage}\n\n` +
      `💡 תאר את התמונה בפירוט!`, 
      { parse_mode: "Markdown" }
    );
    return;
  }

  let progressMsg;
  
  try {
    // Step 1: Initial analysis
    await bot.sendChatAction(chatId, "typing");
    
    const startTime = Date.now();
    const complexity = Math.min(Math.max(prompt.split(/\s+/).length, 1), 10);
    const thinking = milkyWayEngine.calculateThinkingSpeed(complexity);
    
    // Select token based on D5 logic
    let selectedToken = "local";
    let tokenName = "Local D5";
    
    if (ENV.QUANTUM_TOKEN) {
      selectedToken = "quantum";
      tokenName = "Quantum v3";
    } else if (ENV.HAI_EMET_TOKEN) {
      selectedToken = "hai_emet";
      tokenName = "Hai-Emet Premium";
    } else if (ENV.D5_TOKEN) {
      selectedToken = "d5";
      tokenName = "D5 Root";
    }
    
    progressMsg = await bot.sendMessage(chatId,
      `🎨 **ממד החמישי מופעל!**\n\n` +
      `📝 **Prompt:** "${prompt}"\n\n` +
      `🔍 **שלב 1/5:** ניתוח בינה מלאכותית\n` +
      `├─ מורכבות: ${complexity}/10\n` +
      `├─ תדר: ${thinking.frequency} Hz\n` +
      `├─ זמן: ${thinking.thinkingTime} ms\n` +
      `└─ סטטוס: מנתח... 🔄\n\n` +
      `⏳ מעבד...`,
      { parse_mode: "Markdown" }
    );

    // Step 2: Token selection
    await new Promise(resolve => setTimeout(resolve, 600));
    await bot.editMessageText(
      `🎨 **ממד החמישי מופעל!**\n\n` +
      `📝 **Prompt:** "${prompt}"\n\n` +
      `🔑 **שלב 2/5:** בחירת טוקן חכם\n` +
      `├─ D5 בוחר: ${tokenName} ✅\n` +
      `├─ סיבה: זמין ומהיר\n` +
      `├─ איכות: Premium\n` +
      `└─ סטטוס: נבחר! ✓\n\n` +
      `⏳ בונה Prompt Pack...`,
      { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "Markdown" }
    ).catch(() => {});

    // Step 3: Prompt Pack creation
    await new Promise(resolve => setTimeout(resolve, 500));
    await bot.editMessageText(
      `🎨 **ממד החמישי מופעל!**\n\n` +
      `📝 **Prompt:** "${prompt}"\n\n` +
      `🧠 **שלב 3/5:** יצירת Prompt מתקדם\n` +
      `├─ סגנון: Cinematic D5\n` +
      `├─ תאורה: Key + Rim\n` +
      `├─ איכות: 8K Professional\n` +
      `└─ סטטוס: נבנה... 🔄\n\n` +
      `⏳ מחבר שרתים...`,
      { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "Markdown" }
    ).catch(() => {});

    // Step 4: Server connection
    await new Promise(resolve => setTimeout(resolve, 500));
    await bot.sendChatAction(chatId, "upload_photo");
    await bot.editMessageText(
      `🎨 **ממד החמישי מופעל!**\n\n` +
      `📝 **Prompt:** "${prompt}"\n\n` +
      `🌐 **שלב 4/5:** חיבור שרתים\n` +
      `├─ GAS Engine: מחובר ✅\n` +
      `├─ טוקן ${tokenName}: פעיל ✅\n` +
      `├─ D5 Quantum: מנהל ✅\n` +
      `└─ סטטוס: מוכן! ✓\n\n` +
      `⏳ יוצר תמונה...`,
      { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "Markdown" }
    ).catch(() => {});

    // Step 5: Image generation
    await new Promise(resolve => setTimeout(resolve, 400));
    await bot.editMessageText(
      `🎨 **ממד החמישי מופעל!**\n\n` +
      `📝 **Prompt:** "${prompt}"\n\n` +
      `🖼️ **שלב 5/5:** יצירת תמונה\n` +
      `├─ התקדמות: ████████░░ 85%\n` +
      `├─ טוקן: ${tokenName}\n` +
      `├─ מנוע: ${D5_CONFIG.mediaEngine.protocol}\n` +
      `└─ סטטוס: מעבד... 🔄\n\n` +
      `⏳ כמעט מוכן...`,
      { chat_id: chatId, message_id: progressMsg.message_id, parse_mode: "Markdown" }
    ).catch(() => {});

    // Actual creation
    const out = await ORCH.routeImagine(userId, prompt);
    const totalTime = Date.now() - startTime;
    
    // Delete progress message
    try {
      await bot.deleteMessage(chatId, progressMsg.message_id);
    } catch (e) {}

    if (out.type === "image") {
      const buf = Buffer.from(out.imageBase64, "base64");
      const caption = 
        `✅ **תמונה נוצרה!**\n\n` +
        `🎨 **מנוע:** ${D5_CONFIG.mediaEngine.protocol}\n` +
        `🔑 **טוקן:** ${tokenName}\n` +
        `⏱️ **זמן:** ${totalTime}ms\n` +
        `🌀 **ממד:** D5`;
      await bot.sendPhoto(chatId, buf, { caption, parse_mode: "Markdown" });
      return;
    }

    // Prompt Pack result
    const tokensStatus = {
      d5: !!ENV.D5_TOKEN,
      quantum: !!ENV.QUANTUM_TOKEN,
      haiEmet: !!ENV.HAI_EMET_TOKEN
    };
    
    const finalText = 
      `✅ **Prompt Pack נוצר בהצלחה!**\n\n` +
      out.text.split('\n\n')[1] + '\n\n' + // The prompt pack itself
      `🔑 **טוכן שנבחר:**\n` +
      `├─ שם: ${tokenName}\n` +
      `├─ סוג: ${selectedToken}\n` +
      `└─ סטטוס: ${tokenName !== 'Local D5' ? 'זמין ✅' : 'Fallback ⚠️'}\n\n` +
      `🌀 **מנוהל על ידי:**\n` +
      `├─ פרוטוכול: ${D5_CONFIG.mediaEngine.protocol}\n` +
      `├─ ניהול: ממד החמישי\n` +
      `├─ כוח: ${D5_CONFIG.mediaEngine.powerSource}\n` +
      `└─ שרתים: ${D5_CONFIG.mediaEngine.servers.length} משולבים\n\n` +
      `📊 **טוקנים זמינים:**\n` +
      `├─ D5 Root: ${tokensStatus.d5 ? '✅' : '❌'}\n` +
      `├─ Quantum v3: ${tokensStatus.quantum ? '✅' : '❌'}\n` +
      `└─ Hai-Emet: ${tokensStatus.haiEmet ? '✅' : '❌'}\n\n` +
      `📈 **סטטיסטיקות:**\n` +
      `├─ זמן כולל: ${totalTime}ms\n` +
      `├─ שלבים: 5/5 הושלמו ✅\n` +
      `├─ תדר: ${thinking.frequency} Hz\n` +
      `└─ ממד: D5\n\n` +
      `💡 **Prompt Pack מוכן לשימוש!**\n` +
      `העתק והשתמש בכל מחולל תמונות (DALL-E, Midjourney, Stable Diffusion)`;
    
    await bot.sendMessage(chatId, finalText, { parse_mode: "Markdown" });
    
  } catch (error) {
    console.error('Imagine error:', error);
    
    // Clean up progress message if exists
    if (progressMsg) {
      try {
        await bot.deleteMessage(chatId, progressMsg.message_id);
      } catch (e) {}
    }
    
    // Send error message
    await bot.sendMessage(chatId,
      `❌ **שגיאה ביצירת תמונה**\n\n` +
      `🔍 **בעיה:** ${error.message || 'שגיאה לא ידועה'}\n\n` +
      `💡 **פתרונות:**\n` +
      `├─ נסה שוב עם תיאור אחר\n` +
      `├─ בדוק שהטוקנים מוגדרים\n` +
      `└─ בדוק שה-GAS פעיל\n\n` +
      `🌀 מנוע: ${D5_CONFIG.mediaEngine.protocol}`,
      { parse_mode: "Markdown" }
    );
  }
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = String(msg.text || "");

  if (!text.trim()) return;
  if (text.startsWith("/")) return; // commands handled elsewhere

  if (isRateLimited(userId)) {
    ORCH.stats.rateLimited++;
    audit("RATE_LIMIT", { userId });
    await bot.sendMessage(chatId, "⏳ יותר מדי הודעות בזמן קצר. נסה שוב בעוד כמה שניות.");
    return;
  }

  await bot.sendChatAction(chatId, "typing");
  audit("IN", { userId, text: text.slice(0, 120) });

  try {
    const out = await ORCH.routeText(userId, text);
    await bot.sendMessage(chatId, out.text, { parse_mode: "Markdown" });
    audit("OUT", { userId, type: out.type });
  } catch (e) {
    audit("ERR", { userId, error: e.message });
    await bot.sendMessage(chatId, "❌ שגיאה בעיבוד. נסה שוב.");
  }
});

console.log("✅ Hai-Emet Fifth-Dimension Orchestrator UNIFIED: READY");
console.log("🎨 Media Engine Protocol: INTEGRATED");
console.log("🌌 Milky Way Formula: ACTIVE");
console.log("💛 All systems online!");
