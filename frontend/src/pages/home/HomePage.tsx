import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Truck,
  Heart,
  ShoppingBag,
  Mountain,
  ChevronRight,
  Quote,
  Leaf,
  Shield,
  CheckCircle2,
  Snowflake,
} from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useDistricts } from '@/hooks/useDistricts';
import { useTestimonials } from '@/hooks/useTestimonials';
import { newsletterApi } from '@/services/api';
import type { Product } from '@/types';
import { useCartStore, useWishlistStore } from '@/store';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { MountainTerrain, AppleVariety } from '@/components/three';
import { HeroInteractiveApple } from '@/components/home/HeroInteractiveApple';
import toast from 'react-hot-toast';
// importing the images 
import himalayanHeroBg from '@/assets/images/homepage/himalayan.png';

export default function HomePage() {
  const [selectedHeroVariety, setSelectedHeroVariety] = useState<AppleVariety>('royal-red');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const { data: featuredData = [] } = useFeaturedProducts();
  const { data: categories = [] } = useCategories();
  const { data: districts = [] } = useDistricts();
  const { data: testimonials = [] } = useTestimonials();

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const featuredProducts = featuredData.slice(0, 4);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart! `, {
      style: {
        background: '#1e4631',
        color: '#ffffff',
        borderRadius: '12px',
        fontWeight: '500',
      },
      iconTheme: {
        primary: '#c8962c',
        secondary: '#1e4631',
      },
    });
  };

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist', { icon: '' });
    } else {
      addToWishlist(product);
      toast.success('Saved to your wishlist! ');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribing(true);
    try {
      const res = await newsletterApi.subscribe(newsletterEmail.trim());
      toast.success(res.data?.message || 'Thank you for subscribing to our harvest dispatch!');
      setNewsletterEmail('');
    } catch {
      toast.error('Could not subscribe right now. Please check your email and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const qualityPromises = [
    {
      icon: Leaf,
      title: '100% Wax-Free Skin',
      desc: 'Completely natural mountain apples with zero synthetic paraffin polish.',
    },
    {
      icon: Shield,
      title: 'Certified Mountain Organic',
      desc: 'Nourished by glacier-fed streams and high-altitude mountain soil.',
    },
    {
      icon: Mountain,
      title: 'Direct from 840+ Orchards',
      desc: 'Fair-trade partnerships with native farmers across Kinnaur and Shimla.',
    },
    {
      icon: Truck,
      title: 'Cold-Chain Express Delivery',
      desc: 'Gentle packaging delivered fresh to major metros in 48 to 72 hours.',
    },
  ];

  const marqueeItems = [
    '100% Wax-Free Apples',
    'Harvested at Dawn',
    'Direct From 840+ Himachal Orchards',
    'Glacier-Fed Soil',
    'Cold-Chain Express Shipping',
    'Zero Chemical Preservatives',
    'Fair Trade to Mountain Communities',
  ];

  return (
    <div className="min-h-screen bg-background-primary overflow-x-hidden">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION WITH SUNLIT HIMALAYAN MOUNTAINS & 3D APPLE
         ───────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] lg:min-h-[98vh] flex items-center text-[#173D29] pt-24 sm:pt-28 lg:pt-32 pb-20 sm:pb-28 overflow-hidden bg-[#EDF3E5] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${himalayanHeroBg})`,
        }}
      >
        {/* Soft daylight gradient overlay for crystal clear typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F7F9F2]/95 via-[#F3F7EC]/70 via-50% to-transparent pointer-events-none" />

        {/* Alpine morning mist & warm mountain sunlight */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#E0EDE0]/50 via-transparent to-white/20 pointer-events-none" />

        <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-10 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* LEFT: Editorial brand hero content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="lg:col-span-6 space-y-6 sm:space-y-7 text-center lg:text-left"
            >
              {/* Harvest Pill Badge */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#D3E0CA] shadow-xs text-xs sm:text-sm font-medium text-[#294B32]"
              >
                <Leaf className="w-3.5 h-3.5 text-[#54823E] fill-[#54823E]" />
                <span>Harvest Season 2024 · Fresh from Himalayas</span>
                <span className="w-2 h-2 rounded-full bg-[#6CA244] animate-pulse ml-0.5" />
              </motion.div>

              {/* Main Heading matching Reference Serif Typography */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-heading text-5xl sm:text-6xl lg:text-[70px] xl:text-[80px] font-bold leading-[1.04] tracking-[-0.03em] text-[#173D29]"
              >
                From The World's{' '}
                <span className="block italic font-normal text-[#275536]">
                  Highest Orchards.
                </span>
              </motion.h1>

              {/* Editorial Description */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="text-base sm:text-lg lg:text-[19px] text-[#4E6750] max-w-xl mx-auto lg:mx-0 leading-[1.75] font-normal"
              >
                Authentic, wax-free Himalayan apples, organic mountain fruits, and
                artisanal produce. Handpicked at dawn and shipped cold-chain
                directly to your doorstep.
              </motion.p>

              {/* 3D Variety Selector Pills */}
              <div className="pt-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#768F71] mb-2.5">
                  Explore 3D Apple Varieties
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {[
                    { id: 'royal-red', label: 'Royal Red' },
                    { id: 'golden', label: 'Golden Delicious' },
                    { id: 'shimla', label: 'Shimla Mountain' },
                    { id: 'fuji', label: 'Fuji Striped' },
                  ].map((variety) => (
                    <button
                      key={variety.id}
                      type="button"
                      onClick={() => setSelectedHeroVariety(variety.id as AppleVariety)}
                      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        selectedHeroVariety === variety.id
                          ? 'bg-[#173D29] text-white shadow-md shadow-[#173D29]/25 scale-[1.03]'
                          : 'bg-white/75 text-[#35513A] border border-[#D4E2CC] hover:bg-[#EAF1E7]'
                      }`}
                    >
                      {variety.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/products"
                  className="rounded-full bg-[#173D29] hover:bg-[#112E1F] text-white px-8 py-4 font-semibold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#173D29]/25 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span>Shop Premium Apples</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/about"
                  className="rounded-full border border-[#173D29]/25 bg-white/70 hover:bg-white/95 backdrop-blur-md px-7 py-4 text-[#173D29] font-semibold text-sm sm:text-base flex items-center gap-2.5 hover:-translate-y-0.5 transition-all duration-300 shadow-xs"
                >
                  <div className="w-5 h-5 rounded-full bg-[#173D29] flex items-center justify-center text-white">
                    <svg className="w-2.5 h-2.5 fill-current ml-0.5" viewBox="0 0 10 12">
                      <polygon points="0,0 10,6 0,12" />
                    </svg>
                  </div>
                  <span>Watch Our Story</span>
                </Link>
              </motion.div>

              {/* Trust Indicators: 4 Columns with Divider Borders */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 pt-7 border-t border-[#C7D9BD]/80"
              >
                {/* 1. 100% Organic */}
                <div className="flex items-center gap-3 sm:pr-4 sm:border-r border-[#C7D9BD]/70">
                  <div className="w-9 h-9 rounded-full bg-white/85 border border-[#D2DEC9] flex items-center justify-center shadow-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E7A38]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1D3E29] leading-tight">100%</p>
                    <p className="text-xs text-[#5D735F] leading-tight mt-0.5">Organic</p>
                  </div>
                </div>

                {/* 2. Cold-Chain Delivery */}
                <div className="flex items-center gap-3 sm:px-4 sm:border-r border-[#C7D9BD]/70">
                  <div className="w-9 h-9 rounded-full bg-white/85 border border-[#D2DEC9] flex items-center justify-center shadow-xs shrink-0">
                    <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E7A38]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1D3E29] leading-tight">Cold-Chain</p>
                    <p className="text-xs text-[#5D735F] leading-tight mt-0.5">Delivery</p>
                  </div>
                </div>

                {/* 3. Farm Fresh Quality */}
                <div className="flex items-center gap-3 sm:px-4 sm:border-r border-[#C7D9BD]/70">
                  <div className="w-9 h-9 rounded-full bg-white/85 border border-[#D2DEC9] flex items-center justify-center shadow-xs shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E7A38]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1D3E29] leading-tight">Farm Fresh</p>
                    <p className="text-xs text-[#5D735F] leading-tight mt-0.5">Quality</p>
                  </div>
                </div>

                {/* 4. Pan-India Shipping */}
                <div className="flex items-center gap-3 sm:pl-4">
                  <div className="w-9 h-9 rounded-full bg-white/85 border border-[#D2DEC9] flex items-center justify-center shadow-xs shrink-0">
                    <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#4E7A38]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1D3E29] leading-tight">Pan-India</p>
                    <p className="text-xs text-[#5D735F] leading-tight mt-0.5">Shipping</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT: Optimal 3D interactive apple showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] sm:min-h-[560px] lg:min-h-[640px]"
            >
              {/* Warm ambient orchard glow behind 3D apple */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#B3D397]/40 via-[#DCE8CE]/25 to-transparent blur-[80px] pointer-events-none" />

              {/* Subtle organic concentric rings */}
              <div className="absolute w-[88%] aspect-square max-w-[540px] rounded-full border border-white/60 pointer-events-none" />
              <div className="absolute w-[75%] aspect-square max-w-[460px] rounded-full border border-[#A7C396]/25 pointer-events-none" />

              {/* Floating Alpine Leaves */}
              <motion.div
                animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-[12%] right-[10%] text-[#618E41]/45 pointer-events-none z-20"
              >
                <Leaf className="w-9 h-9" />
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-[20%] left-[6%] text-[#618E41]/35 pointer-events-none z-20"
              >
                <Leaf className="w-7 h-7" />
              </motion.div>

              {/* Main interactive apple component */}
              <div className="relative z-10 w-full flex items-center justify-center">
                <HeroInteractiveApple
                  variety={selectedHeroVariety}
                  className="!max-w-[520px] drop-shadow-[0_25px_40px_rgba(30,60,30,0.18)]"
                />
              </div>

              {/* Interactive Drag Hint Pill */}
              <div className="absolute bottom-4 z-20 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-xs text-[11px] font-semibold text-[#305238] flex items-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52823C] animate-ping" />
                <span>Drag or hover to rotate in 3D</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom organic terraced rolling hill curve framing the landscape */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-20 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-12 sm:h-16 lg:h-20 text-[#1E432A]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,45 C280,85 520,15 820,55 C1120,85 1300,30 1440,40 L1440,96 L0,96 Z"
              fill="currentColor"
              fillOpacity="0.35"
            />
            <path
              d="M0,65 C320,20 620,80 960,45 C1200,18 1360,55 1440,50 L1440,96 L0,96 Z"
              fill="#1E432A"
            />
          </svg>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          2. INFINITE TICKER / TRUST RIBBON
         ───────────────────────────────────────────────────────────── */}
      <div className="bg-primary text-cream-50 py-3.5 overflow-hidden border-y border-primary-light/40 select-none">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx} className="font-medium text-xs sm:text-sm tracking-wider uppercase text-cream-100 flex items-center gap-2">
              <span className="text-accent">{item.split(' ')[0]}</span>
              <span>{item.substring(item.indexOf(' ') + 1)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. OUR QUALITY PROMISE (Amber Tale Farms Reference Style)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-background-secondary">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge badge-primary mb-3">Purity &amp; Heritage</span>
            <h2 className="section-title">The Himalayan Standard</h2>
            <p className="section-subtitle mx-auto">
              Cultivated in pristine altitudes above 2,200 meters. We preserve traditional orchard heritage without artificial ripening or chemical coating.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityPromises.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading font-bold text-xl text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. FEATURED BEST-SELLING PRODUCE
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <span className="badge badge-accent mb-2">Fresh Harvest</span>
              <h2 className="section-title">This Season’s Best Picks</h2>
              <p className="text-text-secondary text-base mt-2">
                Hand-harvested in Kinnaur, Kullu, and Shimla valley orchards.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors"
            >
              <span>View All 24 Varieties</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                {/* Product Image Frame */}
                <div className="relative aspect-square overflow-hidden bg-background-tertiary">
                  <img
                    src={product.images[0]?.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {product.is_featured && <span className="badge badge-primary">Premium</span>}
                    {product.is_seasonal && <span className="badge badge-accent">Seasonal</span>}
                  </div>
                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-red-500 shadow-sm transition-all"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>
                  {/* Origin Terroir Pill */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-text-primary shadow-sm">
                    📍 {product.origin} Valley
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-2">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="font-bold text-text-primary">{product.rating}</span>
                      <span>({product.review_count})</span>
                      <span className="mx-1 text-text-light">•</span>
                      <span>{product.weight}</span>
                    </div>

                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading font-bold text-lg text-text-primary hover:text-primary transition-colors line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-border-light flex items-center justify-between">
                    <PriceDisplay price={product.price} originalPrice={product.original_price} size="md" />

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-md active:scale-95"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. BENTO CATEGORIES SHOWCASE
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-background-secondary">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge badge-primary mb-3">Mountain Pantry</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle mx-auto">
              Pure mountain produce harvested from natural forests, high valley orchards, and traditional bee apiaries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-border-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-background-tertiary">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-tertiary mt-1">
                      {cat.product_count} items
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. DISTRICT TERROIR SHOWCASE WITH 3D MOUNTAIN BACKDROP
         ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#0d1710] text-white relative overflow-hidden">
        {/* 3D Mountain Terrain Rig */}
        <MountainTerrain />

        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge badge-accent mb-3">Terroir Directory</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Sourced Across 12 Districts
            </h2>
            <p className="text-cream-200/80 text-base mt-3">
              Each Himalayan valley offers distinct soil profiles, microclimates, and altitudes that give native produce its unique sweetness and crunch.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {districts.slice(0, 8).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/districts/${d.slug}`}
                  className="group block relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-accent/40 shadow-xl transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1710] via-black/40 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono text-cream-100">
                      {d.altitude}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-xl text-white group-hover:text-accent transition-colors">
                      {d.name} Valley
                    </h3>
                    <p className="text-xs text-cream-200/70 mt-1 line-clamp-2">
                      Famous for: {d.specialties.join(', ')}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-accent font-semibold">
                      <span>Explore Terroir</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/districts" className="btn-accent px-8 py-3.5 text-sm font-bold">
              View All 12 Himalayan Districts
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. VERIFIED CUSTOMER REVIEWS
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="badge badge-primary mb-3">Happy Homes</span>
            <h2 className="section-title">Loved Across India</h2>
            <p className="section-subtitle mx-auto">
              Over 50,000 households enjoy fresh seasonal produce delivered straight from Himachal orchards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-background-secondary border border-border-light shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-text-secondary text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3.5 pt-4 border-t border-border-light">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-primary"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-text-primary">{t.name}</h4>
                    <p className="text-xs text-text-tertiary">
                      {t.location} • Verified Buyer ({t.product})
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. HARVEST DISPATCH NEWSLETTER
         ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-5">
            <Mountain className="w-12 h-12 text-accent mx-auto" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
              Get the Himalayan Harvest Dispatch
            </h2>
            <p className="text-cream-100/90 text-sm sm:text-base leading-relaxed">
              Receive notifications when seasonal Royal Apples, Kinnaur Walnuts, and high-altitude honey batches are harvested.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="input-field bg-white text-text-primary px-4 py-3 rounded-xl flex-1 focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="btn-accent px-6 py-3 rounded-xl font-bold disabled:opacity-60"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p className="text-xs text-cream-200/70">
              Zero spam. Unsubscribe anytime with 1 click.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
