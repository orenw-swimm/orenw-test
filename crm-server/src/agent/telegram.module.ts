import { Module, OnModuleInit } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { TelegramService } from './telegram.service';

@Module({
  imports: [ClientsModule],
  providers: [TelegramService],
})
export class TelegramModule implements OnModuleInit {
  constructor(private readonly telegramService: TelegramService) {}

  onModuleInit() {
    this.telegramService.init();
  }
}
