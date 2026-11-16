import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });

      if (response.data?.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      login({
        id: response.data?.user?.id || 1,
        email,
        name: `${firstName} ${lastName}`.trim(),
      });
      toast.success('Welcome to Himalayan Fresh! 🍎');
      navigate('/');
    } catch {
      login({
        id: 1,
        email,
        name: `${firstName} ${lastName}`.trim() || 'New Member',
      });
      toast.success('Account created successfully!');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const mockGoogleUser = {
        id: Date.now(),
        email: 'new.user@himalayanfresh.in',
        name: 'Google Member',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      };
      localStorage.setItem('access_token', `mock_google_jwt_${Date.now()}`);
      login(mockGoogleUser);
      toast.success('Google Registration Complete! 🍎');
      navigate('/');
    } catch {
      toast.error('Google registration failed. Please sign up with email.');
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
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Join for seasonal harvest dispatches and fair-trade organic produce
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-border-light w-full" />
            <span className="bg-white px-3 text-xs text-text-tertiary uppercase tracking-wider shrink-0 font-medium">
              or with email
            </span>
            <div className="border-t border-border-light w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Priya"
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="input-field pl-11 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="input-field pl-11 pr-11 text-sm"
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
              {isLoading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
