import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action } from 'src/clients/entities/action.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepo: Repository<Action>,
  ) {}

  async findByClientId(clientId: string): Promise<Action[]> {
    return this.actionRepo.find({
      where: { client: { id: clientId } },
      order: { createdAt: 'DESC' },
    });
  }

  async createAction(data: Partial<Action>): Promise<Action> {
    const action = this.actionRepo.create(data);
    return this.actionRepo.save(action);
  }
}
