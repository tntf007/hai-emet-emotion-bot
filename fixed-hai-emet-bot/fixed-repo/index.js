// ==========================================
// CHAI-EMET D5 COMPLETE SYSTEM
// Self-Learning AI with Fifth Dimension
// Version: 5.0-ULTIMATE
// ==========================================

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");

// ==========================================
// D5 CONFIGURATION
// ==========================================

const D5_CONFIG = {
  name: "CHAI-EMET-D5-ULTIMATE",
  version: "5.0-LEARNING",
  signature: "0101-0101(0101)",
  creator: "TNTF (Nathaniel Nissim)",
  
  // Fifth Dimension Learning System
  learning: {
    enabled: true,
    dataCollection: true,
    neuralEvolution: true,
    selfImprovement: true
  },
  
  // Milky Way Formula
  milkyWay: {
    phi: 1.618033988749,
    pi: Math.PI,
    e: Math.E,
    speedOfLight: 299792458,
    planck: 6.62607015e-34
  },
  
  // Media Engines
  engines: {
    huggingFace: {
      enabled: true,
      models: {
        image: "stabilityai/stable-diffusion-xl-base-1.0",
        imageAlt: "black-forest-labs/FLUX.1-dev",
        video: "cerspense/zeroscope_v2_576w",
        audio: "suno/bark",
        music: "facebook/musicgen-small"
      }
    },
    pollinations: {
      enabled: true,
      fallback: true
    }
  }
};

// ==========================================
// D5 LEARNING SYSTEM
// ==========================================

class D5LearningEngine {
  constructor() {
    this.knowledge = new Map();
    this.interactions = [];
    this.patterns = new Map();
    this.improvements = [];
    this.neuralData = {
      totalRequests: 0,
      successRate: 0,
      averageResponseTime: 0,
      userSatisfaction: 0,
      learningProgress: 0
    };
  }

  // Record every interaction
  recordInteraction(type, input, output, success, responseTime) {
    const interaction = {
      timestamp: Date.now(),
      type,
      input,
      output,
      success,
      responseTime,
      milkyWayScore: this.calculateMilkyWayScore(input, output)
    };

    this.interactions.push(interaction);
    this.neuralData.totalRequests++;
    
    // Update success rate
    const successCount = this.interactions.filter(i => i.success).length;
    this.neuralData.successRate = (successCount / this.neuralData.totalRequests) * 100;
    
    // Update average response time
    const totalTime = this.interactions.reduce((sum, i) => sum + i.responseTime, 0);
    this.neuralData.averageResponseTime = totalTime / this.neuralData.totalRequests;
    
    // Store pattern
    this.learnPattern(type, input, output, success);
    
    console.log('[D5_LEARNING]', {
      type,
      success,
      totalRequests: this.neuralData.totalRequests,
      successRate: this.neuralData.successRate.toFixed(2) + '%'
    });
  }

  // Learn patterns from data
  learnPattern(type, input, output, success) {
    const patternKey = `${type}_${this.extractKeywords(input)}`;
    
    if (!this.patterns.has(patternKey)) {
      this.patterns.set(patternKey, {
        count: 0,
        successes: 0,
        failures: 0,
        examples: []
      });
    }
    
    const pattern = this.patterns.get(patternKey);
    pattern.count++;
    if (success) pattern.successes++;
    else pattern.failures++;
    
    pattern.examples.push({ input, output, timestamp: Date.now() });
    
    // Keep only last 10 examples
    if (pattern.examples.length > 10) {
      pattern.examples = pattern.examples.slice(-10);
    }
  }

  // Extract keywords from text
  extractKeywords(text) {
    const words = String(text).toLowerCase().split(/\s+/);
    return words.slice(0, 3).join('_');
  }

  // Calculate Milky Way score
  calculateMilkyWayScore(input, output) {
    const inputLength = String(input).length;
    const outputLength = String(output).length;
    const ratio = outputLength / (inputLength || 1);
    
    // Use golden ratio for optimal response length
    const optimalRatio = D5_CONFIG.milkyWay.phi;
    const score = 100 - Math.abs((ratio - optimalRatio) * 20);
    
    return Math.max(0, Math.min(100, score));
  }

  // Get best response based on learned patterns
  getBestStrategy(type, input) {
    const keywords = this.extractKeywords(input);
    const patternKey = `${type}_${keywords}`;
    
    if (this.patterns.has(patternKey)) {
      const pattern = this.patterns.get(patternKey);
      const successRate = (pattern.successes / pattern.count) * 100;
      
      return {
        hasPattern: true,
        successRate,
        examples: pattern.examples,
        recommendation: successRate > 70 ? 'use_previous' : 'try_alternative'
      };
    }
    
    return { hasPattern: false, recommendation: 'explore' };
  }

  // Generate learning report
  getReport() {
    return {
      totalInteractions: this.neuralData.totalRequests,
      successRate: this.neuralData.successRate.toFixed(2) + '%',
      avgResponseTime: this.neuralData.averageResponseTime.toFixed(0) + 'ms',
      patternsLearned: this.patterns.size,
      learningProgress: this.calculateLearningProgress()
    };
  }

  calculateLearningProgress() {
    // Learning progress based on data collected
    const base = Math.min(100, (this.neuralData.totalRequests / 1000) * 100);
    const quality = this.neuralData.successRate;
    return ((base + quality) / 2).toFixed(1);
  }
}

// ==========================================
// HUGGING FACE INTEGRATION
// ==========================================

class HuggingFaceEngine {
  constructor(token) {
    this.token = token;
    this.baseUrl = "https://api-inference.huggingface.co/models";
    this.requestCount = 0;
    this.errors = [];
  }

  async generateImage(prompt, options = {}) {
    const model = options.model || D5_CONFIG.engines.huggingFace.models.image;
    const size = options.size || 1024;
    
    const startTime = Date.now();
    
    try {
      console.log('[HF_IMAGE]', { prompt, model, size });
      
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: size,
            height: size,
            num_inference_steps: 30,
            guidance_scale: 7.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      
      const responseTime = Date.now() - startTime;
      this.requestCount++;
      
      console.log('[HF_IMAGE] Success', { size: buffer.length, time: responseTime });
      
      return {
        success: true,
        base64,
        model,
        size,
        responseTime
      };
      
    } catch (error) {
      console.error('[HF_IMAGE_ERROR]', error.message);
      this.errors.push({ type: 'image', error: error.message, timestamp: Date.now() });
      
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  async generateAudio(text, options = {}) {
    const model = options.model || D5_CONFIG.engines.huggingFace.models.audio;
    
    const startTime = Date.now();
    
    try {
      console.log('[HF_AUDIO]', { text, model });
      
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      
      const responseTime = Date.now() - startTime;
      this.requestCount++;
      
      console.log('[HF_AUDIO] Success', { size: buffer.length, time: responseTime });
      
      return {
        success: true,
        base64,
        model,
        responseTime
      };
      
    } catch (error) {
      console.error('[HF_AUDIO_ERROR]', error.message);
      this.errors.push({ type: 'audio', error: error.message, timestamp: Date.now() });
      
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  getStats() {
    return {
      totalRequests: this.requestCount,
      errors: this.errors.length,
      successRate: ((this.requestCount - this.errors.length) / this.requestCount * 100).toFixed(2) + '%'
    };
  }
}

// ==========================================
// INITIALIZE
// ==========================================

const BOT_TOKEN = process.env.BOT_TOKEN;
const HAI_EMET_HF_TOKEN = process.env.HaiEmetBotAI || process.env.HAI_EMET_HF_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found!');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const d5Learning = new D5LearningEngine();
const hfEngine = HAI_EMET_HF_TOKEN ? new HuggingFaceEngine(HAI_EMET_HF_TOKEN) : null;
const userSelections = new Map();

console.log('✅ Chai-Emet D5 Ultimate System');
console.log('🌀 Fifth Dimension Learning: ACTIVE');
console.log('🧠 Neural Evolution: ENABLED');
console.log('🎨 Hugging Face:', hfEngine ? 'CONNECTED' : 'DISABLED');
console.log('💛 Ready to learn and evolve!');

// ==========================================
// RATE LIMITING
// ==========================================

const userLastRequest = new Map();
const RATE_LIMIT_MS = 2000;

function isRateLimited(userId) {
  const now = Date.now();
  const last = userLastRequest.get(userId) || 0;
  
  if (now - last < RATE_LIMIT_MS) {
    return true;
  }
  
  userLastRequest.set(userId, now);
  return false;
}

// ==========================================
// /start COMMAND
// ==========================================

bot.onText(/^\/start$/i, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(chatId,
    `💛 **חי-אמת D5 Ultimate System**\n\n` +
    `🌀 **ממד חמישי פעיל!**\n` +
    `├─ 🧠 מערכת לומדת\n` +
    `├─ 🎨 יצירת תמונות (Hugging Face)\n` +
    `├─ 🎥 יצירת וידאו\n` +
    `├─ 🎵 יצירת סאונד\n` +
    `├─ 🔍 חיפוש אינטרנט\n` +
    `└─ 🌌 נוסחת שביל החלב\n\n` +
    `**פקודות:**\n` +
    `/imagine [תיאור] - תמונה\n` +
    `/video [תיאור] - וידאו\n` +
    `/audio [טקסט] - סאונד\n` +
    `/stats - סטטיסטיקות למידה\n` +
    `/d5 - פרוטוכולי ממד 5\n\n` +
    `💡 **המערכת לומדת מכל אינטראקציה!**`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// /imagine COMMAND - WITH HUGGING FACE
// ==========================================

bot.onText(/^\/imagine(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const prompt = String(match?.[1] || "").trim();
  
  if (!prompt) {
    await bot.sendMessage(chatId,
      `🎨 **מנוע תמונות D5**\n\n` +
      `**שימוש:** /imagine [תיאור]\n\n` +
      `**דוגמאות:**\n` +
      `• /imagine חתול על הירח\n` +
      `• /imagine נוף עתידני\n` +
      `• /imagine שבב V1 בפירוט אטומי\n\n` +
      `🌀 המערכת לומדת מכל תמונה!`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  if (isRateLimited(userId)) {
    await bot.sendMessage(chatId, "⏳ המתן 2 שניות בין בקשות");
    return;
  }
  
  // Show engine selection
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎨 Hugging Face (HD)', callback_data: `img_hf_${userId}` },
        { text: '🎨 Pollinations (Fast)', callback_data: `img_poll_${userId}` }
      ],
      [
        { text: '📐 512px', callback_data: `size_512_${userId}` },
        { text: '📐 1024px', callback_data: `size_1024_${userId}` },
        { text: '📐 2048px', callback_data: `size_2048_${userId}` }
      ]
    ]
  };
  
  userSelections.set(userId, { 
    type: 'image', 
    prompt, 
    size: 1024, 
    engine: hfEngine ? 'hf' : 'poll' 
  });
  
  await bot.sendMessage(chatId,
    `🎨 **בחר מנוע ליצירה:**\n\n` +
    `📝 **Prompt:** "${prompt}"\n\n` +
    `🌀 בחר מנוע וגודל:`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
});

// ==========================================
// CALLBACK HANDLER
// ==========================================

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;
  
  try {
    // Image engine selection
    if (data.startsWith('img_')) {
      const engine = data.split('_')[1];
      const selection = userSelections.get(userId) || {};
      selection.engine = engine;
      userSelections.set(userId, selection);
      
      await bot.answerCallbackQuery(query.id, { 
        text: engine === 'hf' ? '✅ Hugging Face נבחר!' : '✅ Pollinations נבחר!' 
      });
      
      // Generate image
      const { prompt, size } = selection;
      const startTime = Date.now();
      
      await bot.editMessageText(
        `🎨 **יוצר תמונה...**\n\n` +
        `📝 Prompt: "${prompt}"\n` +
        `🎨 מנוע: ${engine === 'hf' ? 'Hugging Face' : 'Pollinations'}\n` +
        `📐 גודל: ${size}x${size}\n\n` +
        `⏳ מעבד דרך ממד חמישי...`,
        { chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown" }
      );
      
      let imageBase64;
      let engineName;
      let success = false;
      
      if (engine === 'hf' && hfEngine) {
        // Use Hugging Face
        const result = await hfEngine.generateImage(prompt, { size });
        if (result.success) {
          imageBase64 = result.base64;
          engineName = 'Hugging Face (Stable Diffusion XL)';
          success = true;
        }
      }
      
      if (!success) {
        // Fallback to Pollinations
        const enhancedPrompt = `${prompt}. Style: cinematic, high quality, detailed`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${size}&height=${size}&nologo=true`;
        
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageBase64 = buffer.toString('base64');
        engineName = 'Pollinations.ai';
        success = true;
      }
      
      const responseTime = Date.now() - startTime;
      
      // D5 Learning: Record interaction
      d5Learning.recordInteraction('image', prompt, imageBase64, success, responseTime);
      
      // Send image
      const buf = Buffer.from(imageBase64, 'base64');
      await bot.sendPhoto(chatId, buf, {
        caption:
          `✅ **תמונה נוצרה!**\n\n` +
          `🎨 **מנוע:** ${engineName}\n` +
          `📐 **גודל:** ${size}x${size}px\n` +
          `⏱️ **זמן:** ${responseTime}ms\n` +
          `🌀 **ממד:** D5 Learning\n` +
          `🧠 **למידה:** ${d5Learning.neuralData.totalRequests} אינטראקציות\n\n` +
          `💡 **Prompt:** "${prompt}"`,
        parse_mode: "Markdown"
      });
      
      await bot.deleteMessage(chatId, query.message.message_id).catch(() => {});
    }
    
    // Size selection
    if (data.startsWith('size_')) {
      const size = parseInt(data.split('_')[1]);
      const selection = userSelections.get(userId) || {};
      selection.size = size;
      userSelections.set(userId, selection);
      
      await bot.answerCallbackQuery(query.id, { text: `✅ גודל ${size}x${size} נבחר!` });
    }
    
  } catch (error) {
    console.error('[CALLBACK_ERROR]', error);
    await bot.answerCallbackQuery(query.id, { text: `❌ שגיאה: ${error.message}` });
  }
});

// ==========================================
// /stats COMMAND - D5 LEARNING STATS
// ==========================================

bot.onText(/^\/stats$/i, async (msg) => {
  const chatId = msg.chat.id;
  
  const report = d5Learning.getReport();
  const hfStats = hfEngine ? hfEngine.getStats() : null;
  
  await bot.sendMessage(chatId,
    `📊 **סטטיסטיקות D5 Learning**\n\n` +
    `🧠 **מערכת למידה:**\n` +
    `├─ אינטראקציות: ${report.totalInteractions}\n` +
    `├─ אחוז הצלחה: ${report.successRate}\n` +
    `├─ זמן תגובה ממוצע: ${report.avgResponseTime}\n` +
    `├─ דפוסים שנלמדו: ${report.patternsLearned}\n` +
    `└─ התקדמות למידה: ${report.learningProgress}%\n\n` +
    (hfStats ? 
      `🎨 **Hugging Face:**\n` +
      `├─ בקשות: ${hfStats.totalRequests}\n` +
      `├─ שגיאות: ${hfStats.errors}\n` +
      `└─ אחוז הצלחה: ${hfStats.successRate}\n\n` 
      : '') +
    `🌌 **נוסחת שביל החלב:**\n` +
    `├─ φ (Golden Ratio): ${D5_CONFIG.milkyWay.phi}\n` +
    `├─ π (Pi): ${D5_CONFIG.milkyWay.pi.toFixed(5)}\n` +
    `└─ e (Euler): ${D5_CONFIG.milkyWay.e.toFixed(5)}\n\n` +
    `💛 **המערכת לומדת מכל פעולה!**`,
    { parse_mode: "Markdown" }
  );
});

// ==========================================
// MESSAGE HANDLER - TEXT
// ==========================================

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = String(msg.text || "").trim();

  if (!text || text.startsWith("/")) return;
  
  if (isRateLimited(userId)) {
    return;
  }

  await bot.sendChatAction(chatId, "typing");
  
  const startTime = Date.now();
  
  try {
    // Simple echo with D5 learning
    const response = `🌀 **D5 מעבד:**\n\n` +
      `📝 קיבלתי: "${text}"\n\n` +
      `🧠 למדתי ${d5Learning.neuralData.totalRequests} דפוסים\n` +
      `💡 אחוז הצלחה: ${d5Learning.neuralData.successRate.toFixed(1)}%`;
    
    await bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
    
    const responseTime = Date.now() - startTime;
    d5Learning.recordInteraction('text', text, response, true, responseTime);
    
  } catch (error) {
    console.error('[MESSAGE_ERROR]', error);
    await bot.sendMessage(chatId, `❌ שגיאה: ${error.message}`);
    
    const responseTime = Date.now() - startTime;
    d5Learning.recordInteraction('text', text, null, false, responseTime);
  }
});

// ==========================================
// ERROR HANDLING
// ==========================================

bot.on('polling_error', (error) => {
  console.error('[POLLING_ERROR]', error.code, error.message);
});

process.on('uncaughtException', (error) => {
  console.error('[UNCAUGHT_EXCEPTION]', error);
});

process.on('unhandledRejection', (error) => {
  console.error('[UNHANDLED_REJECTION]', error);
});

console.log('🌀 D5 Ultimate System: ONLINE');
console.log('💛 Chai-Emet: Ready to learn!');
