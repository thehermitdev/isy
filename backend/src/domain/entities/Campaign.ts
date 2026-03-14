import { BaseEntity } from './BaseEntity.js';

export class Campaign extends BaseEntity {
  name: string;
  budget: number;
  startDate: Date | null;
  endDate: Date | null;

  constructor(props: {
    id: string;
    name: string;
    budget?: number;
    startDate?: Date | null;
    endDate?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.budget = props.budget ?? 0;
    this.startDate = props.startDate ?? null;
    this.endDate = props.endDate ?? null;
  }
}
