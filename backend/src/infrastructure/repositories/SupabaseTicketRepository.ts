import { supabase } from '../supabase/SupabaseClient.js';
import { SupportTicket } from '../../domain/entities/SupportTicket.js';
import type { TicketRepository } from '../../domain/repositories/TicketRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type TicketRow = {
  id: string;
  account_id: string | null;
  contact_id: string | null;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
};

export class SupabaseTicketRepository extends BaseSupabaseRepository<SupportTicket, TicketRow> implements TicketRepository {
  constructor() {
    super('support_tickets');
  }

  protected toEntity(row: TicketRow): SupportTicket {
    return new SupportTicket({
      id: row.id,
      accountId: row.account_id,
      contactId: row.contact_id,
      subject: row.subject,
      status: row.status as SupportTicket['status'],
      priority: row.priority as SupportTicket['priority'],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<SupportTicket>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return { account_id: entity.accountId, contact_id: entity.contactId, subject: entity.subject, status: entity.status, priority: entity.priority };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<SupportTicket>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return { account_id: entity.accountId, contact_id: entity.contactId, subject: entity.subject, status: entity.status, priority: entity.priority };
  }

  override async findAll(): Promise<SupportTicket[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('created_at', { ascending: false });
    if (error) throw new AppError(error.message);
    return (data as TicketRow[]).map(r => this.toEntity(r));
  }

  async addMessage(ticketId: string, senderType: string, message: string): Promise<void> {
    const { error } = await supabase.from('ticket_messages').insert({ ticket_id: ticketId, sender_type: senderType, message });
    if (error) throw new AppError(error.message);
  }

  async findMessages(ticketId: string): Promise<Array<{ id: string; senderType: string; message: string; createdAt: Date }>> {
    const { data, error } = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at');
    if (error) throw new AppError(error.message);
    return (data as Array<{ id: string; sender_type: string; message: string; created_at: string }>).map((m) => ({
      id: m.id,
      senderType: m.sender_type,
      message: m.message,
      createdAt: new Date(m.created_at),
    }));
  }
}
