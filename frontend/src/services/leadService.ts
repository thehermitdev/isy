import { get, post, patch, del } from './api';
import type { Lead, CreateLeadPayload } from '@/types';

export const leadService = {
  getAll: () => get<Lead[]>('/leads'),
  getById: (id: string) => get<Lead>(`/leads/${id}`),
  create: (data: CreateLeadPayload) => post<Lead>('/leads', data),
  update: (id: string, data: Partial<CreateLeadPayload>) => patch<Lead>(`/leads/${id}`, data),
  delete: (id: string) => del(`/leads/${id}`),
};
