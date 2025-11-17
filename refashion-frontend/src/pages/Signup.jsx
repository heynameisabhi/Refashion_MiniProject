import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import useAuth from '../hooks/useAuth.js';
import { userService } from '../api/springBootService.js';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    // Validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (form.password.length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Call Spring Boot signup API
      console.log('Calling Spring Boot signup with:', {
        name: form.name,
        email: form.email,
        phoneNumber: '',
        address: ''
      });

      const response = await userService.register({
        name: form.name,
        email: form.email,
        phoneNumber: '',
        address: ''
      });

      console.log('Signup response:', response);

      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Store token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Auto-login after successful signup
        const loginResult = await login({ email: form.email, password: form.password });
        
        if (loginResult.success) {
          navigate('/upload', { replace: true });
        } else {
          setFormError('Account created but login failed. Please try logging in manually.');
        }
      } else {
        setFormError(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred. Please try again.';
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand/10 via-white to-brand/10 px-4 py-12">
      <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl lg:grid-cols-2">
        <div className="relative hidden bg-brand lg:block">
          <div className="absolute inset-0 bg-brand-dark/20" />
          <div className="relative flex h-full flex-col justify-between p-10 text-brand-light">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                Join ReFashion
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight text-white">
                Start your sustainable fashion journey.
              </h1>
              <p className="mt-4 text-sm text-white/80">
                Create an account to upload items, earn rewards, and make a positive impact on the environment.
              </p>
            </div>
            <div className="space-y-2 text-sm text-white/70">
              <p>✓ Earn points for every action</p>
              <p>✓ Track your environmental impact</p>
              <p>✓ Join a sustainable community</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-8 p-8 sm:p-12">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join ReFashion and start making a difference today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

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
                required
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
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>

            {formError && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
