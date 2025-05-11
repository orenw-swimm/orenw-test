import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsModule } from './actions/actions.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'crm.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClientsModule,
    ActionsModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
