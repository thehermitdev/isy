import { supabase } from '../supabase/SupabaseClient.js';
import { Product } from '../../domain/entities/Product.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type ProductRow = {
  id: string; name: string; sku: string | null; base_price: number;
  created_at: string; updated_at: string;
};

export class SupabaseProductRepository extends BaseSupabaseRepository<Product, ProductRow> {
  constructor() {
    super('products');
  }

  protected toEntity(row: ProductRow): Product {
    return new Product({ id: row.id, name: row.name, sku: row.sku, basePrice: row.base_price,
      createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) });
  }

  protected toRow(entity: Omit<Data<Product>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return { name: entity.name, sku: entity.sku ?? null, base_price: entity.basePrice ?? 0 };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Product>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return { name: entity.name, sku: entity.sku, base_price: entity.basePrice };
  }

  override async findAll(): Promise<Product[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('name');
    if (error) throw new AppError(error.message);
    return (data as ProductRow[]).map(r => this.toEntity(r));
  }
}
