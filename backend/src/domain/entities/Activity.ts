import { BaseEntity } from './BaseEntity.js';

export class Activity extends BaseEntity {
  constructor(
    id: string,
    public readonly type: string,
    public readonly subject: string,
    public readonly accountId?: string,
    public readonly contactId?: string,
    public readonly opportunityId?: string,
    public readonly userId?: string,
    public readonly activityDate: Date = new Date(),
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
  }
}
