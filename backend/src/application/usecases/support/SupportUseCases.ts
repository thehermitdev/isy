import type { UseCase } from '../UseCase.js';
import type { TicketRepository } from '../../../domain/repositories/TicketRepository.js';
import type { SupportTicket } from '../../../domain/entities/SupportTicket.js';
import { z } from 'zod';

export const AddMessageSchema = z.object({
  senderType: z.enum(['agent', 'customer']),
  message: z.string().min(1),
});

export type AddTicketMessageInput = { ticketId: string } & z.infer<typeof AddMessageSchema>;

export class AddTicketMessage implements UseCase<AddTicketMessageInput, void> {
  constructor(private readonly ticketRepo: TicketRepository) {}

  async execute(input: AddTicketMessageInput): Promise<void> {
    const { senderType, message } = AddMessageSchema.parse(input);
    await this.ticketRepo.addMessage(input.ticketId, senderType, message);
  }
}

export class GetTickets implements UseCase<void, SupportTicket[]> {
  constructor(private readonly ticketRepo: TicketRepository) {}

  async execute(): Promise<SupportTicket[]> {
    return this.ticketRepo.findAll();
  }
}

export class CreateTicket implements UseCase<Partial<SupportTicket>, SupportTicket> {
  constructor(private readonly ticketRepo: TicketRepository) {}

  async execute(input: Partial<SupportTicket>): Promise<SupportTicket> {
    return this.ticketRepo.create(input as unknown as Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
