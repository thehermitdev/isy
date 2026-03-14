import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import type { CreateLeadPayload } from '@/types';

export const LEADS_KEY = ['leads'] as const;

export function useLeads() {
  return useQuery({ queryKey: LEADS_KEY, queryFn: leadService.getAll });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadPayload) => leadService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateLeadPayload> }) =>
      leadService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}
