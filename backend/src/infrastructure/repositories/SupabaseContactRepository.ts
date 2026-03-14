import { supabase } from '../supabase/SupabaseClient.js';
import { Contact } from '../../domain/entities/Contact.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type ContactRow = {
  id: string; first_name: string; last_name: string; email: string | null;
  phone: string | null; job_title: string | null; account_id: string | null;
  created_at: string; updated_at: string;
};

export class SupabaseContactRepository extends BaseSupabaseRepository<Contact, ContactRow> {
  constructor() {
    super('contacts');
  }

  protected toEntity(row: ContactRow): Contact {
    return new Contact({
      id: row.id, firstName: row.first_name, lastName: row.last_name,
      email: row.email, phone: row.phone, jobTitle: row.job_title, accountId: row.account_id,
      createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<Contact>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      first_name: entity.firstName,
      last_name: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      job_title: entity.jobTitle,
      account_id: entity.accountId,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Contact>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      first_name: entity.firstName,
      last_name: entity.lastName,
      email: entity.email,
      phone: entity.phone,
      job_title: entity.jobTitle,
      account_id: entity.accountId,
    };
  }

  override async findAll(): Promise<Contact[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('created_at', { ascending: false });
    if (error) throw new AppError(error.message);
    return (data as ContactRow[]).map((r) => this.toEntity(r));
  }
}
