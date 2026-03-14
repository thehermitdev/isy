import { BaseEntity } from './BaseEntity.js';

export class PipelineStage extends BaseEntity {
  name: string;
  probability: number;
  sequence: number;

  constructor(props: {
    id: string;
    name: string;
    probability: number;
    sequence: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(props.id, props.createdAt, props.updatedAt);
    this.name = props.name;
    this.probability = props.probability;
    this.sequence = props.sequence;
  }
}
