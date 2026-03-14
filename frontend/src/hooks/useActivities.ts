import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Activity, User } from '../types';

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data } = await api.get<Activity[]>('/activities');
      return data;
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activity: Partial<Activity>) => {
      const { data } = await api.post<Activity>('/activities', activity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
  });
}

export function useUses() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<User[]>('/users');
      return data;
    },
  });
}
