import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { Action } from 'src/clients/entities/action.entity';

// 📁 src/actions/actions.controller.ts
@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('by-client/:clientId') // 👈 יותר בטוח, ברור, ומונע התנגשויות
  findByClient(@Param('clientId') clientId: string): Promise<Action[]> {
    return this.actionsService.findByClientId(clientId);
  }

  @Post()
  create(@Body() body: Partial<Action>): Promise<Action> {
    return this.actionsService.createAction(body);
  }
}
