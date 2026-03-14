import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountService } from '@/services/accountService';
import type { CreateAccountPayload, UpdateAccountPayload } from '@/types';

export const ACCOUNTS_KEY = ['accounts'] as const;

export function useAccounts() {
  return useQuery({
    queryKey: ACCOUNTS_KEY,
    queryFn: accountService.getAll,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: [...ACCOUNTS_KEY, id],
    queryFn: () => accountService.getById(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountPayload) => accountService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_KEY }),
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountPayload }) =>
      accountService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_KEY }),
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_KEY }),
  });
}
