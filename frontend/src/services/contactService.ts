import { get, post, patch, del } from './api';
import type { Contact, CreateContactPayload } from '@/types';

export const contactService = {
  getAll: () => get<Contact[]>('/contacts'),
  getById: (id: string) => get<Contact>(`/contacts/${id}`),
  create: (data: CreateContactPayload) => post<Contact>('/contacts', data),
  update: (id: string, data: Partial<CreateContactPayload>) => patch<Contact>(`/contacts/${id}`, data),
  delete: (id: string) => del(`/contacts/${id}`),
};
