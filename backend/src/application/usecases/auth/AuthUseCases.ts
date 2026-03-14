import type { UseCase } from '../UseCase.js';
import type { UserRepository } from '../../../domain/repositories/UserRepository.js';
import type { User } from '../../../domain/entities/User.js';
import { supabase } from '../../../infrastructure/supabase/SupabaseClient.js';
import { z } from 'zod';
import { AppError } from '../../../core/errors/AppError.js';

export const SignUpSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInInput = z.infer<typeof SignInSchema>;

export class SignUp implements UseCase<SignUpInput, { user: User; session: any }> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SignUpInput): Promise<{ user: User; session: any }> {
    const { email, password, name } = SignUpSchema.parse(input);

    console.log('[SignUp] Starting signup for email:', email);

    // 1. Sign up in Supabase Auth with timeout
    try {
      console.log('[SignUp] Calling Supabase signUp...');
      const startTime = Date.now();
      
      const { data, error } = await Promise.race([
        (supabase.auth as any).signUp({ email, password }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase signup timeout after 8s')), 8000)
        )
      ]) as any;

      const duration = Date.now() - startTime;
      console.log('[SignUp] Supabase response received after', duration, 'ms');

      if (error) {
        console.error('[SignUp] Supabase error:', error);
        throw new AppError(error.message, 400);
      }
      if (!data.user) throw new AppError('Signup failed', 400);

      // 2. Create or fetch user record in our database
      console.log('[SignUp] Creating/finding user record...');
      let user = await this.userRepository.findByEmail(email);
      
      if (!user) {
          user = await this.userRepository.create({
            name,
            email,
            role: 'agent',
          } as any);
      }
      
      console.log('[SignUp] Signup successful for:', email);
      return { user, session: data.session };
    } catch (err: any) {
      console.error('[SignUp] Error during signup:', err.message);
      throw err;
    }
  }
}

export class SignIn implements UseCase<SignInInput, { user: User; session: any }> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: SignInInput): Promise<{ user: User; session: any }> {
    const { email, password } = SignInSchema.parse(input);

    console.log('[SignIn] Starting signin for email:', email);
    console.log('[SignIn] Supabase URL:', process.env.SUPABASE_URL);
    console.log('[SignIn] Environment:', process.env.NODE_ENV);

    // 1. Sign in via Supabase Auth with timeout
    try {
      console.log('[SignIn] Calling Supabase signInWithPassword...');
      const startTime = Date.now();
      
      const { data, error } = await Promise.race([
        (supabase.auth as any).signInWithPassword({ email, password }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Supabase signin timeout after 8s')), 8000)
        )
      ]) as any;

      const duration = Date.now() - startTime;
      console.log('[SignIn] Supabase response received after', duration, 'ms');

      if (error) {
        console.error('[SignIn] Supabase auth error:', error);
        throw new AppError(error.message, 401);
      }
      if (!data.user) throw new AppError('Login failed', 401);

      // 2. Find user in our database
      console.log('[SignIn] Looking up user in database...');
      let user = await this.userRepository.findByEmail(email);
      
      if (!user) {
          console.log('[SignIn] User not found, auto-provisioning...');
          // Fallback or auto-provision if person exists in Auth but not in our table
          user = await this.userRepository.create({
              name: email.split('@')[0],
              email,
              role: 'agent'
          } as any);
      }

      console.log('[SignIn] Signin successful for:', email);
      return { user, session: data.session };
    } catch (err: any) {
      console.error('[SignIn] Error during signin:', err.message);
      throw err;
    }
  }
}
