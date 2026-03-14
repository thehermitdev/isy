import { BaseEntity } from './BaseEntity.js';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'disqualified' | 'converted';
export type LeadSource = 'web' | 'referral' | 'event' | 'email' | 'cold_call' | 'other';

export class Lead extends BaseEntity {
  name: string;
  email: string | null;
  company: string | null;
  source: LeadSource | null;
  status: LeadStatus;
  assignedUserId: string | null;

  constructor(props: {
    id: string;
    name: string;
    email?: string | null;
    company?: string | null;
    source?: LeadSource | null;
    status?: LeadStatus;
    assignedUserId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.email = props.email ?? null;
    this.company = props.company ?? null;
    this.source = props.source ?? null;
    this.status = props.status ?? 'new';
    this.assignedUserId = props.assignedUserId ?? null;
  }

  qualify(): void {
    if (this.status === 'disqualified' || this.status === 'converted') {
      throw new Error(`Cannot qualify lead in status ${this.status}`);
    }
    this.status = 'qualified';
    this.touch();
  }

  disqualify(): void {
    if (this.status === 'converted') {
      throw new Error('Cannot disqualify a converted lead');
    }
    this.status = 'disqualified';
    this.touch();
  }

  convert(): void {
    if (this.status !== 'qualified') {
      throw new Error('Only qualified leads can be converted');
    }
    this.status = 'converted';
    this.touch();
  }
}
