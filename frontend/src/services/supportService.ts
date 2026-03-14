import { get, post } from './api';
import type {
  SupportTicket,
  TicketMessage,
  CreateTicketPayload,
  AddTicketMessagePayload,
} from '@/types';

export const supportService = {
  getAll: () => get<SupportTicket[]>('/tickets'),
  create: (data: CreateTicketPayload) => post<SupportTicket>('/tickets', data),
  getMessages: (id: string) => get<TicketMessage[]>(`/tickets/${id}/messages`),
  addMessage: (id: string, data: AddTicketMessagePayload) =>
    post<void>(`/tickets/${id}/messages`, data),
};
