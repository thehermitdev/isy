import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quoteService } from '@/services/quoteService';
import type { CreateQuotePayload } from '@/types';

export const QUOTES_KEY = ['quotes'] as const;

export function useQuotes() {
  return useQuery({ queryKey: QUOTES_KEY, queryFn: quoteService.getAll });
}

export function useCreateQuote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuotePayload) => quoteService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUOTES_KEY }),
  });
}
