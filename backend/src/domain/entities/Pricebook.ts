import { BaseEntity } from './BaseEntity.js';

export class Pricebook extends BaseEntity {
  name: string;
  currency: string;

  constructor(props: {
    id: string;
    name: string;
    currency?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.currency = props.currency ?? 'USD';
  }
}
