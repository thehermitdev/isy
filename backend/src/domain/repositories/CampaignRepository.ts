import type { Campaign } from '../entities/Campaign.js';
import type { Repository } from './Repository.js';

export interface CampaignRepository extends Repository<Campaign> {
  addMember(campaignId: string, memberId: string, type: 'contact' | 'lead'): Promise<void>;
}
