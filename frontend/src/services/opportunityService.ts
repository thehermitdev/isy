import { get, post, patch, del } from './api';
import type {
  Opportunity,
  PipelineBoard,
  PipelineStage,
  CreateOpportunityPayload,
  UpdateOpportunityPayload,
} from '@/types';

export const opportunityService = {
  getAll: () => get<Opportunity[]>('/opportunities'),
  create: (data: CreateOpportunityPayload) => post<Opportunity>('/opportunities', data),
  update: (id: string, data: UpdateOpportunityPayload) => patch<Opportunity>(`/opportunities/${id}`, data),
  getPipeline: () => get<PipelineBoard>('/pipeline'),
  getStages: () => get<PipelineStage[]>('/pipeline/stages'),
  delete: (id: string) => del<void>(`/opportunities/${id}`),
};
