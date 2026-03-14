import type { UseCase } from '../UseCase.js';
import type { OpportunityRepository } from '../../../domain/repositories/OpportunityRepository.js';
import type { PipelineStageRepository } from '../../../domain/repositories/PipelineStageRepository.js';
import type { Opportunity } from '../../../domain/entities/Opportunity.js';
import type { PipelineStage } from '../../../domain/entities/PipelineStage.js';
import { z } from 'zod';

export const CreateOpportunitySchema = z.object({
  name: z.string().min(1),
  accountId: z.string().uuid().optional().nullable(),
  contactId: z.string().uuid().optional().nullable(),
  stageId: z.string().uuid().optional().nullable(),
  value: z.number().min(0).default(0),
  expectedClose: z.string().optional().nullable(),
  probability: z.number().min(0).max(100).default(0),
  ownerId: z.string().uuid().optional().nullable(),
});

export type CreateOpportunityInput = z.infer<typeof CreateOpportunitySchema>;

export type PipelineBoardOutput = Record<string, { stage: PipelineStage; opportunities: Opportunity[] }>;

export class GetPipeline implements UseCase<void, PipelineBoardOutput> {
  constructor(
    private readonly opportunityRepo: OpportunityRepository,
    private readonly stageRepo: PipelineStageRepository
  ) {}

  async execute(): Promise<PipelineBoardOutput> {
    const [stages, opportunities] = await Promise.all([
      this.stageRepo.findAllOrdered(),
      this.opportunityRepo.findAll(),
    ]);

    const board: PipelineBoardOutput = {};
    for (const stage of stages) {
      board[stage.id as string] = {
        stage,
        opportunities: opportunities.filter((o) => o.stageId === stage.id),
      };
    }

    return board;
  }
}

export class CreateOpportunity implements UseCase<CreateOpportunityInput, Opportunity> {
  constructor(private readonly opportunityRepo: OpportunityRepository) {}

  async execute(input: CreateOpportunityInput): Promise<Opportunity> {
    const validated = CreateOpportunitySchema.parse(input);
    return this.opportunityRepo.create({
      ...validated,
      expectedClose: validated.expectedClose ? new Date(validated.expectedClose) : null,
    } as unknown as Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>);
  }
}

export class UpdateOpportunity implements UseCase<{ id: string } & Partial<CreateOpportunityInput>, Opportunity> {
  constructor(private readonly opportunityRepo: OpportunityRepository) {}

  async execute(input: { id: string } & Partial<CreateOpportunityInput>): Promise<Opportunity> {
    const { id, ...data } = input;
    
    // Ensure dates are parsed
    const updateData: any = { ...data };
    if (updateData.expectedClose) {
      updateData.expectedClose = new Date(updateData.expectedClose);
    }
    
    return this.opportunityRepo.update(id, updateData);
  }
}

export class GetOpportunities implements UseCase<void, Opportunity[]> {
  constructor(private readonly opportunityRepo: OpportunityRepository) {}

  async execute(): Promise<Opportunity[]> {
    return this.opportunityRepo.findAll();
  }
}
