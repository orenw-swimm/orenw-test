import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenAiService {
  private readonly client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('❌ חסר OPENAI_API_KEY בקובץ .env');
    }

    this.client = new OpenAI({ apiKey });
  }

  /**
   * מחזיר הודעת פתיחה קבועה אחרי השארת פרטים
   */
  async personalizeMessage(data: { name: string }): Promise<string> {
    return `🤖 שלום ${data.name}, תודה שפנית אלינו!
נשמח לעמוד לרשותך עד שנחזור אליך.
תוכל לשאול כאן כל שאלה ולקבל מענה מיידי מהסוכן החכם שלנו.

בברכה,
צוות CRM לעורכי דין`;
  }

  /**
   * שולח שאלה של המשתמש ל־GPT ומחזיר תשובה
   */
  async chatWithAi(userMessage: string): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'אתה סוכן חכם של מערכת CRM לעורכי דין. ענה בקצרה, בצורה מקצועית, בעברית, בגובה העיניים.',
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
      });

      return (
        completion.choices[0]?.message?.content ||
        '🤖 תודה על פנייתך. ננסה להשיב לך בהמשך.'
      );
    } catch (error: any) {
      if (error.code === 'insufficient_quota') {
        return '❌ אין כרגע קרדיט לשלוח תשובה מ־GPT. נסה שוב מאוחר יותר.';
      }

      console.error('OpenAI error:', error);
      return '❌ אירעה שגיאה. ננסה שוב מאוחר יותר.';
    }
  }
}
