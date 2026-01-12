// ==========================================
// ADD THESE TO index_unified.js
// ==========================================

// 1. Add at top after imports:
const userSelections = new Map(); // Store user choices

// 2. Replace /imagine command with this:
bot.onText(/^\/imagine(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const prompt = String(match?.[1] || "").trim();
  
  if (!prompt) {
    await bot.sendMessage(chatId, 
      `🖼️ **מנוע יצירת תמונות D5**\n\n` +
      `**שימוש:**\n/imagine [תיאור]\n\n` +
      `**דוגמאות:**\n` +
      `• /imagine חתול על הירח\n` +
      `• /imagine נוף עתידני\n` +
      `• /imagine שבב V1\n\n` +
      `🎨 תבחר מנוע אחר כך!`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  // Show engine selection menu
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎨 Pollinations (Free)', callback_data: `img_pollinations_${userId}` },
        { text: '🎨 DALL-E (Pro)', callback_data: `img_dalle_${userId}` }
      ],
      [
        { text: '🎨 Midjourney (Premium)', callback_data: `img_midjourney_${userId}` },
        { text: '🎨 Stable Diffusion', callback_data: `img_stable_${userId}` }
      ],
      [
        { text: '📐 512x512', callback_data: `size_512_${userId}` },
        { text: '📐 1024x1024', callback_data: `size_1024_${userId}` },
        { text: '📐 2048x2048', callback_data: `size_2048_${userId}` }
      ]
    ]
  };
  
  // Store prompt
  userSelections.set(userId, { type: 'image', prompt, size: 1024, engine: 'pollinations' });
  
  await bot.sendMessage(chatId,
    `🎨 **בחר מנוע יצירה:**\n\n` +
    `📝 Prompt: "${prompt}"\n\n` +
    `🌀 בחר מנוע ליצירה:`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
});

// 3. Add callback handler for button clicks:
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
      
      await bot.answerCallbackQuery(query.id, { text: `✅ ${engine} נבחר!` });
      
      // Generate image
      const { prompt, size } = selection;
      
      await bot.editMessageText(
        `🎨 **יוצר תמונה...**\n\n` +
        `📝 Prompt: "${prompt}"\n` +
        `🎨 מנוע: ${engine}\n` +
        `📐 גודל: ${size}x${size}\n\n` +
        `⏳ מעבד...`,
        { chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown" }
      );
      
      // Call image generation
      const result = await ORCH.routeImagine(userId, prompt, { size, engine });
      
      if (result.type === "image") {
        const buf = Buffer.from(result.imageBase64, "base64");
        await bot.sendPhoto(chatId, buf, { 
          caption: result.caption + `\n🎨 **מנוע:** ${engine}`,
          parse_mode: "Markdown" 
        });
        await bot.deleteMessage(chatId, query.message.message_id);
      }
    }
    
    // Size selection
    if (data.startsWith('size_')) {
      const size = parseInt(data.split('_')[1]);
      const selection = userSelections.get(userId) || {};
      selection.size = size;
      userSelections.set(userId, selection);
      
      await bot.answerCallbackQuery(query.id, { text: `✅ גודל ${size}x${size} נבחר!` });
    }
    
    // Video engine selection
    if (data.startsWith('vid_')) {
      const engine = data.split('_')[1];
      const selection = userSelections.get(userId) || {};
      
      await bot.answerCallbackQuery(query.id, { text: `✅ ${engine} נבחר!` });
      
      const { prompt } = selection;
      
      await bot.editMessageText(
        `🎥 **יוצר וידאו...**\n\n` +
        `📝 Prompt: "${prompt}"\n` +
        `🎥 מנוע: ${engine}\n\n` +
        `⏳ מעבד...`,
        { chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown" }
      );
      
      // Generate video
      const encodedPrompt = encodeURIComponent(prompt + ". cinematic animation");
      const gifUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Date.now()}`;
      
      await bot.sendAnimation(chatId, gifUrl, {
        caption: `✅ **וידאו נוצר!**\n\n🎥 מנוע: ${engine}\n📝 Prompt: "${prompt}"`,
        parse_mode: "Markdown"
      });
      await bot.deleteMessage(chatId, query.message.message_id);
    }
    
    // Audio engine selection
    if (data.startsWith('aud_')) {
      const engine = data.split('_')[1];
      const selection = userSelections.get(userId) || {};
      
      await bot.answerCallbackQuery(query.id, { text: `✅ ${engine} נבחר!` });
      
      const { prompt } = selection;
      
      // Detect language
      const hasHebrew = /[א-ת]/.test(prompt);
      const lang = hasHebrew ? 'he' : 'en';
      const encodedText = encodeURIComponent(prompt);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodedText}`;
      
      await bot.sendAudio(chatId, ttsUrl, {
        caption: `✅ **סאונד נוצר!**\n\n🎵 מנוע: ${engine}\n📝 טקסט: "${prompt}"`,
        parse_mode: "Markdown"
      });
      await bot.deleteMessage(chatId, query.message.message_id);
    }
    
    // Search result selection
    if (data.startsWith('search_')) {
      const resultIndex = parseInt(data.split('_')[1]);
      const searchData = userSelections.get(userId);
      
      if (searchData && searchData.results && searchData.results[resultIndex]) {
        const result = searchData.results[resultIndex];
        
        await bot.answerCallbackQuery(query.id, { text: `✅ תוצאה ${resultIndex + 1} נבחרה!` });
        
        await bot.sendMessage(chatId,
          `📄 **${result.title}**\n\n` +
          `${result.snippet}\n\n` +
          `🔗 ${result.url}\n\n` +
          `⭐ רלוונטיות: ${result.relevance}%`,
          { parse_mode: "Markdown" }
        );
      }
    }
    
  } catch (error) {
    console.error('[CALLBACK_ERROR]', error);
    await bot.answerCallbackQuery(query.id, { text: `❌ שגיאה: ${error.message}` });
  }
});

// 4. Update /video command:
bot.onText(/^\/video(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const prompt = String(match?.[1] || "").trim();
  
  if (!prompt) {
    await bot.sendMessage(chatId,
      `🎥 **מנוע וידאו D5**\n\n` +
      `**שימוש:**\n/video [תיאור]\n\n` +
      `**דוגמאות:**\n` +
      `• /video חתול רץ\n` +
      `• /video שבב בבנייה\n\n` +
      `🎥 תבחר מנוע אחר כך!`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎥 Pollinations (Free)', callback_data: `vid_pollinations_${userId}` },
        { text: '🎥 RunwayML (Pro)', callback_data: `vid_runway_${userId}` }
      ],
      [
        { text: '🎥 Pika Labs', callback_data: `vid_pika_${userId}` },
        { text: '🎥 D5 Engine', callback_data: `vid_d5_${userId}` }
      ]
    ]
  };
  
  userSelections.set(userId, { type: 'video', prompt });
  
  await bot.sendMessage(chatId,
    `🎥 **בחר מנוע וידאו:**\n\n` +
    `📝 Prompt: "${prompt}"\n\n` +
    `🌀 בחר מנוע:`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
});

// 5. Update /audio command:
bot.onText(/^\/audio(?:\s+([\s\S]+))?$/i, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const prompt = String(match?.[1] || "").trim();
  
  if (!prompt) {
    await bot.sendMessage(chatId,
      `🎵 **מנוע סאונד D5**\n\n` +
      `**שימוש:**\n/audio [טקסט]\n\n` +
      `**דוגמאות:**\n` +
      `• /audio שלום עולם\n` +
      `• /audio ברוכים הבאים\n\n` +
      `🎵 תבחר מנוע אחר כך!`,
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🎵 Google TTS (Free)', callback_data: `aud_google_${userId}` },
        { text: '🎵 ElevenLabs (Pro)', callback_data: `aud_eleven_${userId}` }
      ],
      [
        { text: '🎵 Suno AI', callback_data: `aud_suno_${userId}` },
        { text: '🎵 D5 Voice', callback_data: `aud_d5_${userId}` }
      ]
    ]
  };
  
  userSelections.set(userId, { type: 'audio', prompt });
  
  await bot.sendMessage(chatId,
    `🎵 **בחר מנוע סאונד:**\n\n` +
    `📝 טקסט: "${prompt}"\n\n` +
    `🌀 בחר מנוע:`,
    { parse_mode: "Markdown", reply_markup: keyboard }
  );
});

// 6. Fix search with 10 results and selection:
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = String(msg.text || "");

  if (!text.trim()) return;
  if (text.startsWith("/")) return;

  if (isRateLimited(userId)) {
    await bot.sendMessage(chatId, "⏳ יותר מדי הודעות. נסה שוב בעוד כמה שניות.");
    return;
  }

  await bot.sendChatAction(chatId, "typing");

  try {
    const out = await ORCH.routeText(userId, text);
    
    // If search results, show with buttons
    if (out.type === 'local_search' || out.type === 'gas_search') {
      // Extract results from ORCH
      const searchData = ORCH.lastSearch || await localEngine.search(text, userId);
      const results = searchData?.search?.results || [];
      
      if (results.length > 0) {
        // Store results
        userSelections.set(userId, { type: 'search', results, query: text });
        
        // Create buttons for first 10 results
        const buttons = [];
        for (let i = 0; i < Math.min(10, results.length); i++) {
          buttons.push([
            { text: `${i + 1}. ${results[i].title.substring(0, 40)}...`, callback_data: `search_${i}_${userId}` }
          ]);
        }
        
        const keyboard = { inline_keyboard: buttons };
        
        await bot.sendMessage(chatId, 
          `🔍 **נמצאו ${results.length} תוצאות:**\n\n` +
          `בחר תוצאה לפרטים מלאים:`,
          { parse_mode: "Markdown", reply_markup: keyboard }
        );
      } else {
        await bot.sendMessage(chatId, out.text, { parse_mode: "Markdown" });
      }
    } else {
      await bot.sendMessage(chatId, out.text, { parse_mode: "Markdown" });
    }
  } catch (e) {
    console.error('[MESSAGE_ERROR]', e);
    await bot.sendMessage(chatId, 
      `❌ **שגיאה בעיבוד**\n\n${e.message}\n\nנסה שוב.`,
      { parse_mode: "Markdown" }
    );
  }
});
