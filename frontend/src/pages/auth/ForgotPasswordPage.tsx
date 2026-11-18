import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import leafLogo from '@/assets/images/auth/leaf_logo.png';
import authFoliageImg from '@/assets/images/auth/hf_sidebar.png';
import bgImg from '@/assets/images/auth/bg_new.jpg';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your registered email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate / dispatch recovery email
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email! 📩');
    } catch (err: any) {
      toast.error('Could not process request. Please check the email address and try again.');
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
          min-h-[580px] md:h-[680px]
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
            h-full min-h-[340px] md:min-h-0
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
              Pure & Pristine,
              <br />
              Always Within <span className="text-[#C2E88B]">Reach.</span>
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
                Your Orchard Account Security & Recovery.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - RESET PASSWORD FORM */}
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
              Reset Password
            </h1>

            <p className="text-xs sm:text-sm text-[#718277] mt-1.5 max-w-sm mx-auto">
              Enter your registered email and we'll dispatch password recovery instructions
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                  placeholder="Enter your registered email"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
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
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <span>Send Recovery Link</span>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-[#F2F6F1] border border-[#38784C]/20 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#17482D] mx-auto" />
              <h3 className="font-heading font-bold text-lg text-[#123D28]">
                Check Your Inbox
              </h3>
              <p className="text-xs sm:text-sm text-[#647568] leading-relaxed">
                We've dispatched password reset instructions to{' '}
                <span className="font-semibold text-[#193D2A]">{email}</span>. Follow the link to
                create a new password.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-[#1D5734] hover:underline font-semibold pt-1 cursor-pointer"
              >
                Did not receive? Resend email
              </button>
            </div>
          )}

          {/* Back to Sign In Link */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="
                inline-flex items-center gap-1.5
                text-xs sm:text-sm font-semibold
                text-[#1D5734]
                hover:text-[#103B24]
                hover:underline
                transition-colors
              "
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-center
            gap-2 mt-6 text-[11px] text-[#9AA79B]"
          >
            <span className="text-[#52845B]">✦</span>
            Freshness from the Himalayas
            <span className="text-[#52845B]">✦</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
