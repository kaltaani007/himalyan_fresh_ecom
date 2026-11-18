import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Package,
  MapPin,
  ChevronRight,
  Sparkles,
  Leaf,
  Phone,
  BookOpen,
  LogOut,
  LogIn,
  Camera,
  ShieldCheck,
  Flame,
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAuthModalStore } from '@/store/authModalStore';
import { useCategories } from '@/hooks/useCategories';
import { useDistricts } from '@/hooks/useDistricts';
import toast from 'react-hot-toast';

interface GlobalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalDrawer({ isOpen, onClose }: GlobalDrawerProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();
  const { data: categories = [] } = useCategories();
  const { data: districts = [] } = useDistricts();

  const handleAuthAction = () => {
    onClose();
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      openAuthModal({
        title: 'Sign In to Himalayan Fresh',
        subtitle: 'Access your orchard orders, basket, and member discounts.',
      });
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('Signed out successfully! 🌿');
    navigate('/');
  };

  const handleLinkClick = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Slide-out Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="
              relative z-10
              w-full max-w-[340px] sm:max-w-[380px]
              h-full bg-white
              shadow-[0_20px_80px_rgba(0,0,0,0.35)]
              flex flex-col
              overflow-hidden
            "
          >
            {/* 1. Header (Amazon/Flipkart Style User Greeting) */}
            <div className="bg-gradient-to-r from-[#17482D] to-[#1F5E3B] text-white px-5 py-5 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={handleAuthAction}
                className="flex items-center gap-3 text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
                  {isAuthenticated && user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                <div className="leading-tight">
                  <p className="text-[11px] text-[#A7D66A] font-semibold uppercase tracking-wider">
                    {isAuthenticated ? 'Orchard Member' : 'Welcome Guest'}
                  </p>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-white group-hover:underline">
                    {isAuthenticated && user?.name ? `Hello, ${user.name}` : 'Hello, Sign In'}
                  </h3>
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#EAEFE8] text-sm text-[#274533]">
              {/* Highlights & Deals */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-1 text-[11px] font-bold text-[#6D8274] uppercase tracking-wider">
                  Trending &amp; Harvest
                </p>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/products?category=royal-apples')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Royal Apples 2024 (Harvest Deals)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/products')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#206935]" />
                    <span>All Mountain Produce</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>
              </div>

              {/* Shop by Category */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-1 text-[11px] font-bold text-[#6D8274] uppercase tracking-wider">
                  Shop by Produce Category
                </p>

                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleLinkClick(`/products?category=${cat.slug}`)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left text-xs sm:text-sm font-medium"
                    >
                      <span className="flex items-center gap-2.5">
                        <Leaf className="w-3.5 h-3.5 text-[#3D7A4F]" />
                        <span>{cat.name}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/products?category=royal-apples')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                    >
                      <span>🍎 Royal Apples</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/products?category=dry-fruits')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                    >
                      <span>🌰 Kinnaur Dry Fruits</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('/products?category=organic-fruits')}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                    >
                      <span>🍒 Mountain Cherries &amp; Plums</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                    </button>
                  </>
                )}
              </div>

              {/* Sourced Districts */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-1 text-[11px] font-bold text-[#6D8274] uppercase tracking-wider">
                  Himalayan Districts
                </p>

                {districts.slice(0, 4).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleLinkClick(`/districts/${d.slug}`)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left text-xs sm:text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#3D7A4F]" />
                      <span>{d.name} Orchards</span>
                    </span>
                    <span className="text-[11px] text-[#718678] font-mono">{d.altitude}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handleLinkClick('/districts')}
                  className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#1F5E3B] hover:underline"
                >
                  View All 12 Districts →
                </button>
              </div>

              {/* Orders, Wishlist & Cart */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-1 text-[11px] font-bold text-[#6D8274] uppercase tracking-wider">
                  Your Account &amp; Orders
                </p>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/orders')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-[#206935]" />
                    <span>Your Orders &amp; Live Tracking</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/wishlist')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-600" />
                    <span>Your Wishlist</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/cart')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-[#206935]" />
                    <span>Your Shopping Basket</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/profile')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#206935]" />
                    <span>Account Profile &amp; Addresses</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA091]" />
                </button>
              </div>

              {/* Story, Studio & Support */}
              <div className="p-4 space-y-1">
                <p className="px-3 py-1 text-[11px] font-bold text-[#6D8274] uppercase tracking-wider">
                  Community &amp; Help
                </p>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/blogs')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-[#3D7A4F]" />
                    <span>Harvest Blog &amp; Recipes</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/media-manager')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-[#3D7A4F]" />
                    <span>Media Studio &amp; Uploads</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/about')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-[#3D7A4F]" />
                    <span>Our Story &amp; Zero-Wax Promise</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick('/contact')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2F7F0] transition-colors text-left font-medium"
                >
                  <span className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#3D7A4F]" />
                    <span>Contact Orchard Concierge</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#8BA091]" />
                </button>
              </div>

              {/* Auth Toggle */}
              <div className="p-4">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-rose-700 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openAuthModal({ title: 'Welcome to Himalayan Fresh' });
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#17482D] hover:bg-[#103B24] text-white font-semibold shadow-sm transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </div>

            {/* 3. Footer */}
            <div className="bg-[#F8FAF6] p-3.5 border-t border-[#EAEFE8] flex items-center justify-center gap-1.5 text-[11px] text-[#718678] shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3D7A4F]" />
              <span>100% Certified Mountain Harvest • Himachal Pradesh</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
