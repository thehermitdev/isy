import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunityService } from '@/services/opportunityService';
import type { CreateOpportunityPayload, UpdateOpportunityPayload } from '@/types';

export const OPPORTUNITIES_KEY = ['opportunities'] as const;
export const PIPELINE_KEY = ['pipeline'] as const;
export const STAGES_KEY = ['pipeline', 'stages'] as const;

export function useOpportunities() {
  return useQuery({ queryKey: OPPORTUNITIES_KEY, queryFn: opportunityService.getAll });
}

export function usePipeline() {
  return useQuery({ queryKey: PIPELINE_KEY, queryFn: opportunityService.getPipeline });
}

export function usePipelineStages() {
  return useQuery({ queryKey: STAGES_KEY, queryFn: opportunityService.getStages });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOpportunityPayload) => opportunityService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: OPPORTUNITIES_KEY });
      qc.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });
}

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOpportunityPayload }) =>
      opportunityService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: OPPORTUNITIES_KEY });
      qc.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });
}

export function useDeleteOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => opportunityService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: OPPORTUNITIES_KEY });
      qc.invalidateQueries({ queryKey: PIPELINE_KEY });
    },
  });
}
