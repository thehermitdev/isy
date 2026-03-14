import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/atoms/Button';
import { Input } from '@/atoms/Input';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/molecules/Toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const { name, email, password } = data;
      const res = await authService.signUp({ name, email, password });
      const token = res.access_token || res.session?.access_token || '';
      setAuth(res.user, token);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-modal w-full max-w-md p-8 animate-scale-in">
      <div className="mb-8">
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Create account
        </h2>
        <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
          Get started with ISY CRM today — it's free
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Jane Smith"
          autoComplete="name"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          id="register-name"
          {...register('name')}
        />

        <Input
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          id="register-email"
          {...register('email')}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          id="register-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="transition-opacity opacity-60 hover:opacity-100"
              style={{ color: 'var(--icon-color)' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('password')}
        />

        <Input
          type="password"
          label="Confirm password"
          placeholder="Repeat password"
          autoComplete="new-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.confirmPassword?.message}
          id="register-confirm-password"
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2"
          rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
          id="register-submit"
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium transition-colors hover:underline"
          style={{ color: 'oklch(0.75 0.20 280)' }}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
