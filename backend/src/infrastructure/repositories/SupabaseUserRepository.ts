import { supabase } from '../supabase/SupabaseClient.js';
import { User } from '../../domain/entities/User.js';
import type { UserRepository } from '../../domain/repositories/UserRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
};

export class SupabaseUserRepository extends BaseSupabaseRepository<User, UserRow> implements UserRepository {
  constructor() {
    super('users');
  }

  protected toEntity(row: UserRow): User {
    return new User(
      row.id,
      row.name,
      row.email,
      row.role as User['role'],
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  protected toRow(entity: Omit<Data<User>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<User>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      name: entity.name,
      email: entity.email,
      role: entity.role,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('email', email)
      .single();
    if (error) return null;
    return this.toEntity(data as UserRow);
  }

  override async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('name');
    if (error) throw new AppError(error.message);
    return (data as UserRow[]).map(r => this.toEntity(r));
  }
}
