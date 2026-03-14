import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '@/services/campaignService';
import type { CreateCampaignPayload, AddCampaignMemberPayload } from '@/types';

export const CAMPAIGNS_KEY = ['campaigns'] as const;

export function useCampaigns() {
  return useQuery({ queryKey: CAMPAIGNS_KEY, queryFn: campaignService.getAll });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignPayload) => campaignService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
}

export function useAddCampaignMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddCampaignMemberPayload }) =>
      campaignService.addMember(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
}
