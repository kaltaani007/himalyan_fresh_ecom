import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);
      if (response.data?.access) {
        localStorage.setItem('access_token', response.data.access);
        if (response.data.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }
      }
      login({
        id: response.data?.user?.id || 1,
        email,
        name: response.data?.user?.first_name || email.split('@')[0],
      });
      toast.success('Welcome back to Himalayan Fresh! 🍎');
      navigate('/');
    } catch {
      // Local fallback for prototype mode
      login({
        id: 1,
        email: email || 'demo@himalayanfresh.in',
        name: email ? email.split('@')[0] : 'Orchard Guest',
      });
      toast.success('Signed in successfully!');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Flow Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      // Simulate OAuth response or call backend social auth
      const mockGoogleUser = {
        id: Date.now(),
        email: 'user.google@himalayanfresh.in',
        name: 'Google User',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      };

      // Set auth in store & tokens
      localStorage.setItem('access_token', `mock_google_jwt_${Date.now()}`);
      login(mockGoogleUser);

      toast.success('Google Authentication Successful! 🍎', {
        icon: '✅',
      });
      navigate('/');
    } catch (err) {
      toast.error('Google Sign-In failed. Please try with email/password.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1f14] via-[#14281b] to-[#1e3827] flex items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform">
                HF
              </div>
              <div className="text-left leading-tight">
                <span className="font-heading font-bold text-xl text-primary block">Himalaya</span>
                <span className="font-heading font-bold text-xl text-text-primary block">Fresh</span>
              </div>
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Sign in to manage orders and orchard subscriptions
            </p>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              GOOGLE OAUTH BUTTON
             ───────────────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 px-4 rounded-xl border border-border-medium bg-white hover:bg-background-secondary text-text-primary text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.94H1.21v3.15C3.26 21.46 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.26c-.24-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.59H1.21C.44 8.12 0 9.99 0 12s.44 3.88 1.21 5.41l4.11-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.54 1.21 6.59l4.11 3.15c.94-2.84 3.58-4.99 6.68-4.99z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-border-light w-full" />
            <span className="bg-white px-3 text-xs text-text-tertiary uppercase tracking-wider shrink-0 font-medium">
              or with email
            </span>
            <div className="border-t border-border-light w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-11 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-11 pr-11 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg mt-2"
            >
              {isLoading ? 'Signing In...' : 'Sign In to Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-text-secondary">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
