import type { FastifyRequest, FastifyReply } from 'fastify';
import { supabasePublic } from '../../infrastructure/supabase/SupabaseClient.js';
import { AppError } from '../errors/AppError.js';

export async function authenticate(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH] Missing authorization header');
    throw new AppError('Unauthorized: Missing token', 401);
  }

  const token = authHeader.split(' ')[1];
  console.log('[AUTH] Validating token:', token.substring(0, 20) + '...');

  const { data: { user }, error } = await (supabasePublic.auth as any).getUser(token);

  if (error) {
    console.error('[AUTH] Token validation error:', error);
  }
  
  console.log('[AUTH] Token validation result - User:', user ? `${user.id} (${user.email})` : 'null', 'Error:', error?.message || 'none');

  if (error || !user) {
    throw new AppError('Unauthorized: Invalid token', 401);
  }

  // Attach user to request for use in controllers
  (request as any).user = user;
}
