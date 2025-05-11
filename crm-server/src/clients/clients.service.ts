import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client, ClientStatus } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,

    @InjectRepository(Action)
    private actionRepository: Repository<Action>, // ← הוסף את זה
  ) {}

  async createMockLead(data: Partial<Client>): Promise<Client> {
    const client = this.clientRepo.create({
      ...data,
      status: ClientStatus.NEW,
    });
    return this.clientRepo.save(client);
  }

  async findAll(): Promise<Client[]> {
    return this.clientRepo.find();
  }

  async updateStatus(id: string, status: ClientStatus): Promise<Client> {
    const client = await this.clientRepo.findOneByOrFail({ id });
    client.status = status;
    return this.clientRepo.save(client);
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepo.delete(id);
  }

  async createClientAction(data: {
    clientId: string;
    description: string;
    createdBy: string;
  }) {
    const action = this.actionRepository.create({
      client: { id: data.clientId },
      description: data.description,
      createdBy: data.createdBy,
    });
    return this.actionRepository.save(action);
  }
}
