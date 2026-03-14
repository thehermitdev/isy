import { supabase } from '../supabase/SupabaseClient.js';
import type { BaseEntity } from '../../domain/entities/BaseEntity.js';
import type { Repository, Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';

export abstract class BaseSupabaseRepository<T extends BaseEntity, TRow> implements Repository<T> {
  constructor(protected readonly tableName: string) {}

  protected abstract toEntity(row: TRow): T;
  protected abstract toRow(entity: Omit<Data<T>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown>;
  protected abstract toUpdateRow(entity: Partial<Omit<Data<T>, 'id' | 'createdAt'>>): Record<string, unknown>;

  async findById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toEntity(data as TRow);
  }

  async findAll(filters?: Record<string, unknown>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      }
    }
    const { data, error } = await query;
    if (error) throw new AppError(error.message);
    return (data as TRow[]).map((row) => this.toEntity(row));
  }

  async create(entity: Omit<Data<T>, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const row = this.toRow(entity);
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(row)
      .select()
      .single();
    if (error) throw new AppError(error.message);
    return this.toEntity(data as TRow);
  }

  async update(id: string, data: Partial<Omit<Data<T>, 'id' | 'createdAt'>>): Promise<T> {
    const row = this.toUpdateRow(data);
    const { data: updated, error } = await supabase
      .from(this.tableName)
      .update(row)
      .eq('id', id)
      .select()
      .single();
    if (error) throw AppError.notFound('Record', id);
    return this.toEntity(updated as TRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', id);
    if (error) throw AppError.notFound('Record', id);
  }
}
