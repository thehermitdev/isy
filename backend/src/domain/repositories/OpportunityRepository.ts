import type { Opportunity } from '../entities/Opportunity.js';
import type { Repository } from './Repository.js';

export interface OpportunityRepository extends Repository<Opportunity> {
  findByStage(stageId: string): Promise<Opportunity[]>;
  findByAccount(accountId: string): Promise<Opportunity[]>;
}
