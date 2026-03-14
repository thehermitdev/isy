import { BaseEntity } from './BaseEntity.js';

export class Product extends BaseEntity {
  name: string;
  sku: string | null;
  basePrice: number;

  constructor(props: {
    id: string;
    name: string;
    sku?: string | null;
    basePrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.sku = props.sku ?? null;
    this.basePrice = props.basePrice ?? 0;
  }
}
