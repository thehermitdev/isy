import type { PipelineStage } from '../entities/PipelineStage.js';
import type { Repository } from './Repository.js';

export interface PipelineStageRepository extends Repository<PipelineStage> {
  findAllOrdered(): Promise<PipelineStage[]>;
}
