import { supabase } from '../supabase/SupabaseClient.js';
import { Activity } from '../../domain/entities/Activity.js';
import type { ActivityRepository } from '../../domain/repositories/ActivityRepository.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { BaseSupabaseRepository } from './BaseSupabaseRepository.js';

type ActivityRow = {
  id: string;
  type: string;
  subject: string;
  account_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  user_id?: string;
  activity_date: string;
  created_at: string;
  updated_at: string;
};

export class SupabaseActivityRepository extends BaseSupabaseRepository<Activity, ActivityRow> implements ActivityRepository {
  constructor() {
    super('activities');
  }

  protected toEntity(row: ActivityRow): Activity {
    return new Activity(
      row.id,
      row.type,
      row.subject,
      row.account_id || undefined,
      row.contact_id || undefined,
      row.opportunity_id || undefined,
      row.user_id || undefined,
      new Date(row.activity_date),
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  protected toRow(entity: Omit<Data<Activity>, 'id' | 'createdAt' | 'updatedAt'>): Record<string, unknown> {
    return {
      type: entity.type,
      subject: entity.subject,
      account_id: entity.accountId || null,
      contact_id: entity.contactId || null,
      opportunity_id: entity.opportunityId || null,
      user_id: entity.userId || null,
      activity_date: entity.activityDate.toISOString(),
    };
  }

  protected toUpdateRow(entity: Partial<Omit<Data<Activity>, 'id' | 'createdAt'>>): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    if (entity.type !== undefined) row.type = entity.type;
    if (entity.subject !== undefined) row.subject = entity.subject;
    if (entity.accountId !== undefined) row.account_id = entity.accountId || null;
    if (entity.contactId !== undefined) row.contact_id = entity.contactId || null;
    if (entity.opportunityId !== undefined) row.opportunity_id = entity.opportunityId || null;
    if (entity.userId !== undefined) row.user_id = entity.userId || null;
    if (entity.activityDate !== undefined) row.activity_date = entity.activityDate.toISOString();
    return row;
  }
}
