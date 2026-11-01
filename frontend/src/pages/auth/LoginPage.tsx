import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({ id: 1, email: 'demo@himalayafresh.in', name: 'Demo User' });
      toast.success('Welcome back!');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pine-800 via-pine-900 to-charcoal-900 flex items-center justify-center py-12 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-premium">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="font-heading font-bold text-2xl text-pine-700">Himalaya</span>
              <span className="font-heading font-bold text-2xl text-charcoal-800">Fresh</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold text-charcoal-900">Welcome Back</h1>
            <p className="text-charcoal-500 mt-2">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input type="email" placeholder="Enter your email" className="input-field pl-12" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="input-field pl-12 pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-charcoal-400" /> : <Eye className="w-5 h-5 text-charcoal-400" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-pine-700 rounded" />
                <span className="text-sm text-charcoal-500">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-pine-700 font-medium">Forgot password?</Link>
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-charcoal-500">
            Don't have an account? <Link to="/register" className="text-pine-700 font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}