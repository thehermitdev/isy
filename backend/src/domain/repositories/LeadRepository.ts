import type { Lead } from '../entities/Lead.js';
import type { Repository } from './Repository.js';

export interface LeadRepository extends Repository<Lead> {
  findByStatus(status: string): Promise<Lead[]>;
}
