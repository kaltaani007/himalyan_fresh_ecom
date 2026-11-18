import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAuthModalStore } from '@/store/authModalStore';
import leafLogo from '@/assets/images/auth/leaf_logo.png';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function ProtectedRoute({
  children,
  title = 'Sign In to Access',
  subtitle = 'Please sign in to view your account, orders, or private orchard cart.',
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal({
        title,
        subtitle,
        redirectUrl: location.pathname,
      });
    }
  }, [isAuthenticated, location.pathname, openAuthModal, title, subtitle]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#F8FAF5]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E2ECE0] shadow-sm text-center">
        <div className="w-14 h-16 mx-auto mb-4">
          <img src={leafLogo} alt="Himalaya Fresh" className="w-full h-full object-contain" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF1E7] text-[#1C422A] text-xs font-semibold mb-3">
          <Lock className="w-3.5 h-3.5 text-[#38784C]" />
          <span>Member Exclusive Access</span>
        </div>

        <h2 className="font-heading font-bold text-2xl text-[#123D28] mb-2">{title}</h2>
        <p className="text-xs sm:text-sm text-[#6C8170] leading-relaxed mb-6">{subtitle}</p>

        <button
          type="button"
          onClick={() => openAuthModal({ title, subtitle })}
          className="w-full py-3.5 px-5 rounded-xl bg-[#17482D] hover:bg-[#103B24] text-white text-sm font-semibold shadow-[0_8px_20px_rgba(23,72,45,0.2)] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#C2E88B]" />
          <span>Sign In / Create Account</span>
        </button>
      </div>
    </div>
  );
}
