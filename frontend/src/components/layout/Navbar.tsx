import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { categories, districts } from '@/data';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    { label: 'Shop', href: '/products' },
    { label: 'Categories', href: '/products', hasDropdown: true, dropdownType: 'categories' },
    { label: 'Districts', href: '/districts', hasDropdown: true, dropdownType: 'districts' },
    { label: 'Blog', href: '/blogs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                <span className="text-white font-bold text-lg lg:text-xl">HF</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-bold text-lg lg:text-xl text-primary-dark">Himalaya</span>
                <span className="font-heading font-bold text-lg lg:text-xl text-primary">Fresh</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <div key={link.href + link.label} className="relative px-3 py-2">
                  {link.hasDropdown ? (
                    <button
                      onMouseEnter={() => setActiveDropdown(link.dropdownType || null)}
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="flex items-center gap-1.5 py-2 text-sm font-medium text-text-primary hover:text-primary transition-colors"
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === link.dropdownType ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link to={link.href} className={`px-3 py-2 text-sm font-medium transition-colors ${location.pathname === link.href ? 'text-primary' : 'text-text-primary hover:text-primary'}`}>
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-text-primary" />
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors relative" aria-label="Wishlist">
                <Heart className="w-5 h-5 text-text-primary" />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="p-2.5 rounded-xl hover:bg-background-secondary transition-colors relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5 text-text-primary" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">0</span>
              </Link>

              {/* Sign In */}
              <Link 
                to="/login" 
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="xl:hidden p-2.5 rounded-xl hover:bg-background-secondary transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-text-primary" /> : <Menu className="w-5 h-5 text-text-primary" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 bg-white"
            >
              <div className="max-w-container mx-auto px-4 py-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      placeholder="Search apples, fruits, organic produce..." 
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
                      autoFocus
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors text-sm"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Dropdown Menus */}
      <AnimatePresence>
        {activeDropdown === 'categories' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setActiveDropdown('categories')} 
            onMouseLeave={() => setActiveDropdown(null)}
            className="fixed top-16 lg:top-20 left-0 right-0 bg-white shadow-xl z-40 border-t border-gray-100 hidden xl:block"
          >
            <div className="max-w-container mx-auto px-4 py-6">
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/products?category=${cat.slug}`} 
                    className="group p-3 rounded-xl hover:bg-background-secondary transition-all"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-text-primary group-hover:text-primary text-center">{cat.name}</h3>
                    <p className="text-xs text-text-tertiary text-center">{cat.product_count} products</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeDropdown === 'districts' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            onMouseEnter={() => setActiveDropdown('districts')} 
            onMouseLeave={() => setActiveDropdown(null)}
            className="fixed top-16 lg:top-20 left-0 right-0 bg-white shadow-xl z-40 border-t border-gray-100 hidden xl:block"
          >
            <div className="max-w-container mx-auto px-4 py-6">
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {districts.slice(0, 6).map((district) => (
                  <Link 
                    key={district.id} 
                    to={`/districts/${district.slug}`} 
                    className="group p-3 rounded-xl hover:bg-background-secondary transition-all"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                      <img src={district.image} alt={district.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-text-primary group-hover:text-primary text-center">{district.name}</h3>
                    <p className="text-xs text-text-tertiary text-center">{district.specialties[0]}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bottom-0 bg-white z-40 xl:hidden overflow-y-auto"
          >
            <nav className="p-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href + link.label} 
                    to={link.href} 
                    className={`block py-3 px-4 rounded-xl font-medium transition-colors ${location.pathname === link.href ? 'bg-primary text-white' : 'text-text-primary hover:bg-background-secondary'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-gray-100 mt-4 pt-4">
                <Link 
                  to="/cart" 
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-text-primary font-medium hover:bg-background-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5" /> 
                  Cart <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">0</span>
                </Link>
                <Link 
                  to="/wishlist" 
                  className="flex items-center gap-3 py-3 px-4 rounded-xl text-text-primary font-medium hover:bg-background-secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-primary text-white font-medium rounded-xl mt-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" /> Sign In
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}