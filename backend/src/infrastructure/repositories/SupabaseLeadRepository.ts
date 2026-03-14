import { supabase } from '../supabase/SupabaseClient.js';
import { Lead } from '../../domain/entities/Lead.js';
import type { LeadRepository } from '../../domain/repositories/LeadRepository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type LeadRow = {
  id: string; name: string; email: string | null; company: string | null;
  source: string | null; status: string; assigned_user_id: string | null;
  created_at: string; updated_at: string;
};

export class SupabaseLeadRepository extends BaseSupabaseRepository<Lead, LeadRow> implements LeadRepository {
  constructor() {
    super('leads');
  }

  protected toEntity(row: LeadRow): Lead {
    return new Lead({
      id: row.id, name: row.name, email: row.email, company: row.company,
      source: row.source as Lead['source'], status: row.status as Lead['status'],
      assignedUserId: row.assigned_user_id,
      createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'touch' | 'equals'>): Record<string, unknown> {
    return {
      name: entity.name, email: entity.email, company: entity.company,
      source: entity.source, status: entity.status, assigned_user_id: entity.assignedUserId,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Lead, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      name: entity.name, email: entity.email, company: entity.company,
      source: entity.source, status: entity.status, assigned_user_id: entity.assignedUserId,
    };
  }

  override async findAll(): Promise<Lead[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('created_at', { ascending: false });
    if (error) throw new AppError(error.message);
    return (data as LeadRow[]).map((row) => this.toEntity(row));
  }

  async findByStatus(status: string): Promise<Lead[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('status', status);
    if (error) throw new AppError(error.message);
    return (data as LeadRow[]).map(r => this.toEntity(r));
  }
}
