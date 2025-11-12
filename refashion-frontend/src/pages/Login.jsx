import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, continueAsGuest, isAuthenticated, isLoading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname ?? '/upload';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    if (!form.email || !form.password) {
      setFormError('Please provide both email and password.');
      return;
    }
    const result = await login(form);
    if (result.success) {
      const redirectTo = location.state?.from?.pathname ?? '/upload';
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    navigate('/marketplace', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand/10 via-white to-brand/10 px-4 py-12">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl lg:grid-cols-2">
        <div className="relative hidden bg-brand lg:block">
          <div className="absolute inset-0 bg-brand-dark/20" />
            <div className="relative flex h-full flex-col justify-between p-10 text-brand-light">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                Welcome to ReFashion
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Give your wardrobe a second life.
              </h1>
              <p className="mt-4 text-sm text-white/80">
                Upload gently used garments, explore the sustainable marketplace, and track your impact rewards.
              </p>
            </div>
            <div className="space-y-2 text-sm text-white/70">
              <p>Earn points every time you upload.</p>
              <p>Join a community committed to slow fashion.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center space-y-8 p-8 sm:p-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Sign in to ReFashion</h2>
            <p className="mt-2 text-sm text-gray-600">Use your email to login or create a new account instantly.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            {(formError || error) && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError || error}
              </div>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing you in...' : 'Login / Sign Up'}
            </Button>
          </form>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="h-px flex-1 bg-gray-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>
          <Button variant="secondary" size="lg" className="w-full" onClick={handleGuest}>
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

