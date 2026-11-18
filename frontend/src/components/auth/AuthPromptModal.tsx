import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useAuthModalStore } from '@/store/authModalStore';
import { useAuthStore } from '@/store';
import { authApi } from '@/services/api';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleAuthModal } from '@/components/auth/GoogleAuthModal';
import leafLogo from '@/assets/images/auth/leaf_logo.png';
import toast from 'react-hot-toast';

export default function AuthPromptModal() {
  const { isOpen, mode, title, subtitle, onSuccess, closeAuthModal } = useAuthModalStore();
  const { login } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(mode || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Keep active tab in sync with store mode when opened
  useState(() => {
    if (mode) setActiveTab(mode);
  });

  const {
    signInWithGoogle,
    isGoogleLoading,
    showDemoModal,
    setShowDemoModal,
    handleAuthPayload,
  } = useGoogleAuth({
    onSuccess: () => {
      closeAuthModal();
      if (onSuccess) onSuccess();
    },
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);

    if (activeTab === 'signin') {
      try {
        const response = await authApi.login(email.trim(), password);
        const data = response.data;
        if (data?.access) localStorage.setItem('access_token', data.access);
        if (data?.refresh) localStorage.setItem('refresh_token', data.refresh);

        const userData = data.user || {
          id: 1,
          email: email.trim(),
          name: email.split('@')[0],
        };
        login(userData);
        toast.success(`Welcome back, ${userData.name}! 🌿`);
        closeAuthModal();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        toast.error(
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          'Invalid credentials. Please verify and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign up flow
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
      if (passwordConfirm && password !== passwordConfirm) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.register({
          email: email.trim().toLowerCase(),
          password,
          password_confirm: passwordConfirm || password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        });
        const data = response.data;
        if (data?.access) localStorage.setItem('access_token', data.access);
        if (data?.refresh) localStorage.setItem('refresh_token', data.refresh);

        const userData = data.user || {
          id: 1,
          email: email.trim(),
          name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
        };
        login(userData);
        toast.success('Your Himalayan Fresh account is ready! 🍎');
        closeAuthModal();
        if (onSuccess) onSuccess();
      } catch (err: any) {
        const res = err?.response?.data;
        toast.error(
          res?.email?.[0] ||
          res?.password?.[0] ||
          res?.error ||
          'Registration failed. Please check your details.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-[#0B2114]/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="
            relative z-10
            w-full max-w-md
            bg-white
            rounded-[28px] sm:rounded-[32px]
            p-6 sm:p-8
            shadow-[0_25px_80px_rgba(10,35,18,0.3)]
            border border-[#E2ECE0]
            my-auto
          "
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="
              absolute right-4.5 top-4.5
              w-9 h-9 rounded-full
              bg-[#F2F6F1] hover:bg-[#E2ECE0]
              text-[#34593C] hover:text-[#173D29]
              flex items-center justify-center
              transition-colors cursor-pointer
            "
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-14 mx-auto mb-2.5">
              <img
                src={leafLogo}
                alt="Himalaya Fresh"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="font-heading font-bold text-2xl text-[#123D28] tracking-tight">
              {title || (activeTab === 'signin' ? 'Sign In to Continue' : 'Create an Account')}
            </h2>
            <p className="text-xs text-[#6C8170] mt-1 max-w-xs mx-auto">
              {subtitle || 'Unlock fresh orchard dispatches, orders tracking, and your farm basket.'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#F2F6F1] p-1 rounded-xl mb-4.5">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-[#173D29] shadow-xs'
                  : 'text-[#6C8170] hover:text-[#173D29]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-[#173D29] shadow-xs'
                  : 'text-[#6C8170] hover:text-[#173D29]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* 1-Click Google OAuth */}
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={isGoogleLoading || isLoading}
            className="
              w-full h-[46px]
              rounded-xl
              border border-[#DCE6DA]
              bg-white
              hover:bg-[#F6FAF4]
              text-[#334C3A]
              text-xs sm:text-sm font-semibold
              transition-all duration-200
              flex items-center justify-center gap-2.5
              cursor-pointer
              disabled:opacity-60
              mb-4
            "
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-[#17482D]" />
            ) : (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#E2ECE0]" />
            <span className="text-[10px] text-[#93A195] uppercase tracking-wider font-semibold">
              Or with email
            </span>
            <div className="flex-1 h-px bg-[#E2ECE0]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === 'signup' && (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#244632] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="
                      w-full h-[42px]
                      bg-[#F2F6F1] border border-[#E0E9DE]
                      rounded-xl px-3 text-xs text-[#193D2A]
                      outline-none focus:bg-white focus:border-[#38784C]
                    "
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#244632] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="
                      w-full h-[42px]
                      bg-[#F2F6F1] border border-[#E0E9DE]
                      rounded-xl px-3 text-xs text-[#193D2A]
                      outline-none focus:bg-white focus:border-[#38784C]
                    "
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#244632] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="
                  w-full h-[42px]
                  bg-[#F2F6F1] border border-[#E0E9DE]
                  rounded-xl px-3 text-xs text-[#193D2A]
                  outline-none focus:bg-white focus:border-[#38784C]
                "
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#244632] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="
                    w-full h-[42px]
                    bg-[#F2F6F1] border border-[#E0E9DE]
                    rounded-xl px-3 pr-9 text-xs text-[#193D2A]
                    outline-none focus:bg-white focus:border-[#38784C]
                  "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#244632] mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className="
                    w-full h-[42px]
                    bg-[#F2F6F1] border border-[#E0E9DE]
                    rounded-xl px-3 text-xs text-[#193D2A]
                    outline-none focus:bg-white focus:border-[#38784C]
                  "
                  required
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="
                w-full h-[46px]
                rounded-xl
                bg-[#17482D] hover:bg-[#103B24]
                text-white text-xs sm:text-sm font-semibold
                shadow-[0_6px_18px_rgba(23,72,45,0.2)]
                flex items-center justify-center gap-2
                transition-all cursor-pointer
                disabled:opacity-60
                mt-2
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{activeTab === 'signin' ? 'Sign In to Account' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Privacy badge */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-[#718277]">
            <Lock className="w-3 h-3 text-[#38784C]" />
            <span>Encrypted &amp; Cold-Chain Secure Session</span>
          </div>
        </motion.div>
      </div>

      <GoogleAuthModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectAccount={handleAuthPayload}
        isLoading={isGoogleLoading}
      />
    </AnimatePresence>
  );
}
