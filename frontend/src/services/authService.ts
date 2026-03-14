import { get, post } from './api';
import type { SignInParams, SignUpParams, AuthResponse, User } from '@/types';

export const authService = {
  signIn: (params: SignInParams) => post<AuthResponse>('/auth/signin', params),
  signUp: (params: SignUpParams) => post<AuthResponse>('/auth/signup', params),
  me: () => get<{ user: User }>('/auth/me'),
};
