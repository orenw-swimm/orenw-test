import { Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { OpenAiModule } from '../openai/openai.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [ClientsModule, OpenAiModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class AgentModule implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  onModuleInit() {
    this.telegramService.init();
  }
}
