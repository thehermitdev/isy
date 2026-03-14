import { supabase } from '../supabase/SupabaseClient.js';
import { Quote } from '../../domain/entities/Quote.js';
import type { QuoteRepository } from '../../domain/repositories/QuoteRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type QuoteRow = {
  id: string;
  opportunity_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
};

type QuoteItemInsert = {
  quoteId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
};

export class SupabaseQuoteRepository extends BaseSupabaseRepository<Quote, QuoteRow> implements QuoteRepository {
  constructor() {
    super('quotes');
  }

  protected toEntity(row: QuoteRow): Quote {
    return new Quote({
      id: row.id,
      opportunityId: row.opportunity_id,
      totalAmount: row.total_amount,
      status: row.status as Quote['status'],
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<Quote>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return { opportunity_id: entity.opportunityId, total_amount: entity.totalAmount, status: entity.status };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Quote>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return { opportunity_id: entity.opportunityId, total_amount: entity.totalAmount, status: entity.status };
  }

  override async findAll(): Promise<Quote[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('created_at', { ascending: false });
    if (error) throw new AppError(error.message);
    return (data as QuoteRow[]).map(r => this.toEntity(r));
  }

  async findByOpportunity(opportunityId: string): Promise<Quote[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('opportunity_id', opportunityId);
    if (error) throw new AppError(error.message);
    return (data as QuoteRow[]).map(r => this.toEntity(r));
  }

  async addItems(items: QuoteItemInsert[]): Promise<void> {
    const { error } = await supabase.from('quote_items').insert(
      items.map((i) => ({
        quote_id: i.quoteId,
        product_id: i.productId,
        quantity: i.quantity,
        unit_price: i.unitPrice,
      }))
    );
    if (error) throw new AppError(error.message);
  }
}
