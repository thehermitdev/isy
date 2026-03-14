import { get, post, put, del } from './api';
import type { Account, CreateAccountPayload, UpdateAccountPayload } from '@/types';

export const accountService = {
  getAll: () => get<Account[]>('/accounts'),
  getById: (id: string) => get<Account>(`/accounts/${id}`),
  create: (data: CreateAccountPayload) => post<Account>('/accounts', data),
  update: (id: string, data: UpdateAccountPayload) => put<Account>(`/accounts/${id}`, data),
  remove: (id: string) => del<void>(`/accounts/${id}`),
};
