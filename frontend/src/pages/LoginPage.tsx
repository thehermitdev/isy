import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/atoms/Button';
import { Input } from '@/atoms/Input';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { toast } from '@/molecules/Toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await authService.signIn(data);
      const token = res.access_token || res.session?.access_token || '';
      setAuth(res.user, token);
      toast.success('Welcome back!');
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials';
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
          Sign in
        </h2>
        <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
          Welcome back — enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <Input
          type="email"
          label="Email"
          placeholder="you@company.com"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          id="login-email"
          {...register('email')}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          leftIcon={<Lock className="w-4 h-4" />}
          error={errors.password?.message}
          id="login-password"
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

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2"
          rightIcon={!loading ? <ArrowRight className="w-4 h-4" /> : undefined}
          id="login-submit"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium transition-colors hover:underline"
          style={{ color: 'oklch(0.75 0.20 280)' }}
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
