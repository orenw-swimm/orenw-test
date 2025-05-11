import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { TelegramModule } from './telegram.module';

@Module({
  imports: [ClientsModule, TelegramModule],
  providers: [],
  exports: [],
})
export class AgentModule {}
