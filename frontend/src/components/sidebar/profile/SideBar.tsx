
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuthStore, useWishlistStore } from '@/store';
import toast from 'react-hot-toast';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string | number;
}

export interface AccountSidebarProps {
  user?: {
    id?: number;
    email?: string;
    name?: string;
    avatar?: string;
    phone?: string;
  } | null;
  tabs?: TabItem[];
  activeTab?: string;
  logout?: () => void;
  className?: string;
}

export default function AccountSidebar({
  user: userProp,
  tabs: tabsProp,
  activeTab: activeTabProp,
  logout: logoutProp,
  className = '',
}: AccountSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const authStore = useAuthStore();
  const currentUser = userProp !== undefined ? userProp : authStore.user;

  const { items: wishlistItems } = useWishlistStore();
  const wishlistCount = wishlistItems.length;

  const handleLogout = () => {
    if (logoutProp) {
      logoutProp();
    } else {
      authStore.logout();
    }
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const defaultTabs: TabItem[] = [
    { id: 'profile', label: 'My Profile', icon: User, href: '/profile' },
    { id: 'orders', label: 'My Orders', icon: Package, href: '/orders' },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      badge: wishlistCount > 0 ? wishlistCount : undefined,
    },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/profile#settings' },
  ];

  const navTabs = tabsProp && tabsProp.length > 0 ? tabsProp : defaultTabs;

  const isTabActive = (tab: TabItem) => {
    if (activeTabProp) {
      return activeTabProp === tab.id;
    }
    if (tab.id === 'settings') {
      return location.pathname === '/profile' && location.hash === '#settings';
    }
    if (tab.href === '/profile') {
      return location.pathname === '/profile' && location.hash !== '#settings';
    }
    return (
      location.pathname === tab.href ||
      (tab.href !== '/' && location.pathname.startsWith(tab.href))
    );
  };

  const displayName = currentUser?.name?.trim() || 'Google User';
  const displayEmail = currentUser?.email?.trim() || 'user.google@himalayanfresh.in';

  return (
    <aside className={`lg:col-span-1 ${className}`}>
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-[#EEF2EC] sticky top-24">
        {/* User Profile Info */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-[#E5EFE6] text-[#244B30] rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-xs overflow-hidden">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-9 h-9 stroke-[1.8]" />
            )}
          </div>

          <h3 className="font-heading font-bold text-lg sm:text-[19px] text-[#173D29] tracking-tight">
            {displayName}
          </h3>

          <p className="text-xs sm:text-sm text-[#708474] mt-1 break-all">
            {displayEmail}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-[#EDF2EB] my-5" />

        {/* Navigation Tabs */}
        <nav className="space-y-1.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isTabActive(tab);

            return (
              <Link
                key={tab.id}
                to={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-sm transition-all duration-200 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#173D29]/20 ${
                  isActive
                    ? 'bg-[#EBF3E8] text-[#173D29] font-semibold border border-[#D5E3D3]/70 shadow-xs'
                    : 'text-[#4F6854] hover:bg-[#F3F7F1] hover:text-[#173D29]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#173D29] stroke-[2.2]'
                        : 'text-[#728B77] group-hover:text-[#173D29]'
                    }`}
                  />
                  <span>{tab.label}</span>
                </div>

                {tab.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-[#173D29] text-white'
                        : 'bg-[#EAF1E7] text-[#244B30] group-hover:bg-[#DEEBDC]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Logout Divider */}
          <div className="border-t border-[#EDF2EB] my-4" />

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 w-full font-medium text-sm transition-all duration-200 cursor-pointer outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
