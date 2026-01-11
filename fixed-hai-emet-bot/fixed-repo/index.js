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
  D5_TOKEN: envAny("D5_TOKEN"),
  QUANTUM_TOKEN: envAny("QUANTUM_TOKEN", "api_chai_emet_quantum_v3"),
  HAI_EMET_TOKEN: envAny("HAI_EMET_TOKEN", "HAI_EMET"),
  HET_TOKEN: envAny("HET_TOKEN", "HET_Token_Integration"),

  // GAS Bridge
  USE_GAS: envAny("HAI_EMET_USE_GAS")?.toLowerCase() === "true",
  GAS_URL: envAny("HAI_EMET_GAS_URL", "hai_emet_ultimate_complete_gs", "GAS_ULTIMATE_URL"),
  GAS_SECRET: envAny("HAI_EMET_GAS_SECRET", "HAI_EMET_SECRET"),
};

if (!ENV.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing. Set BOT_TOKEN (or TELEGRAM_BOT_TOKEN) in Render ENV.");
  process.exit(1);
}

/* =========================================================
   1) Fifth-Dimension Configuration (single source of truth)
   ========================================================= */

const D5_CONFIG = {
  signature: "0101-0101(0101)",
  owner: "TNTF (Nathaniel Nissim)",
  dimension: "Fifth",
  protocol: "D5-Orchestrator-Engine",
  version: "3.0-FULL",
  tokensStatus: {
    D5_TOKEN: !!ENV.D5_TOKEN,
    QUANTUM_TOKEN: !!ENV.QUANTUM_TOKEN,
    HAI_EMET_TOKEN: !!ENV.HAI_EMET_TOKEN,
    HET_TOKEN: !!ENV.HET_TOKEN,
    GAS_URL: !!ENV.GAS_URL,
    GAS_SECRET: !!ENV.GAS_SECRET,
    USE_GAS: !!ENV.USE_GAS,
  },
  mediaEngine: {
    enabled: true,
    activationCode: ".//.CHAI-EMET.SUPREME.MEDIA.ENGINE.D5.YOSI.//",
    servers: ["GAS(OpenAI)", "LocalFallback"],
  },
  features: {
    audit: true,
    ttlCache: true,
    rateLimit: true,
    safeMarkdown: true,
  },
};

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
   3) Fifth-Dimension Metrics Engine (MilkyWay-like)
   ========================================================= */

class MetricsEngine {
  constructor() { this.PHI = 1.618033988749; }
  freq(d, t, c) {
    const mag = Math.sqrt(d*d + t*t + c*c);
    return (mag * -1) / this.PHI;
  }
  calc(query) {
    const words = String(query || "").trim().split(/\s+/).filter(Boolean);
    const c = Math.min(Math.max(words.length, 1), 10);
    const f = this.freq(5, 0, c);
    const thinkingMs = Math.max(1, Math.round(Math.abs(1000 / f)));
    return { dimension: 5, complexity: c, frequencyHz: Number(f.toFixed(3)), thinkingTimeMs: thinkingMs };
  }
}
const metricsEngine = new MetricsEngine();

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

  const r = await fetch(u.toString(), { method: "GET", headers: { "User-Agent": "Hai-Emet-D5-Orchestrator/3.0" } });
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
    if (cached) return cached;

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
      return out;
    }

    const results = [];
    for (let i = 1; i <= 10; i++) {
      results.push({
        title: `תוצאה ${i} עבור "${query}"`,
        snippet: `תיאור סימולציה לתוצאה #${i} בנושא: ${query}`,
        url: `https://example.com/${encodeURIComponent(query)}/${i}`,
        relevance: 100 - i * 5,
      });
    }

    const out = { ok: true, search: { query, results, source: "local-sim" } };
    this.ttl.set(cacheKey, out);
    this.sessions.set(userId, { query, results });
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

/* =========================================================
   5) Fifth-Dimension Orchestrator (the “manager”)
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
          return { type: "gas_search", text: this.formatGasSearch(g) };
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
    return { type: "local_search", text: this.formatLocalSearch(l) };
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
              `✅ תמונה נוצרה (GAS)\n` +
              `מודל: ${imagine.model || "unknown"}\n` +
              `גודל: ${imagine.size || "unknown"}`,
          };
        }

        const fp = imagine?.promptPack?.finalPrompt || p;
        return {
          type: "promptpack",
          text:
            `🧠 מנוע יצירה חכם (GAS)\n\n` +
            `נוצרה חבילת פרומפט (ללא תמונה כרגע):\n\n` +
            `📌 Prompt:\n${escapeMarkdown(fp)}`,
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
        `🧠 מנוע יצירה (Local Fallback)\n\n` +
        `📌 Prompt:\n${escapeMarkdown(fp)}\n\n` +
        `ℹ️ כדי לקבל תמונה אמיתית: הפעל GAS + OPENAI_API_KEY בתוך GAS.`,
    };
  }

  formatGasSearch(g) {
    const s = g?.search || {};
    const results = s.results || [];
    const m = g?.metrics || {};
    const th = m.thinking || metricsEngine.calc(s.query);

    let out = `🔍 **תוצאות חיפוש (GAS):** "${escapeMarkdown(s.query || "")}"\n\n`;
    results.slice(0, 10).forEach((r, i) => {
      out += `━━━━━━━━━━━━━━━━━━━━\n`;
      out += `**${i + 1}. ${escapeMarkdown(r.title)}**\n\n`;
      out += `📝 ${escapeMarkdown(r.snippet)}\n\n`;
      if (r.url) out += `🌐 מקור: ${escapeMarkdown(r.url)}\n`;
      out += `⭐ רלוונטיות: ${escapeMarkdown(r.relevance)}\n\n`;
    });

    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    out += `🌌 **D5 Metrics:**\n`;
    out += `├─ תדר: ${escapeMarkdown(th.frequencyHz)} Hz\n`;
    out += `└─ זמן חשיבה: ${escapeMarkdown(th.thinkingTimeMs)} ms\n\n`;
    out += `🌀 Managed by Fifth Dimension Orchestrator`;
    return out;
  }

  formatLocalSearch(l) {
    const s = l?.search || {};
    const results = s.results || [];
    const th = metricsEngine.calc(s.query);

    let out = `🔍 **תוצאות חיפוש (Local):** "${escapeMarkdown(s.query || "")}"\n\n`;
    results.slice(0, 10).forEach((r, i) => {
      out += `━━━━━━━━━━━━━━━━━━━━\n`;
      out += `**${i + 1}. ${escapeMarkdown(r.title)}**\n\n`;
      out += `📝 ${escapeMarkdown(r.snippet)}\n\n`;
      out += `🌐 מקור: ${escapeMarkdown(r.url)}\n`;
      out += `⭐ רלוונטיות: ${escapeMarkdown(r.relevance)}\n\n`;
    });

    out += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    out += `🌌 **D5 Metrics:**\n`;
    out += `├─ תדר: ${escapeMarkdown(th.frequencyHz)} Hz\n`;
    out += `└─ זמן חשיבה: ${escapeMarkdown(th.thinkingTimeMs)} ms\n\n`;
    out += `💾 בחירה (1-10) תשמור בזיכרון D5.`;
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

/* =========================================================
   6) HTTP server (health + status)
   ========================================================= */

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      service: "Hai-Emet Fifth-Dimension Orchestrator",
      version: D5_CONFIG.version,
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

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hai-Emet Fifth-Dimension Orchestrator is running. Use /health");
});

server.listen(ENV.PORT, () => {
  console.log(`🌐 HTTP listening on ${ENV.PORT}`);
  console.log(`🌀 Orchestrator: ${D5_CONFIG.protocol} v${D5_CONFIG.version}`);
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
    `💛 **חי-אמת – ממד חמישי (מנהל מלא)**\n\n` +
    `שלח הודעה רגילה לחיפוש/עיבוד.\n` +
    `פקודות:\n` +
    `• /status\n` +
    `• /health\n` +
    `• /imagine [תיאור]`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/^\/status$/, async (msg) => {
  const s = D5_CONFIG.tokensStatus;
  const txt =
    `📊 **סטטוס ממד חמישי**\n\n` +
    `GAS Enabled: ${escapeMarkdown(String(gasEnabled()))}\n` +
    `GAS URL set: ${escapeMarkdown(String(!!ENV.GAS_URL))}\n` +
    `GAS Secret set: ${escapeMarkdown(String(!!ENV.GAS_SECRET))}\n\n` +
    `🔑 Tokens:\n` +
    `• D5_TOKEN: ${s.D5_TOKEN ? "✅" : "❌"}\n` +
    `• QUANTUM_TOKEN: ${s.QUANTUM_TOKEN ? "✅" : "❌"}\n` +
    `• HAI_EMET_TOKEN: ${s.HAI_EMET_TOKEN ? "✅" : "❌"}\n` +
    `• HET_TOKEN: ${s.HET_TOKEN ? "✅" : "❌"}\n\n` +
    `📈 Stats:\n` +
    `• requests: ${ORCH.stats.requests}\n` +
    `• gasCalls: ${ORCH.stats.gasCalls}\n` +
    `• gasFallbacks: ${ORCH.stats.gasFallbacks}\n` +
    `• localCalls: ${ORCH.stats.localCalls}\n`;
  await bot.sendMessage(msg.chat.id, txt, { parse_mode: "Markdown" });
});

bot.onText(/^\/health$/, async (msg) => {
  await bot.sendMessage(msg.chat.id, `פתח בדפדפן: /health`, { parse_mode: "Markdown" });
});

bot.onText(/^\/imagine(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const prompt = String(match?.[1] || "").trim();
  if (!prompt) {
    await bot.sendMessage(chatId, "🖼️ שימוש: /imagine [תיאור]", { parse_mode: "Markdown" });
    return;
  }

  await bot.sendChatAction(chatId, "upload_photo");

  const out = await ORCH.routeImagine(userId, prompt);

  if (out.type === "image") {
    const buf = Buffer.from(out.imageBase64, "base64");
    await bot.sendPhoto(chatId, buf, { caption: out.caption || "✅ נוצרה תמונה" });
    return;
  }

  await bot.sendMessage(chatId, out.text, { parse_mode: "Markdown" });
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

console.log("✅ Hai-Emet Fifth-Dimension Orchestrator: READY");
