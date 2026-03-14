import { get, post } from './api';
import type {
  Campaign,
  CreateCampaignPayload,
  AddCampaignMemberPayload,
} from '@/types';

export const campaignService = {
  getAll: () => get<Campaign[]>('/campaigns'),
  create: (data: CreateCampaignPayload) => post<Campaign>('/campaigns', data),
  addMember: (id: string, data: AddCampaignMemberPayload) =>
    post<void>(`/campaigns/${id}/members`, data),
};
