import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class LegalAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async analyzeText(text: string): Promise<{
    domain: string;
    summary: string;
    relevant: boolean;
  }> {
    const prompt = `
לקוח פנה לעורך דין עם הפנייה הבאה:

"${text}"

ענה על השאלות הבאות:
1. סווג את התחום המשפטי (לדוגמה: דיני עבודה, מקרקעין, משפחה וכו')
2. האם מדובר במקרה רלוונטי לטיפול במשרד עורכי דין? (כן/לא)
3. נסח תקציר פורמלי של הפנייה כאילו נכתבה ע"י עורך דין

החזר תשובה בפורמט JSON:
{
  "domain": "",
  "relevant": true/false,
  "summary": ""
}
`;


    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const jsonText = response.choices[0].message?.content || '{}';
    return JSON.parse(jsonText);
  }
}
