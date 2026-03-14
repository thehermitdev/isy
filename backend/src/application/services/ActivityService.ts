import type { ActivityRepository } from '../../domain/repositories/ActivityRepository.js';
import type { Activity } from '../../domain/entities/Activity.js';
import type { Data } from '../../domain/repositories/Repository.js';
import { SupabaseActivityRepository } from '../../infrastructure/repositories/SupabaseActivityRepository.js';

export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getAllActivities(): Promise<Activity[]> {
    return this.activityRepository.findAll();
  }

  async getActivityById(id: string): Promise<Activity | null> {
    return this.activityRepository.findById(id);
  }

  async createActivity(activityData: Omit<Data<Activity>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> {
    return this.activityRepository.create(activityData);
  }

  async updateActivity(id: string, activityData: Partial<Omit<Data<Activity>, 'id' | 'createdAt'>>): Promise<Activity> {
    return this.activityRepository.update(id, activityData);
  }

  async deleteActivity(id: string): Promise<void> {
    await this.activityRepository.delete(id);
  }
}

export const activityService = new ActivityService(new SupabaseActivityRepository());
