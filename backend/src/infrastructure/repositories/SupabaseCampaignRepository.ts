import { supabase } from '../supabase/SupabaseClient.js';
import { Campaign } from '../../domain/entities/Campaign.js';
import type { CampaignRepository } from '../../domain/repositories/CampaignRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type CampaignRow = {
  id: string;
  name: string;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export class SupabaseCampaignRepository extends BaseSupabaseRepository<Campaign, CampaignRow> implements CampaignRepository {
  constructor() {
    super('campaigns');
  }

  protected toEntity(row: CampaignRow): Campaign {
    return new Campaign({
      id: row.id,
      name: row.name,
      budget: row.budget,
      startDate: row.start_date ? new Date(row.start_date) : null,
      endDate: row.end_date ? new Date(row.end_date) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<Campaign>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      name: entity.name,
      budget: entity.budget,
      start_date: entity.startDate ? entity.startDate.toISOString() : null,
      end_date: entity.endDate ? entity.endDate.toISOString() : null,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Campaign>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      name: entity.name,
      budget: entity.budget,
      start_date: entity.startDate ? entity.startDate.toISOString() : null,
      end_date: entity.endDate ? entity.endDate.toISOString() : null,
    };
  }

  override async findAll(): Promise<Campaign[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('name');
    if (error) throw new AppError(error.message);
    return (data as CampaignRow[]).map((row) => this.toEntity(row));
  }

  async addMember(campaignId: string, memberId: string, type: 'contact' | 'lead'): Promise<void> {
    const payload = type === 'contact'
      ? { campaign_id: campaignId, contact_id: memberId }
      : { campaign_id: campaignId, lead_id: memberId };
    const { error } = await supabase.from('campaign_members').insert(payload);
    if (error) throw new AppError(error.message);
  }
}
