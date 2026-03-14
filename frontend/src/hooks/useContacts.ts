import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '@/services/contactService';
import type { CreateContactPayload } from '@/types';

export const CONTACTS_KEY = ['contacts'] as const;

export function useContacts() {
  return useQuery({ queryKey: CONTACTS_KEY, queryFn: contactService.getAll });
}

export function useCreateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContactPayload) => contactService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateContactPayload> }) =>
      contactService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });
}
