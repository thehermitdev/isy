import { BaseEntity } from './BaseEntity.js';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export class SupportTicket extends BaseEntity {
  accountId: string | null;
  contactId: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;

  constructor(props: {
    id: string;
    accountId?: string | null;
    contactId?: string | null;
    subject: string;
    status?: TicketStatus;
    priority?: TicketPriority;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.accountId = props.accountId ?? null;
    this.contactId = props.contactId ?? null;
    this.subject = props.subject;
    this.status = props.status ?? 'open';
    this.priority = props.priority ?? 'medium';
  }

  resolve(): void {
    if (this.status === 'closed') throw new Error('Cannot resolve a closed ticket.');
    this.status = 'resolved';
    this.touch();
  }

  close(): void {
    this.status = 'closed';
    this.touch();
  }

  escalate(): void {
    if (this.status === 'closed' || this.status === 'resolved') {
      throw new Error(`Cannot escalate ticket in ${this.status} status.`);
    }
    if (this.priority === 'low') this.priority = 'medium';
    else if (this.priority === 'medium') this.priority = 'high';
    else if (this.priority === 'high') this.priority = 'urgent';
    this.touch();
  }
}
