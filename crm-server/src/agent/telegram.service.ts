import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { OpenAiService } from '../openai/openai.service';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  private formStates = new Map<
    number,
    {
      step: number;
      name?: string;
      phone?: string;
      email?: string;
      mode?: 'form' | 'chat';
      timeout?: NodeJS.Timeout;
    }
  >();

  constructor(
    private readonly clientsService: ClientsService,
    private readonly openAiService: OpenAiService,
  ) {}

  init() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN לא מוגדר ב־.env');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text?.trim() || '';
      const state = this.formStates.get(chatId);

      // התחלה מחדש
      if (text === '/start' || !state) {
        await this.handleStart(chatId);
        return;
      }

      // 🧠 מצב שיחה פתוחה עם GPT
      if (state.mode === 'chat') {
        clearTimeout(state.timeout);

        const aiReply = await this.openAiService.chatWithAi(text);

        await this.bot.sendMessage(chatId, `🤖 ${aiReply}`);

        // סט טיימר ל־1 דקה
        state.timeout = setTimeout(() => {
          this.bot.sendMessage(chatId, '⌛ השיחה הסתיימה עקב חוסר פעילות.');
          this.formStates.delete(chatId);
        }, 60_000);

        return;
      }

      // 📝 מילוי טופס
      switch (state.step) {
        case 1:
          state.name = text;
          state.step = 2;
          await this.bot.sendMessage(chatId, '📞 מה מספר הטלפון שלך?');
          break;

        case 2:
          const phoneMatch = text.match(/\d{9,10}/);
          if (!phoneMatch) {
            await this.bot.sendMessage(
              chatId,
              '📛 מספר טלפון לא תקין, נסה שוב',
            );
            return;
          }
          state.phone = phoneMatch[0];
          state.step = 3;
          await this.bot.sendMessage(chatId, '📧 מה כתובת האימייל שלך?');
          break;

        case 3:
          const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/);
          if (!emailMatch) {
            await this.bot.sendMessage(chatId, '📛 אימייל לא תקין, נסה שוב');
            return;
          }
          state.email = emailMatch[0];

          const telegramLink = msg.from?.username
            ? `https://t.me/${msg.from.username}`
            : 'לא ידוע';

          const created = await this.clientsService.createMockLead({
            name: state.name!,
            phone: state.phone!,
            email: state.email!,
            source: `טלגרם (${telegramLink})`,
          });

          await this.clientsService.createClientAction({
            clientId: created.id,
            description: 'ליד נוצר דרך בוט טלגרם',
            createdBy: 'Telegram Bot',
          });

          await this.bot.sendMessage(
            chatId,
            '✅ תודה! הפרטים נשמרו בהצלחה, ניצור איתך קשר בהמשך.',
          );

          // 🤖 ברכת פתיחה אישית
          const aiMessage = await this.openAiService.personalizeMessage({
            name: state.name!,
          });

          await this.bot.sendMessage(chatId, `🤖 ${aiMessage}`);

          // מעבר לשיחה פתוחה
          state.mode = 'chat';

          // טיימר לשיחה פתוחה
          state.timeout = setTimeout(() => {
            this.bot.sendMessage(chatId, '⌛ השיחה הסתיימה עקב חוסר פעילות.');
            this.formStates.delete(chatId);
          }, 90_000);

          break;
      }
    });
  }

  private async handleStart(chatId: number) {
    const introMessage = `👋 שלום וברוך הבא!
אני כאן כדי לעזור לך 🙂
הנה סרטון קצר שמסביר על השירות שלנו:`;

    await this.bot.sendMessage(chatId, introMessage);

    await new Promise((r) => setTimeout(r, 2000));
    const videoUrl =
      'https://crm-intro-videos.s3.us-east-1.amazonaws.com/intro.mp4';
    await this.bot.sendVideo(chatId, videoUrl);

    await new Promise((r) => setTimeout(r, 3000));
    this.formStates.set(chatId, { step: 1, mode: 'form' });

    await this.bot.sendMessage(
      chatId,
      '👋 נשמח שתשאיר פרטים על מנת שנוכל ליצור קשר, איך קוראים לך?',
    );
  }
}
