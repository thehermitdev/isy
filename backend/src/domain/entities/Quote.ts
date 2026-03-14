import { BaseEntity } from './BaseEntity.js';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export class Quote extends BaseEntity {
  opportunityId: string | null;
  totalAmount: number;
  status: QuoteStatus;

  constructor(props: {
    id: string;
    opportunityId?: string | null;
    totalAmount?: number;
    status?: QuoteStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.opportunityId = props.opportunityId ?? null;
    this.totalAmount = props.totalAmount ?? 0;
    this.status = props.status ?? 'draft';
  }

  send(): void {
    if (this.status !== 'draft') throw new Error('Only draft quotes can be sent.');
    this.status = 'sent';
    this.touch();
  }

  accept(): void {
    if (this.status !== 'sent') throw new Error('Only sent quotes can be accepted.');
    this.status = 'accepted';
    this.touch();
  }

  reject(): void {
    if (this.status !== 'sent') throw new Error('Only sent quotes can be rejected.');
    this.status = 'rejected';
    this.touch();
  }

  expire(): void {
    if (this.status === 'accepted' || this.status === 'rejected') {
      throw new Error(`Cannot expire a quote that is ${this.status}.`);
    }
    this.status = 'expired';
    this.touch();
  }
}
