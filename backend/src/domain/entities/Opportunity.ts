import { BaseEntity } from './BaseEntity.js';

export class Opportunity extends BaseEntity {
  name: string;
  accountId: string | null;
  contactId: string | null;
  stageId: string | null;
  value: number;
  expectedClose: Date | null;
  probability: number;
  ownerId: string | null;

  constructor(props: {
    id: string;
    name: string;
    accountId?: string | null;
    contactId?: string | null;
    stageId?: string | null;
    value?: number;
    expectedClose?: Date | null;
    probability?: number;
    ownerId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.accountId = props.accountId ?? null;
    this.contactId = props.contactId ?? null;
    this.stageId = props.stageId ?? null;
    this.value = props.value ?? 0;
    this.expectedClose = props.expectedClose ?? null;
    this.probability = props.probability ?? 0;
    this.ownerId = props.ownerId ?? null;
  }

  win(closedWonStageId: string): void {
    this.stageId = closedWonStageId;
    this.probability = 100;
    this.expectedClose = new Date();
    this.touch();
  }

  lose(closedLostStageId: string): void {
    this.stageId = closedLostStageId;
    this.probability = 0;
    this.expectedClose = new Date();
    this.touch();
  }
}
