import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { categories, districts } from '@/data';
import { useCartStore, useWishlistStore, useAuthStore } from '@/store';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();

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

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Orchard Shop', href: '/products' },
    { label: 'Categories', href: '/products', hasDropdown: true, dropdownType: 'categories' },
    { label: 'Districts', href: '/districts', hasDropdown: true, dropdownType: 'districts' },
    { label: 'Harvest Blog', href: '/blogs' },
    { label: 'Our Story', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-border-light'
            : 'bg-white/90 backdrop-blur-sm border-b border-border-light/60'
        }`}
      >
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Emblem */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg font-heading">HF</span>
              </div>
              <div className="leading-tight">
                <span className="font-heading font-bold text-lg sm:text-xl text-primary block">
                  Himalaya
                </span>
                <span className="font-heading font-bold text-lg sm:text-xl text-text-primary block">
                  Fresh
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => (
                <div key={link.href + link.label} className="relative px-2 py-2">
                  {link.hasDropdown ? (
                    <button
                      type="button"
                      onMouseEnter={() => setActiveDropdown(link.dropdownType || null)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="flex items-center gap-1 py-1.5 px-3 text-sm font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === link.dropdownType ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                        location.pathname === link.href
                          ? 'text-primary bg-primary/5'
                          : 'text-text-primary hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Quick Actions (Search, Wishlist, Cart, Profile) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl hover:bg-background-tertiary transition-colors text-text-secondary hover:text-primary cursor-pointer"
                aria-label="Search produce"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link with Live Badge */}
              <Link
                to="/wishlist"
                className="p-2.5 rounded-xl hover:bg-background-tertiary transition-colors text-text-secondary hover:text-primary relative cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Link with Live Badge */}
              <Link
                to="/cart"
                className="p-2.5 rounded-xl hover:bg-background-tertiary transition-colors text-text-secondary hover:text-primary relative cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth / Account Profile */}
              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/15 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] truncate">{user.name}</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2.5 rounded-xl hover:bg-background-tertiary transition-colors text-text-primary cursor-pointer"
                aria-label="Toggle navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
    </>
  );
}
