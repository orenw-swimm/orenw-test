import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client, ClientStatus } from './entities/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post('mock-lead')
  createMockLead(@Body() body: Partial<Client>): Promise<Client> {
    return this.clientsService.createMockLead(body);
  }

  @Get()
  getAll(): Promise<Client[]> {
    return this.clientsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: ClientStatus,
  ): Promise<Client> {
    return this.clientsService.updateStatus(id, status);
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string): Promise<void> {
    return this.clientsService.deleteClient(id);
  }
}
