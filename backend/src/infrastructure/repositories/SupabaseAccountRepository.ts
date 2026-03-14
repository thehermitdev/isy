import { supabase } from '../supabase/SupabaseClient.js';
import { Account } from '../../domain/entities/Account.js';
import type { AccountRepository } from '../../domain/repositories/AccountRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type AccountRow = {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  billing_address: string | null;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
};

export class SupabaseAccountRepository extends BaseSupabaseRepository<Account, AccountRow> implements AccountRepository {
  constructor() {
    super('accounts');
  }

  protected toEntity(row: AccountRow): Account {
    return new Account({
      id: row.id,
      name: row.name,
      industry: row.industry,
      website: row.website,
      phone: row.phone,
      billingAddress: row.billing_address,
      shippingAddress: row.shipping_address,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<Account>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      name: entity.name,
      industry: entity.industry,
      website: entity.website,
      phone: entity.phone,
      billing_address: entity.billingAddress,
      shipping_address: entity.shippingAddress,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Account>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      name: entity.name,
      industry: entity.industry,
      website: entity.website,
      phone: entity.phone,
      billing_address: entity.billingAddress,
      shipping_address: entity.shippingAddress,
    };
  }

  override async findAll(): Promise<Account[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('name');
    if (error) throw new AppError(error.message);
    return (data as AccountRow[]).map((r) => this.toEntity(r));
  }

  async findByName(name: string): Promise<Account[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .ilike('name', `%${name}%`);
    if (error) throw new AppError(error.message);
    return (data as AccountRow[]).map(r => this.toEntity(r));
  }
}
