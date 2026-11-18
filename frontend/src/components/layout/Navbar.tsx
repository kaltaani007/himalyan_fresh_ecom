import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, ChevronDown, Leaf } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useDistricts } from '@/hooks/useDistricts';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { useAuthModalStore } from '@/store/authModalStore';
import GlobalDrawer from './GlobalDrawer';
import HFLogo from '@/assets/images/logo/himalayan_fresh_logo.png';

export default function Navbar() {
  const { data: categories = [] } = useCategories();
  const { data: districts = [] } = useDistricts();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlobalDrawerOpen, setIsGlobalDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openAuthModal } = useAuthModalStore();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHomePage = location.pathname === '/';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Orchard Shop', href: '/products' },
    { label: 'Categories', href: '/products' },
    { label: 'Districts', href: '/districts' },
    { label: 'Harvest Blog', href: '/blogs' },
    { label: 'Media Studio', href: '/media-manager' },
    { label: 'Our Story', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2ECE0]'
            : isHomePage
            ? 'bg-white/40 backdrop-blur-[6px] border-b border-black/[0.04]'
            : 'bg-white/90 backdrop-blur-sm border-b border-[#E2ECE0]'
        }`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* 1. BRAND LOGO EMBLEM + GLOBAL AMAZON/FLIPKART DRAWER TRIGGER */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsGlobalDrawerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#EAF1E7] hover:bg-[#DCE7D8] text-[#173D29] text-xs font-bold transition-all border border-[#D0E2CC] cursor-pointer shadow-xs active:scale-95"
                title="All Categories &amp; Orchards"
              >
                <Menu className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">All</span>
              </button>

              <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
                <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-transform group-hover:scale-105">
                  <img
                    src={HFLogo}
                    alt="Himalaya Fresh Logo"
                    className="w-full h-full object-contain drop-shadow-xs"
                  />
                </div>

                <div className="leading-tight flex flex-col justify-center">
                  <span className="font-heading font-extrabold text-xl sm:text-[22px] text-[#173D29] tracking-tight">
                    Himalaya
                  </span>
                  <span className="font-heading font-medium text-xs sm:text-[13px] text-[#34593C] tracking-[0.2em] uppercase -mt-0.5">
                    Fresh
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. CENTER FLOATING NAVIGATION BAR */}
            <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
              {/* Active Home Pill Tab */}
              <Link
                to="/"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-[#EAF1E7] text-[#1C422A] shadow-xs'
                    : 'text-[#2D4536] hover:text-[#173D29] hover:bg-black/5'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 text-[#54823E] fill-[#54823E]" />
                <span>Home</span>
              </Link>

              {/* Orchard Shop */}
              <Link
                to="/products"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/products' && !location.search
                    ? 'text-[#173D29] font-bold'
                    : 'text-[#2D4536] hover:text-[#173D29]'
                }`}
              >
                Shop
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-semibold text-[#2D4536] hover:text-[#173D29] transition-colors cursor-pointer"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'categories' ? 'rotate-180 text-[#173D29]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Districts Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown('districts')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-semibold text-[#2D4536] hover:text-[#173D29] transition-colors cursor-pointer"
                >
                  <span>Districts</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === 'districts' ? 'rotate-180 text-[#173D29]' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Harvest Blog */}
              <Link
                to="/blogs"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/blogs'
                    ? 'text-[#173D29] font-bold'
                    : 'text-[#2D4536] hover:text-[#173D29]'
                }`}
              >
                Harvest Blog
              </Link>

              {/* Media Studio */}
              <Link
                to="/media-manager"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/media-manager'
                    ? 'text-[#173D29] font-bold'
                    : 'text-[#2D4536] hover:text-[#173D29]'
                }`}
              >
                Media Studio
              </Link>

              {/* Our Story */}
              <Link
                to="/about"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/about'
                    ? 'text-[#173D29] font-bold'
                    : 'text-[#2D4536] hover:text-[#173D29]'
                }`}
              >
                Our Story
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === '/contact'
                    ? 'text-[#173D29] font-bold'
                    : 'text-[#2D4536] hover:text-[#173D29]'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* 3. RIGHT QUICK ACTION ICONS */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 text-[#2C4A35] hover:text-[#173D29] transition-colors cursor-pointer"
                aria-label="Search produce"
              >
                <Search className="w-5 h-5 stroke-[2.2]" />
              </button>

              {/* Auth / Account Profile */}
              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-1 text-[#2C4A35] hover:text-[#173D29] transition-colors"
                  aria-label="Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-[#173D29] text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal({ title: 'Sign In to Your Account' })}
                  className="p-1 text-[#2C4A35] hover:text-[#173D29] transition-colors cursor-pointer"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}

              {/* Wishlist Link with Live Badge */}
              <Link
                to="/wishlist"
                className="p-1 text-[#2C4A35] hover:text-[#173D29] transition-colors relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[2.2]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-[#769C51] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart with Live Dark Badge */}
              <Link
                to="/cart"
                className="p-1 text-[#2C4A35] hover:text-[#173D29] transition-colors relative cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-[#173D29] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsGlobalDrawerOpen(true)}
                className="xl:hidden p-1 text-[#173D29] cursor-pointer ml-1"
                aria-label="Open drawer menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border-light bg-white shadow-lg overflow-hidden"
            >
              <div className="max-w-container mx-auto px-4 py-4 sm:py-5">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Kinnaur apples, cherries, walnuts, raw honey..."
                      className="input-field pl-11 text-sm py-3"
                      autoFocus
                    />
                  </div>
                  <button type="submit" className="btn-primary text-sm px-6">
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Dropdowns */}
      <AnimatePresence>
        {activeDropdown === 'categories' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onMouseEnter={() => setActiveDropdown('categories')}
            onMouseLeave={() => setActiveDropdown(null)}
            className="fixed top-16 lg:top-20 left-0 right-0 bg-white shadow-2xl z-40 border-t border-border-light hidden xl:block"
          >
            <div className="max-w-container mx-auto px-4 py-6">
              <div className="grid grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="group p-3 rounded-2xl hover:bg-background-secondary transition-all text-center"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2.5 bg-background-tertiary shadow-sm">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-0.5">{cat.product_count} products</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeDropdown === 'districts' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onMouseEnter={() => setActiveDropdown('districts')}
            onMouseLeave={() => setActiveDropdown(null)}
            className="fixed top-16 lg:top-20 left-0 right-0 bg-white shadow-2xl z-40 border-t border-border-light hidden xl:block"
          >
            <div className="max-w-container mx-auto px-4 py-6">
              <div className="grid grid-cols-6 gap-4">
                {districts.slice(0, 6).map((district) => (
                  <Link
                    key={district.id}
                    to={`/districts/${district.slug}`}
                    className="group p-3 rounded-2xl hover:bg-background-secondary transition-all"
                  >
                    <div className="aspect-video rounded-xl overflow-hidden mb-2.5 bg-background-tertiary shadow-sm">
                      <img
                        src={district.image}
                        alt={district.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-text-primary group-hover:text-primary transition-colors text-center">
                      {district.name}
                    </h3>
                    <p className="text-xs text-text-tertiary text-center truncate">
                      {district.specialties[0]}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 xl:hidden overflow-y-auto p-5 space-y-5"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  to={link.href}
                  className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                    location.pathname === link.href
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-background-secondary'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-border-light space-y-2">
              <Link
                to="/cart"
                className="flex items-center justify-between p-3 rounded-xl bg-background-secondary text-sm font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" /> Basket
                </span>
                <span className="badge badge-primary">{cartCount} items</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center justify-between p-3 rounded-xl bg-background-secondary text-sm font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent" /> Saved Items
                </span>
                <span className="badge badge-accent">{wishlistCount}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Amazon/Flipkart Style Drawer */}
      <GlobalDrawer
        isOpen={isGlobalDrawerOpen}
        onClose={() => setIsGlobalDrawerOpen(false)}
      />
    </>
  );
}
