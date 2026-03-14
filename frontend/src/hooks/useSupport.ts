import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportService } from '@/services/supportService';
import type { CreateTicketPayload, AddTicketMessagePayload } from '@/types';

export const TICKETS_KEY = ['tickets'] as const;

export function useTickets() {
  return useQuery({ queryKey: TICKETS_KEY, queryFn: supportService.getAll });
}

export function useTicketMessages(id: string) {
  return useQuery({
    queryKey: [...TICKETS_KEY, id, 'messages'],
    queryFn: () => supportService.getMessages(id),
    enabled: !!id,
    refetchInterval: 10000, // poll every 10s for new messages
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTicketPayload) => supportService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TICKETS_KEY }),
  });
}

export function useAddTicketMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddTicketMessagePayload }) =>
      supportService.addMessage(id, data),
    onSuccess: (_data, { id }) =>
      qc.invalidateQueries({ queryKey: [...TICKETS_KEY, id, 'messages'] }),
  });
}
