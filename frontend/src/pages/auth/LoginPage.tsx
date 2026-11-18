import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store';
import { authApi } from '@/services/api';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { GoogleAuthModal } from '@/components/auth/GoogleAuthModal';
import leafLogo from '@/assets/images/auth/leaf_logo.png';
import authFoliageImg from '@/assets/images/auth/hf_sidebar.png';
import bgImg from '@/assets/images/auth/bg_new.jpg';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = (location.state as any)?.from || '/profile';

  // Google OAuth Hook
  const {
    signInWithGoogle,
    isGoogleLoading,
    showDemoModal,
    setShowDemoModal,
    handleAuthPayload,
  } = useGoogleAuth({
    redirectPath,
  });

  // Standard Email & Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login(email.trim(), password);
      const data = response.data;

      if (data?.access) {
        localStorage.setItem('access_token', data.access);
      }
      if (data?.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      const userData = data.user || {
        id: 1,
        email: email.trim(),
        name: email.split('@')[0],
      };

      login(userData);
      toast.success(data?.message || `Welcome back, ${userData.name}! 🌿`);
      navigate(redirectPath);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Invalid email or password. Please verify your credentials.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center
      px-3 py-6 sm:px-6 lg:px-10 overflow-x-hidden
      bg-gradient-to-br from-[#EAF2E7] via-[#DCEBDD] to-[#B9D2B6]
      select-none"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-[#0D3522]/10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="
          relative z-10
          w-full max-w-[1180px]
          min-h-[640px] md:h-[740px]
          grid grid-cols-1 md:grid-cols-2
          gap-3 sm:gap-4
          p-3 sm:p-4
          rounded-[28px] sm:rounded-[36px]
          border border-white/80
          bg-gradient-to-br from-white via-[#FAFCF9] to-[#EAF3E9]
          shadow-[0_25px_90px_rgba(15,55,30,0.24)]
          items-stretch
        "
      >
        {/* LEFT PANEL - HIMALAYA FRESH BRANDING */}
        <div
          className="
            relative overflow-hidden
            rounded-[22px] sm:rounded-[28px]
            h-full min-h-[360px] md:min-h-0
            bg-cover bg-center
            flex flex-col justify-between
            p-7 sm:p-9 lg:p-12
          "
          style={{
            backgroundImage: `url(${authFoliageImg})`,
          }}
        >
          {/* Subtle overlay */}
          <div
            className="
            absolute inset-0 rounded-[22px] sm:rounded-[28px]
            bg-gradient-to-t from-black/55 via-black/15 to-transparent
            pointer-events-none
          "
          />

          {/* Oval curved cut */}
          <div
            className="
            absolute hidden md:block
            -right-[75px] top-[-8%]
            w-[150px] h-[116%]
            rounded-[50%]
            bg-gradient-to-b from-[#FCFDFC] via-[#F7FAF5] to-[#EFF6ED]
            pointer-events-none
            z-20
          "
          />

          {/* Brand Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
              <img
                src={leafLogo}
                alt="Himalaya Fresh"
                className="w-14 h-16 object-contain drop-shadow-md"
              />
            </Link>
          </div>

          {/* Brand Message */}
          <div className="relative z-10 max-w-[440px] pb-3">
            <div className="w-12 h-[3px] bg-[#A7D66A] rounded-full mb-6" />

            <h2
              className="font-heading text-4xl sm:text-5xl
              lg:text-[52px] leading-[1.12] font-bold
              text-white tracking-tight"
            >
              Nature's Finest,
              <br />
              Delivered <span className="text-[#C2E88B]">Fresh.</span>
            </h2>

            <div className="flex items-center gap-3 mt-8">
              <div
                className="w-9 h-9 rounded-full
                bg-white/15 border border-white/25
                flex items-center justify-center backdrop-blur-xs"
              >
                <span className="text-lg">🌿</span>
              </div>
              <p
                className="text-xs sm:text-sm text-white/90
                font-medium tracking-wide"
              >
                Naturally Grown. Carefully Delivered.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - LOGIN FORM */}
        <div
          className="
          flex flex-col justify-center
          min-h-0
          px-4 sm:px-8 lg:px-12 xl:px-14
          py-8 sm:py-10
          rounded-[22px] sm:rounded-[28px]
          bg-gradient-to-br from-white via-[#FCFDFC] to-[#EFF6ED]
        "
        >
          {/* Logo & Heading */}
          <div className="text-center mb-7 sm:mb-8">
            <Link
              to="/"
              className="inline-flex justify-center
              hover:scale-105 transition-transform"
            >
              <img
                src={leafLogo}
                alt="Himalaya Fresh"
                className="w-12 h-14 object-contain"
              />
            </Link>

            <h1
              className="font-heading font-bold
              text-3xl sm:text-4xl text-[#123D28]
              tracking-tight mt-3"
            >
              Welcome Back
            </h1>

            <p className="text-xs sm:text-sm text-[#718277] mt-1.5">
              Sign in to manage orders, orchard dispatches & fresh produce
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
            {/* Email */}
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold
                text-[#244632] mb-1.5"
              >
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="
                  w-full h-[50px] sm:h-[54px]
                  bg-[#F2F6F1]
                  border border-[#E0E9DE]
                  rounded-xl px-4 sm:px-5
                  text-sm text-[#193D2A]
                  placeholder:text-[#9BA99D]
                  outline-none
                  transition-all duration-200
                  focus:bg-white
                  focus:border-[#38784C]
                  focus:ring-4 focus:ring-[#38784C]/10
                "
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs sm:text-sm font-semibold
                text-[#244632] mb-1.5"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    w-full h-[50px] sm:h-[54px]
                    bg-[#F2F6F1]
                    border border-[#E0E9DE]
                    rounded-xl px-4 sm:px-5 pr-12
                    text-sm text-[#193D2A]
                    placeholder:text-[#9BA99D]
                    outline-none
                    transition-all duration-200
                    focus:bg-white
                    focus:border-[#38784C]
                    focus:ring-4 focus:ring-[#38784C]/10
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-4 top-1/2
                    -translate-y-1/2
                    text-[#84968A]
                    hover:text-[#17482D]
                    transition-colors cursor-pointer
                    p-1
                  "
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="
                    w-4 h-4 rounded
                    accent-[#1C5935]
                    cursor-pointer
                  "
                />

                <span className="text-xs sm:text-sm text-[#647568]">
                  Remember me
                </span>
              </label>

              <Link
                to="/forgot-password"
                className="
                  text-xs sm:text-sm font-semibold
                  text-[#27633C]
                  hover:text-[#123D28]
                  transition-colors
                "
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="
                w-full h-[50px] sm:h-[54px]
                rounded-xl
                bg-[#17482D]
                hover:bg-[#103B24]
                active:scale-[0.99]
                text-white text-sm font-semibold
                shadow-[0_8px_20px_rgba(23,72,45,0.18)]
                hover:shadow-[0_10px_24px_rgba(23,72,45,0.25)]
                transition-all duration-200
                flex items-center justify-center gap-2.5
                cursor-pointer
                disabled:opacity-60
                mt-2
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Your Account</span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-0.5">
              <div className="flex-1 h-px bg-[#E2EAE0]" />
              <span
                className="text-[11px] text-[#93A195]
                uppercase tracking-[2px]"
              >
                Or continue with
              </span>
              <div className="flex-1 h-px bg-[#E2EAE0]" />
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isGoogleLoading || isLoading}
              className="
                w-full h-[50px] sm:h-[54px]
                rounded-xl
                border border-[#DCE6DA]
                bg-white
                hover:bg-[#F6FAF4]
                hover:border-[#A9C4A7]
                text-[#334C3A]
                text-sm font-semibold
                transition-all duration-200
                flex items-center justify-center gap-3
                cursor-pointer
                disabled:opacity-60
              "
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#17482D]" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-[#78877B]">
            Don't have an account?
            <Link
              to="/register"
              className="
                font-bold text-[#1D5734]
                hover:text-[#103B24]
                hover:underline ml-1.5
                transition-colors
              "
            >
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <div
            className="flex items-center justify-center
            gap-2 mt-5 text-[11px] text-[#9AA79B]"
          >
            <span className="text-[#52845B]">✦</span>
            Freshness from the Himalayas
            <span className="text-[#52845B]">✦</span>
          </div>
        </div>
      </motion.div>

      {/* Google OAuth Modal */}
      <GoogleAuthModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectAccount={handleAuthPayload}
        isLoading={isGoogleLoading}
      />
    </div>
  );
}
