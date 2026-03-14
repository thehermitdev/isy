import { get, post } from './api';
import type { Quote, CreateQuotePayload } from '@/types';

export const quoteService = {
  getAll: () => get<Quote[]>('/quotes'),
  create: (data: CreateQuotePayload) => post<Quote>('/quotes', data),
};
