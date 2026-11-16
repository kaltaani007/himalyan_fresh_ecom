import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  Truck,
  Award,
  Heart,
  ShoppingBag,
  Sparkles,
  Mountain,
  ChevronRight,
  Quote,
  Leaf,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { products, categories, districts } from '@/data';
import { useCartStore, useWishlistStore } from '@/store';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { MountainTerrain, AppleVariety } from '@/components/three';
import { HeroInteractiveApple } from '@/components/home/HeroInteractiveApple';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [selectedHeroVariety, setSelectedHeroVariety] = useState<AppleVariety>('royal-red');
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 4);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart! 🍎`, {
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

  const handleWishlistToggle = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist', { icon: '' });
    } else {
      addToWishlist(product);
      toast.success('Saved to your wishlist! ');
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

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      product: 'Royal Red Delicious',
      text: 'The Kinnaur apples were crisp, juicy, and completely wax-free. You can immediately smell the fresh mountain orchard aroma the moment you open the box.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
    },
    {
      name: 'Dr. Rajeev Mehra',
      location: 'Delhi NCR',
      rating: 5,
      product: 'Alpine Cherries',
      text: 'Incredible authenticity. These taste like the fresh cherries we had during our road trip to Kullu valley. Prompt 2-day delivery and flawless packaging.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    },
    {
      name: 'Anita Gupta',
      location: 'Bangalore',
      rating: 5,
      product: 'Kinnaur Black Walnuts',
      text: 'The black walnuts are so rich in omega-3 oil and taste far superior to commercial imported nuts. So happy to support Himalayan farmers directly.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop',
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
          1. HERO SECTION WITH 3D ORCHARD CANVAS
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] lg:min-h-[96vh] flex items-center bg-gradient-to-b from-[#0f1f14] via-[#14281b] to-[#1a3323] text-white pt-20 pb-16 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Typography & CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 space-y-6 text-center lg:text-left"
            >
              {/* Alpine Terroir Pill */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cream-50"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Harvest Season 2024 · Kinnaur & Shimla Orchards</span>
              </motion.div>

              {/* Main Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-white">
                From The World’s
                <span className="block italic text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent-light to-cream-50">
                  Highest Orchards
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-cream-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Authentic, wax-free Himalayan apples, organic mountain fruits, and artisanal produce. Handpicked at dawn and shipped cold-chain directly to your doorstep.
              </p>

              {/* 3D Variety Switcher Pills */}
              <div className="pt-2">
                <p className="text-xs font-mono uppercase tracking-wider text-cream-200/80 mb-3">
                  Inspect 3D Variety Model:
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {[
                    { id: 'royal-red', label: 'Royal Red Delicious' },
                    { id: 'golden', label: 'Golden Delicious' },
                    { id: 'shimla', label: 'Shimla Mountain' },
                    { id: 'fuji', label: 'Fuji Striped' },
                  ].map((variety) => (
                    <button
                      key={variety.id}
                      type="button"
                      onClick={() => setSelectedHeroVariety(variety.id as AppleVariety)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        selectedHeroVariety === variety.id
                          ? 'bg-accent text-white shadow-md scale-105'
                          : 'bg-white/10 hover:bg-white/20 text-cream-50 border border-white/15'
                      }`}
                    >
                      {variety.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <Link to="/products" className="btn-accent px-7 py-3.5 text-base flex items-center gap-2">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/districts"
                  className="btn-ghost px-6 py-3.5 text-base text-white hover:text-accent flex items-center gap-2"
                >
                  <Mountain className="w-4 h-4 text-accent" />
                  <span>Explore 12 Districts</span>
                </Link>
              </div>

              {/* Trust Micro-bar */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/15 text-xs text-cream-200/90 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                  <span>100% Wax-Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-accent shrink-0" />
                  <span>Free delivery &gt; ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent shrink-0" />
                  <span>4.9 / 5 Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive 3D / Frame Sequence with Cursor Movements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <HeroInteractiveApple variety={selectedHeroVariety} />
            </motion.div>
          </div>
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
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Thank you for subscribing to our harvest dispatch!');
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="input-field bg-white text-text-primary px-4 py-3 rounded-xl flex-1 focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="btn-accent px-6 py-3 rounded-xl font-bold">
                Subscribe
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
