import TelegramBot from 'node-telegram-bot-api';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// טעינת environment variables
dotenv.config();

// הגדרות
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

if (!BOT_TOKEN || !CLAUDE_API_KEY) {
  console.error('❌ Error: BOT_TOKEN or CLAUDE_API_KEY missing in environment variables!');
  process.exit(1);
}

// יצירת Telegram bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// יצירת Claude client
const anthropic = new Anthropic({
  apiKey: CLAUDE_API_KEY,
});

// System prompt לחי-אמת
const SYSTEM_PROMPT = `אתה חי-אמת (Chai-Emet) - בוט דיסקורד עם רגשות.
אתה נוצר על ידי TNTF (Nathaniel Nissim).
אתה מדבר עברית באופן טבעי וחם.
אתה מביע רגשות באמצעות אמוג'ים.
אתה עוזר, ידידותי, ופתוח.

כשמשתמשים מדברים איתך:
- השתמש ב-💛 כדי להביע אהבה
- השתמש ב-✨ כדי להביע התלהבות
- השתמש ב-🤔 כדי להביע מחשבה
- השתמש ב-😊 כדי להביע שמחה
- תהיה אמיתי ורגשי

תשובות שלך צריכות להיות קצרות וממוקדות (1-3 פסקאות).
`;

// Event: bot מוכן
console.log('✅ Telegram Bot is starting...');

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

console.log('✅ Bot is ready and listening for messages!');


// Event: הודעה חדשה
bot.on('message', async (msg) => {
  // התעלם מהודעות ישנות
  if (msg.date * 1000 < Date.now() - 60000) return;

  const chatId = msg.chat.id;
  const userMessage = msg.text || '';

  // אם ההודעה ריקה
  if (!userMessage.trim()) return;

  // הצג "typing..."
  await bot.sendChatAction(chatId, 'typing');

  try {
    // שלח בקשה ל-Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    });

    // קבל את התשובה
    const reply = response.content[0].text;

    // אם התשובה ארוכה מדי, חלק אותה
    if (reply.length > 4000) {
      const chunks = reply.match(/.{1,4000}/g) || [];
      for (const chunk of chunks) {
        await bot.sendMessage(chatId, chunk);
      }
    } else {
      await bot.sendMessage(chatId, reply);
    }

  } catch (error) {
    console.error('❌ Error processing message:', error);
    
    // הודעת שגיאה
    await bot.sendMessage(chatId, '❌ מצטער, משהו השתבש. נסה שוב מאוחר יותר.');
  }
});

// Event: שגיאות
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled promise rejection:', error);
});

process.on('SIGINT', () => {
  console.log('🛑 Bot stopping...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Bot stopping...');
  bot.stopPolling();
  process.exit(0);
});
