import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: typeof TelegramBot;
  private formStates = new Map<
    number,
    { step: number; name?: string; phone?: string; email?: string }
  >();

  constructor(private readonly clientsService: ClientsService) {}

  init() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.warn('TELEGRAM_BOT_TOKEN not defined');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text || '';

      // התחלה מחדש או הודעה ראשונה
      if (text === '/start' || !this.formStates.has(chatId)) {
        const introMessage = `👋 שלום וברוך הבא!
      אני כאן כדי לעזור לך 🙂
      הנה סרטון קצר שמסביר על השירות שלנו:`;

        await this.bot.sendMessage(chatId, introMessage);

        await new Promise((resolve) => setTimeout(resolve, 2000));
        const videoUrl =
          'https://crm-intro-videos.s3.us-east-1.amazonaws.com/intro.mp4';
        await this.bot.sendVideo(chatId, videoUrl);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        this.formStates.set(chatId, { step: 1 });
        await this.bot.sendMessage(
          chatId,
          '👋 נשמח שתאיר פרטים על מנת שנוכל ליצור קשר, איך קוראים לך?',
        );
        return;
      }

      const state = this.formStates.get(chatId)!;

      if (state.step === 1) {
        state.name = text;
        state.step = 2;
        this.bot.sendMessage(chatId, '📞 מה מספר הטלפון שלך?');
      } else if (state.step === 2) {
        const phoneMatch = text.match(/\d{9,10}/);
        if (!phoneMatch) {
          this.bot.sendMessage(chatId, '📛 מספר טלפון לא תקין, נסה שוב');
          return;
        }
        state.phone = phoneMatch[0];
        state.step = 3;
        this.bot.sendMessage(chatId, '📧 מה כתובת האימייל שלך?');
      } else if (state.step === 3) {
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/);
        if (!emailMatch) {
          this.bot.sendMessage(chatId, '📛 אימייל לא תקין, נסה שוב');
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

        this.bot.sendMessage(
          chatId,
          '✅ תודה! הפרטים נשמרו בהצלחה, ניצור איתך קשר בהמשך.',
        );

        await this.clientsService.createClientAction({
          clientId: created.id,
          description: 'ליד נוצר דרך בוט טלגרם',
          createdBy: 'Telegram Bot',
        });

        this.formStates.delete(chatId);
      }
    });
  }
}
