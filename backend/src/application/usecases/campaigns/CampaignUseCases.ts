import type { UseCase } from '../UseCase.js';
import type { CampaignRepository } from '../../../domain/repositories/CampaignRepository.js';
import type { Campaign } from '../../../domain/entities/Campaign.js';
import { z } from 'zod';

export const AddMemberSchema = z.object({
  memberId: z.string().uuid(),
  type: z.enum(['contact', 'lead']),
});

export type AddCampaignMemberInput = { campaignId: string } & z.infer<typeof AddMemberSchema>;

export class AddCampaignMember implements UseCase<AddCampaignMemberInput, void> {
  constructor(private readonly campaignRepo: CampaignRepository) {}

  async execute(input: AddCampaignMemberInput): Promise<void> {
    const { memberId, type } = AddMemberSchema.parse(input);
    await this.campaignRepo.addMember(input.campaignId, memberId, type);
  }
}

export class GetCampaigns implements UseCase<void, Campaign[]> {
  constructor(private readonly campaignRepo: CampaignRepository) {}

  async execute(): Promise<Campaign[]> {
    return this.campaignRepo.findAll();
  }
}

export class CreateCampaign implements UseCase<Partial<Campaign>, Campaign> {
  constructor(private readonly campaignRepo: CampaignRepository) {}

  async execute(input: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepo.create(input as unknown as Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>);
  }
}
