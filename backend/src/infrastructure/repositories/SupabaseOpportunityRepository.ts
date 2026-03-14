import { supabase } from '../supabase/SupabaseClient.js';
import { Opportunity } from '../../domain/entities/Opportunity.js';
import type { OpportunityRepository } from '../../domain/repositories/OpportunityRepository.js';
import { PipelineStage } from '../../domain/entities/PipelineStage.js';
import type { PipelineStageRepository } from '../../domain/repositories/PipelineStageRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { AppError } from '../../core/errors/AppError.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type OpportunityRow = {
  id: string;
  name: string;
  account_id: string | null;
  contact_id: string | null;
  stage_id: string | null;
  value: number;
  expected_close: string | null;
  probability: number;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
};

export class SupabaseOpportunityRepository extends BaseSupabaseRepository<Opportunity, OpportunityRow> implements OpportunityRepository {
  constructor() {
    super('opportunities');
  }

  protected toEntity(row: OpportunityRow): Opportunity {
    return new Opportunity({
      id: row.id,
      name: row.name,
      accountId: row.account_id,
      contactId: row.contact_id,
      stageId: row.stage_id,
      value: row.value,
      expectedClose: row.expected_close ? new Date(row.expected_close) : null,
      probability: row.probability,
      ownerId: row.owner_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  protected toRow(entity: Omit<Data<Opportunity>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      name: entity.name,
      account_id: entity.accountId,
      contact_id: entity.contactId,
      stage_id: entity.stageId,
      value: entity.value,
      expected_close: entity.expectedClose ? entity.expectedClose.toISOString() : null,
      probability: entity.probability,
      owner_id: entity.ownerId,
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Opportunity>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return {
      name: entity.name,
      account_id: entity.accountId,
      contact_id: entity.contactId,
      stage_id: entity.stageId,
      value: entity.value,
      expected_close: entity.expectedClose ? entity.expectedClose.toISOString() : null,
      probability: entity.probability,
      owner_id: entity.ownerId,
    };
  }

  override async findAll(): Promise<Opportunity[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('created_at', { ascending: false });
    if (error) throw new AppError(error.message);
    return (data as OpportunityRow[]).map(r => this.toEntity(r));
  }

  async findByStage(stageId: string): Promise<Opportunity[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('stage_id', stageId);
    if (error) throw new AppError(error.message);
    return (data as OpportunityRow[]).map(r => this.toEntity(r));
  }

  async findByAccount(accountId: string): Promise<Opportunity[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').eq('account_id', accountId);
    if (error) throw new AppError(error.message);
    return (data as OpportunityRow[]).map(r => this.toEntity(r));
  }
}

type StageRow = {
  id: string;
  name: string;
  probability: number;
  sequence: number;
  created_at: string;
  updated_at: string;
};

export class SupabasePipelineStageRepository extends BaseSupabaseRepository<PipelineStage, StageRow> implements PipelineStageRepository {
  constructor() {
    super('pipeline_stages');
  }

  protected toEntity(row: StageRow): PipelineStage {
    return new PipelineStage({ id: row.id, name: row.name, probability: row.probability, sequence: row.sequence, createdAt: new Date(row.created_at), updatedAt: new Date(row.updated_at) });
  }

  protected toRow(entity: Omit<Data<PipelineStage>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return { name: entity.name, probability: entity.probability, sequence: entity.sequence };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<PipelineStage>, 'id' | 'createdAt'>>): Record<string, unknown> {
    return { name: entity.name, probability: entity.probability, sequence: entity.sequence };
  }

  override async findAll(): Promise<PipelineStage[]> {
    return this.findAllOrdered();
  }

  async findAllOrdered(): Promise<PipelineStage[]> {
    const { data, error } = await supabase.from(this.tableName).select('*').order('sequence');
    if (error) throw new AppError(error.message);
    return (data as StageRow[]).map(r => this.toEntity(r));
  }
}
