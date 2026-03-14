import { BaseEntity } from './BaseEntity.js';

export class Account extends BaseEntity {
  name: string;
  industry: string | null;
  website: string | null;
  phone: string | null;
  billingAddress: string | null;
  shippingAddress: string | null;

  constructor(props: {
    id: string;
    name: string;
    industry?: string | null;
    website?: string | null;
    phone?: string | null;
    billingAddress?: string | null;
    shippingAddress?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.industry = props.industry ?? null;
    this.website = props.website ?? null;
    this.phone = props.phone ?? null;
    this.billingAddress = props.billingAddress ?? null;
    this.shippingAddress = props.shippingAddress ?? null;
  }
}
