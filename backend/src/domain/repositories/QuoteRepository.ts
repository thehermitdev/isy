import type { Quote } from '../entities/Quote.js';
import type { Repository } from './Repository.js';

export interface QuoteRepository extends Repository<Quote> {
  findByOpportunity(opportunityId: string): Promise<Quote[]>;
}
