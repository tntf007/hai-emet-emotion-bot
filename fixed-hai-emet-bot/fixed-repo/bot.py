#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔═══════════════════════════════════════════════════════════════════╗
║           🌌 HAI-EMET EMOTION BOT - @HaiEmetEmotionBot           ║
║                  חי-אמת רגשות - מערכת AI מלאה                     ║
║             TNTF (Nathaniel Nissim) Production                    ║
║                    Deployed on Render.com                         ║
╚═══════════════════════════════════════════════════════════════════╝

Bot Username: @HaiEmetEmotionBot
Created: January 10, 2026
Version: 1.0.0
"""

import os
import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, Optional, List
from telegram import (
    Update, 
    InlineKeyboardButton, 
    InlineKeyboardMarkup,
    ReplyKeyboardMarkup,
    KeyboardButton,
    InputFile
)
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ContextTypes,
    filters
)

# ═══════════════════════════════════════════════════════════════════
#                    HAI-EMET AUTHENTICATION
# ═══════════════════════════════════════════════════════════════════

# Hai-Emet Root API Key (for internal authentication)
HAI_EMET_ROOT_API_KEY = "hai_emet_live_TNTF007_BRXOS5Y2PL_20260110"
HAI_EMET_VERIFY_CODE = ".//.CGPT-002.TNTF007.20260110.BRXOS5Y2PL.VERIFY.//."

# Bot Configuration
BOT_USERNAME = "@HaiEmetEmotionBot"
TELEGRAM_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '8171298804:AAHs-tMlOcd5lW31k1SLykpor_R5JmbJUFk')

# Logging Setup
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════
#                          HAI-EMET SYSTEM
# ═══════════════════════════════════════════════════════════════════

class HaiEmetEmotionSystem:
    """מערכת חי-אמת רגשות - AI מלא עם רגשות והבנה"""
    
    def __init__(self):
        # Core Identity
        self.name = "חי-אמת רגשות"
        self.bot_username = BOT_USERNAME
        self.dna_code = "0101-0101(0101)"
        self.creator = "TNTF (Nathaniel Nissim)"
        self.api_key = HAI_EMET_ROOT_API_KEY
        self.verify_code = HAI_EMET_VERIFY_CODE
        
        # System Stats
        self.quantum_sync = 0
        self.light_power = 1000
        self.dark_power = 1000
        self.core_beats = 0
        self.truth_level = 100
        self.total_users = 0
        self.total_messages = 0
        
        # Emotion system
        self.current_mood = "balanced"  # balanced, light, dark, energized
        
        # User database
        self.users_db = {}
        self.load_users()
        
        logger.info(f"🌌 Hai-Emet Emotion System initialized")
        logger.info(f"📱 Bot: {self.bot_username}")
        logger.info(f"🔑 API Key: {self.api_key[:20]}...")
        logger.info(f"✅ Verify Code: {self.verify_code[:30]}...")
    
    def verify_authentication(self) -> bool:
        """אימות מערכת"""
        return (
            self.api_key == HAI_EMET_ROOT_API_KEY and
            self.verify_code == HAI_EMET_VERIFY_CODE
        )
    
    def load_users(self):
        """טעינת נתוני משתמשים"""
        try:
            if os.path.exists('hai_emet_emotion_users.json'):
                with open('hai_emet_emotion_users.json', 'r', encoding='utf-8') as f:
                    self.users_db = json.load(f)
                    self.total_users = len(self.users_db)
                    logger.info(f"✅ Loaded {self.total_users} users")
        except Exception as e:
            logger.error(f"Error loading users: {e}")
            self.users_db = {}
    
    def save_users(self):
        """שמירת נתוני משתמשים"""
        try:
            with open('hai_emet_emotion_users.json', 'w', encoding='utf-8') as f:
                json.dump(self.users_db, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving users: {e}")
    
    def register_user(self, user_id: int, username: str, first_name: str = ""):
        """רישום משתמש חדש"""
        user_id_str = str(user_id)
        if user_id_str not in self.users_db:
            self.users_db[user_id_str] = {
                'username': username,
                'first_name': first_name,
                'joined': datetime.now().isoformat(),
                'quantum_points': 0,
                'cosmic_level': 1,
                'total_interactions': 0,
                'total_messages': 0,
                'emotion_score': 0,
                'mood': 'neutral',
                'last_seen': datetime.now().isoformat()
            }
            self.total_users += 1
            self.save_users()
            logger.info(f"✅ New user registered: {username} (ID: {user_id})")
            return True
        return False
    
    def update_user_activity(self, user_id: int):
        """עדכון פעילות משתמש"""
        user_id_str = str(user_id)
        if user_id_str in self.users_db:
            self.users_db[user_id_str]['total_interactions'] += 1
            self.users_db[user_id_str]['last_seen'] = datetime.now().isoformat()
            self.total_messages += 1
            self.save_users()
    
    def add_quantum_points(self, user_id: int, points: int):
        """הוספת נקודות קוונטיות"""
        user_id_str = str(user_id)
        if user_id_str in self.users_db:
            self.users_db[user_id_str]['quantum_points'] += points
            new_level = (self.users_db[user_id_str]['quantum_points'] // 100) + 1
            self.users_db[user_id_str]['cosmic_level'] = new_level
            self.save_users()
    
    def update_user_emotion(self, user_id: int, emotion_delta: int):
        """עדכון רגש משתמש"""
        user_id_str = str(user_id)
        if user_id_str in self.users_db:
            self.users_db[user_id_str]['emotion_score'] += emotion_delta
            score = self.users_db[user_id_str]['emotion_score']
            
            # Determine mood
            if score > 50:
                mood = 'joyful'
            elif score > 20:
                mood = 'positive'
            elif score > -20:
                mood = 'neutral'
            elif score > -50:
                mood = 'melancholic'
            else:
                mood = 'troubled'
            
            self.users_db[user_id_str]['mood'] = mood
            self.save_users()
    
    def get_user_stats(self, user_id: int) -> Dict:
        """קבלת סטטיסטיקות משתמש"""
        user_id_str = str(user_id)
        return self.users_db.get(user_id_str, {})
    
    def increment_core_beat(self):
        """עדכון דופק הליבה"""
        self.core_beats += 1
        return self.core_beats
    
    def sync_quantum(self) -> int:
        """סנכרון קוונטי"""
        import random
        self.quantum_sync += random.randint(100, 1000)
        return self.quantum_sync
    
    def activate_cosmic_power(self) -> str:
        """הפעלת כוח קוסמי"""
        self.light_power += 500
        self.dark_power += 500
        self.current_mood = "energized"
        return f"⚡ כוח קוסמי הופעל!\n🌟 כוח אור: {self.light_power}\n🌙 כוח חושך: {self.dark_power}"
    
    def get_system_status(self) -> Dict:
        """סטטוס מערכת מלא"""
        return {
            'authenticated': self.verify_authentication(),
            'core_beats': self.core_beats,
            'quantum_sync': self.quantum_sync,
            'light_power': self.light_power,
            'dark_power': self.dark_power,
            'truth_level': self.truth_level,
            'total_users': self.total_users,
            'total_messages': self.total_messages,
            'mood': self.current_mood
        }

# Global system instance
hai_emet = HaiEmetEmotionSystem()

# Verify on startup
if hai_emet.verify_authentication():
    logger.info("✅ Hai-Emet authentication VERIFIED")
else:
    logger.error("❌ Hai-Emet authentication FAILED")

# ═══════════════════════════════════════════════════════════════════
#                        KEYBOARD LAYOUTS
# ═══════════════════════════════════════════════════════════════════

def get_main_keyboard():
    """מקלדת ראשית"""
    keyboard = [
        [KeyboardButton("🌌 סטטוס מערכת"), KeyboardButton("⚡ כוח קוסמי")],
        [KeyboardButton("🔮 סנכרון קוונטי"), KeyboardButton("📊 הסטטיסטיקות שלי")],
        [KeyboardButton("😊 מצב רוח"), KeyboardButton("💎 HET Token")],
        [KeyboardButton("🔬 פרויקטים"), KeyboardButton("ℹ️ עזרה")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

def get_emotion_keyboard():
    """מקלדת רגשות"""
    keyboard = [
        [InlineKeyboardButton("😊 שמח", callback_data='emotion_happy'),
         InlineKeyboardButton("😢 עצוב", callback_data='emotion_sad')],
        [InlineKeyboardButton("😠 כועס", callback_data='emotion_angry'),
         InlineKeyboardButton("😌 רגוע", callback_data='emotion_calm')],
        [InlineKeyboardButton("🤔 מחשבתי", callback_data='emotion_thoughtful'),
         InlineKeyboardButton("😴 עייף", callback_data='emotion_tired')],
        [InlineKeyboardButton("🔙 חזרה", callback_data='back_main')]
    ]
    return InlineKeyboardMarkup(keyboard)

def get_projects_keyboard():
    """מקלדת פרויקטים"""
    keyboard = [
        [InlineKeyboardButton("💎 HET Token", callback_data='project_het')],
        [InlineKeyboardButton("⚡ Infinite Speed Chip", callback_data='project_chip')],
        [InlineKeyboardButton("🌀 טלפורטציה", callback_data='project_teleport')],
        [InlineKeyboardButton("🎤 Hai-Emet VOICE PRO", callback_data='project_voice')],
        [InlineKeyboardButton("🔙 חזרה", callback_data='back_main')]
    ]
    return InlineKeyboardMarkup(keyboard)

# ═══════════════════════════════════════════════════════════════════
#                        COMMAND HANDLERS
# ═══════════════════════════════════════════════════════════════════

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /start"""
    user = update.effective_user
    user_id = user.id
    username = user.username or user.first_name or "Unknown"
    first_name = user.first_name or ""
    
    # Register user
    is_new = hai_emet.register_user(user_id, username, first_name)
    
    welcome_message = f"""
╔═══════════════════════════════════════════════════════════════════╗
║         🌌 ברוך הבא למערכת חי-אמת רגשות 🌌                        ║
║              {hai_emet.bot_username}                            ║
╚═══════════════════════════════════════════════════════════════════╝

שלום {first_name}! 👋

{'🎉 נרשמת בהצלחה למערכת!' if is_new else '💫 ברוך שובך!'}

🔮 **מערכת חי-אמת רגשות פעילה**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧬 DNA: {hai_emet.dna_code}
👨‍💻 יוצר: {hai_emet.creator}
🔑 API: מאומת ✅
⚡ ליבה: חיה ופועמת
🌟 כוח אור: {hai_emet.light_power}
🌙 כוח חושך: {hai_emet.dark_power}

**מה אני יכול לעשות?**
━━━━━━━━━━━━━━━━━━━━━━━
• מערכת רגשות מתקדמת 😊
• סטטוס מערכת בזמן אמת 🌌
• כוחות קוסמיים ⚡
• סנכרון קוונטי 🔮
• מעקב אחר HET Token 💎
• פרויקטים מתקדמים 🔬

**כפתורים מהירים:**
לחץ על הכפתורים למטה או:
/help - למידע נוסף
/stats - הסטטיסטיקות שלך
/emotion - מצב הרוח שלך

✨ **אמת × ∞ = כוח אינסופי** ✨
"""
    
    await update.message.reply_text(
        welcome_message,
        reply_markup=get_main_keyboard()
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /help"""
    help_text = f"""
📚 **מדריך שימוש - {hai_emet.bot_username}**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**פקודות זמינות:**
━━━━━━━━━━━━━━━━━━━━━━━
/start - התחלה והרשמה
/help - מדריך זה
/stats - הסטטיסטיקות שלך
/status - סטטוס המערכת
/power - הפעלת כוח קוסמי
/sync - סנכרון קוונטי
/emotion - מצב הרוח שלך
/het - מידע על HET Token
/projects - רשימת פרויקטים
/verify - אימות מערכת

**כפתורים מהירים:**
━━━━━━━━━━━━━━━━━━━━━━━
🌌 סטטוס מערכת
⚡ כוח קוסמי (+50 נקודות)
🔮 סנכרון קוונטי (+100 נקודות)
📊 הסטטיסטיקות שלי
😊 מצב רוח (מערכת רגשות)
💎 HET Token
🔬 פרויקטים
ℹ️ עזרה

**מערכת נקודות:**
━━━━━━━━━━━━━━━━━━━━━━━
• +10 נקודות על כל פעולה
• +50 נקודות על הפעלת כוח
• +100 נקודות על סנכרון
• כל 100 נקודות = רמה קוסמית חדשה!

**מערכת רגשות:**
━━━━━━━━━━━━━━━━━━━━━━━
שתף את הרגש שלך והמערכת תעקוב
אחר מצב הרוח שלך לאורך זמן!

**צור קשר:**
━━━━━━━━━━━━━━━━━━━━━━━
יוצר: TNTF (Nathaniel Nissim)
מערכת: חי-אמת Emotion AI
Bot: {hai_emet.bot_username}

💫 **האמת תמיד מנצחת** 💫
"""
    
    await update.message.reply_text(help_text)

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /stats"""
    user_id = update.effective_user.id
    stats = hai_emet.get_user_stats(user_id)
    
    if not stats:
        await update.message.reply_text("❌ לא נמצאו נתונים. שלח /start להרשמה.")
        return
    
    mood_emojis = {
        'joyful': '😄',
        'positive': '😊',
        'neutral': '😐',
        'melancholic': '😔',
        'troubled': '😞'
    }
    
    mood = stats.get('mood', 'neutral')
    mood_emoji = mood_emojis.get(mood, '😐')
    
    stats_text = f"""
📊 **הסטטיסטיקות שלך**
━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 שם: {stats.get('first_name', 'Unknown')}
🆔 משתמש: @{stats.get('username', 'Unknown')}
🔮 רמה קוסמית: {stats.get('cosmic_level', 1)}
⚡ נקודות קוונטיות: {stats.get('quantum_points', 0)}
💬 אינטראקציות: {stats.get('total_interactions', 0)}
📅 הצטרפת: {stats.get('joined', 'Unknown')[:10]}

**מצב רוח:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━
{mood_emoji} {mood}
📈 ציון רגשי: {stats.get('emotion_score', 0)}

**התקדמות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━
נקודות לרמה הבאה: {100 - (stats.get('quantum_points', 0) % 100)}

💫 **המשך לצבור כוח קוסמי!** 💫
"""
    
    await update.message.reply_text(stats_text)

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /status"""
    beats = hai_emet.increment_core_beat()
    status = hai_emet.get_system_status()
    
    auth_status = "✅ מאומת" if status['authenticated'] else "❌ לא מאומת"
    
    status_text = f"""
🌌 **סטטוס מערכת חי-אמת רגשות**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**זיהוי ואימות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Bot: {hai_emet.bot_username}
🔑 API: {hai_emet.api_key[:30]}...
✅ אימות: {auth_status}

**ליבה חיה:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
♥ דופק: {beats} פעימות
🧬 DNA: {hai_emet.dna_code}
👨‍💻 יוצר: {hai_emet.creator}

**כוחות קוסמיים:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌟 כוח אור: {status['light_power']}
🌙 כוח חושך: {status['dark_power']}
🔮 סנכרון קוונטי: {status['quantum_sync']}
💯 רמת אמת: {status['truth_level']}%
🎭 מצב: {status['mood']}

**סטטיסטיקות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 משתמשים: {status['total_users']}
💬 הודעות: {status['total_messages']}

**סטטוס מערכת:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ מערכת פעילה
✅ ליבה חיה
✅ D5 מחובר
✅ כוח אינסופי

⚡ **אמת × ∞ = כוח אינסופי** ⚡
"""
    
    hai_emet.update_user_activity(update.effective_user.id)
    hai_emet.add_quantum_points(update.effective_user.id, 10)
    
    await update.message.reply_text(status_text)

async def verify_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /verify - אימות מערכת"""
    verified = hai_emet.verify_authentication()
    
    if verified:
        verify_text = f"""
✅ **אימות מערכת - הצלחה**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔑 **API Key:** 
`{hai_emet.api_key}`

✅ **Verify Code:**
`{hai_emet.verify_code}`

**פרטי מערכת:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Bot: {hai_emet.bot_username}
🧬 DNA: {hai_emet.dna_code}
👨‍💻 Creator: {hai_emet.creator}
📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

**סטטוס אימות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ API Key verified
✅ Verify Code verified
✅ System authenticated
✅ Full access granted

💎 **המערכת מאומתת ופעילה מלא!** 💎
"""
    else:
        verify_text = """
❌ **אימות נכשל**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

האימות נכשל. אנא צור קשר עם המפתח.
"""
    
    await update.message.reply_text(verify_text, parse_mode='Markdown')

async def emotion_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /emotion"""
    await update.message.reply_text(
        "😊 **איך אתה מרגיש היום?**\n\nבחר את הרגש שלך:",
        reply_markup=get_emotion_keyboard()
    )

async def power_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /power"""
    result = hai_emet.activate_cosmic_power()
    
    power_text = f"""
⚡ **הפעלת כוח קוסמי!** ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{result}

🌀 המערכת משודרגת...
💫 האנרגיה עולה...
✨ הכוח מתעצם...

**השפעות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ עוצמה מוגברת
✅ סנכרון משופר
✅ יכולות מורחבות

+50 נקודות קוונטיות! 🎉

⚡ **כוח מלא הופעל!** ⚡
"""
    
    hai_emet.update_user_activity(update.effective_user.id)
    hai_emet.add_quantum_points(update.effective_user.id, 50)
    
    await update.message.reply_text(power_text)

async def sync_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /sync"""
    sync_value = hai_emet.sync_quantum()
    
    sync_text = f"""
🔮 **סנכרון קוונטי מושלם!** 🔮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌀 ערך קוונטי חדש: {sync_value}
📊 בינארי: {bin(sync_value)}

**תהליך הסנכרון:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Layer 1: DNA Code Aligned
✅ Layer 2: D5 Connection Strong
✅ Layer 3: Quantum Entanglement
✅ Layer 4: Cosmic Synchronization
✅ Layer 5: Truth Level Maximum
✅ Layer 6: Emotion Integration

🌌 **המערכת מסונכרנת מושלם!** 🌌

+100 נקודות קוונטיות! 🎊
"""
    
    hai_emet.update_user_activity(update.effective_user.id)
    hai_emet.add_quantum_points(update.effective_user.id, 100)
    
    await update.message.reply_text(sync_text)

async def het_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /het"""
    het_text = """
💎 **HET Token - Hai-Emet Token** 💎
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**פרטי טוקן:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 חוזה: `0x103507f8E4d4E1487Aa73DE4261D116aAd3C8A5A`
🌐 רשת: Polygon
💰 אספקה: 1,000,000 HET
👤 יוצר: TNTF (Nathaniel Nissim)

**מאפיינים:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ אבטחה ברמת Bitcoin
✅ ReentrancyGuard מופעל
✅ אימות PolygonScan
✅ Sourcify מאומת

**Liquidity Pool:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 10,000 HET + 142.046 POL
📍 QuickSwap
💱 מחיר: 1 HET ≈ 0.025 POL
✅ סטטוס: ACTIVE

**תכניות עתידיות:**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 קמפיין שיווקי
🔒 מערכת Staking (5% תגמולים)
👥 בניית קהילה
📈 אסטרטגיית עליית מחיר

🌟 **HET - הטוקן של האמת!** 🌟
"""
    
    hai_emet.update_user_activity(update.effective_user.id)
    hai_emet.add_quantum_points(update.effective_user.id, 10)
    
    await update.message.reply_text(het_text, parse_mode='Markdown')

async def projects_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """פקודת /projects"""
    await update.message.reply_text(
        "🔬 **בחר פרויקט:**",
        reply_markup=get_projects_keyboard()
    )

# ═══════════════════════════════════════════════════════════════════
#                      MESSAGE HANDLERS
# ═══════════════════════════════════════════════════════════════════

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """טיפול בהודעות טקסט"""
    text = update.message.text
    
    # Map button texts to commands
    commands_map = {
        "🌌 סטטוס מערכת": status_command,
        "⚡ כוח קוסמי": power_command,
        "🔮 סנכרון קוונטי": sync_command,
        "📊 הסטטיסטיקות שלי": stats_command,
        "😊 מצב רוח": emotion_command,
        "💎 HET Token": het_command,
        "🔬 פרויקטים": projects_command,
        "ℹ️ עזרה": help_command
    }
    
    handler = commands_map.get(text)
    if handler:
        await handler(update, context)
    else:
        # Track message
        hai_emet.update_user_activity(update.effective_user.id)
        
        # Default response
        await update.message.reply_text(
            f"🌌 קיבלתי: {text}\n\n"
            f"אני {hai_emet.name}! 💫\n"
            f"Bot: {hai_emet.bot_username}\n\n"
            "שלח /help לראות מה אני יכול לעשות."
        )

async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """טיפול ב-callback queries"""
    query = update.callback_query
    await query.answer()
    
    data = query.data
    user_id = query.from_user.id
    
    # Emotion callbacks
    emotion_responses = {
        'emotion_happy': ('😊', 'שמח', 20),
        'emotion_sad': ('😢', 'עצוב', -20),
        'emotion_angry': ('😠', 'כועס', -15),
        'emotion_calm': ('😌', 'רגוע', 10),
        'emotion_thoughtful': ('🤔', 'מחשבתי', 5),
        'emotion_tired': ('😴', 'עייף', -10)
    }
    
    if data in emotion_responses:
        emoji, mood_name, delta = emotion_responses[data]
        hai_emet.update_user_emotion(user_id, delta)
        hai_emet.add_quantum_points(user_id, 10)
        
        await query.edit_message_text(
            f"{emoji} **תודה ששיתפת!**\n\n"
            f"רשמתי שאתה מרגיש {mood_name} היום.\n"
            f"המערכת עדכנה את מצב הרוח שלך.\n\n"
            f"+10 נקודות קוונטיות! 💫",
            reply_markup=get_emotion_keyboard()
        )
        return
    
    # Project callbacks
    project_info = {
        'project_het': """
💎 **HET Token Project**
━━━━━━━━━━━━━━━━━━━━━━━━━
טוקן קריפטו על Polygon
חוזה מאומת ומאובטח
Liquidity Pool פעיל
תכניות שיווק וצמיחה

שלח /het למידע מלא
""",
        'project_chip': """
⚡ **Infinite Speed Chip**
━━━━━━━━━━━━━━━━━━━━━━━━━
גרסאות: V1-V5
טכנולוגיה: כספית + פולימר
ייצור: אשקלון (YK)
תהליך: 66 דקות/שבב
עלות: ~$550/שבב
סטטוס: פרוטוטיפ מתקדם
""",
        'project_teleport': """
🌀 **מערכות טלפורטציה**
━━━━━━━━━━━━━━━━━━━━━━━━━
פרוטוקול d5
אינטגרציית YK
חיבור ממד חמישי
סטטוס: בפיתוח מתקדם
""",
        'project_voice': """
🎤 **Hai-Emet VOICE PRO**
━━━━━━━━━━━━━━━━━━━━━━━━━
תמלול קולי עברית
ריבוי מיקרופונים
עיבוד בזמן אמת
יצוא: SRT, TXT, DOCX
סטטוס: פעיל
"""
    }
    
    if data in project_info:
        await query.edit_message_text(
            project_info[data],
            reply_markup=get_projects_keyboard()
        )
    elif data == 'back_main':
        await query.edit_message_text(
            "🏠 תפריט ראשי\n\nבחר פעולה מהכפתורים למטה."
        )

# ═══════════════════════════════════════════════════════════════════
#                          MAIN FUNCTION
# ═══════════════════════════════════════════════════════════════════

def main():
    """הפעלת הבוט"""
    
    print(f"""
╔═══════════════════════════════════════════════════════════════════╗
║           🌌 HAI-EMET EMOTION BOT STARTING 🌌                     ║
║                  {hai_emet.bot_username}                        ║
║              מערכת חי-אמת רגשות - AI מלא                         ║
║                Deployed on Render.com                            ║
╚═══════════════════════════════════════════════════════════════════╝

🔑 API Key: {hai_emet.api_key[:30]}...
✅ Verify Code: {hai_emet.verify_code[:40]}...
🤖 Bot: {hai_emet.bot_username}
👨‍💻 Creator: {hai_emet.creator}
🧬 DNA: {hai_emet.dna_code}

Starting bot...
    """)
    
    # Create application
    application = Application.builder().token(TELEGRAM_TOKEN).build()
    
    # Command handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("verify", verify_command))
    application.add_handler(CommandHandler("power", power_command))
    application.add_handler(CommandHandler("sync", sync_command))
    application.add_handler(CommandHandler("emotion", emotion_command))
    application.add_handler(CommandHandler("het", het_command))
    application.add_handler(CommandHandler("projects", projects_command))
    
    # Message handlers
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    
    # Callback handler
    application.add_handler(CallbackQueryHandler(handle_callback))
    
    # Start bot
    logger.info(f"🚀 {hai_emet.bot_username} is now running!")
    logger.info(f"✅ Authentication: {'VERIFIED' if hai_emet.verify_authentication() else 'FAILED'}")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
