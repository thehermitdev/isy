import type { SupportTicket } from '../entities/SupportTicket.js';
import type { Repository } from './Repository.js';

export interface TicketRepository extends Repository<SupportTicket> {
  addMessage(ticketId: string, senderType: string, message: string): Promise<void>;
  findMessages(ticketId: string): Promise<Array<{ id: string; senderType: string; message: string; createdAt: Date }>>;
}
