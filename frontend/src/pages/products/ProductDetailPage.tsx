import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Leaf,
  Sparkles,
  MapPin,
  ImageIcon,
} from 'lucide-react';
import { useProductBySlug, useRelatedProducts } from '@/hooks/useProducts';
import { useCartStore, useWishlistStore } from '@/store';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { AppleVarietiesShowcase, AppleVariety } from '@/components/three';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug = '' } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'photos'>('photos');

  const { data: product, isLoading, isError } = useProductBySlug(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(slug);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-secondary py-16">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-6 aspect-square bg-white rounded-3xl" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-8 bg-white rounded-xl w-3/4" />
            <div className="h-6 bg-white rounded-xl w-1/3" />
            <div className="h-32 bg-white rounded-xl w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background-secondary py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-text-primary mb-3">Product not found</h2>
        <Link to="/products" className="btn-primary inline-flex">Back to Orchard Shop</Link>
      </div>
    );
  }

  const reviews = product.reviews || [];

  // Map product slug to 3D variety
  const getVarietyFromSlug = (itemSlug: string): AppleVariety => {
    if (itemSlug.includes('golden')) return 'golden';
    if (itemSlug.includes('cherry')) return 'cherry';
    if (itemSlug.includes('walnut')) return 'walnut';
    if (itemSlug.includes('shimla')) return 'shimla';
    if (itemSlug.includes('fuji')) return 'fuji';
    return 'royal-red';
  };

  const activeVariety = getVarietyFromSlug(product.slug);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} × ${product.name} to cart! 🍎`, {
      style: {
        background: '#1e4631',
        color: '#ffffff',
        borderRadius: '12px',
      },
    });
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist', { icon: '🤍' });
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist! ❤️');
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-tertiary mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Orchard Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_slug}`} className="hover:text-primary transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium line-clamp-1">{product.name}</span>
        </nav>

        {/* ─────────────────────────────────────────────────────────────
            MAIN PRODUCT SECTION (2-COL)
           ───────────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
          {/* Left Column: Interactive 3D Turntable or Photo Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* View Mode Switcher Pill */}
            <div className="flex items-center justify-between bg-white p-1.5 rounded-2xl border border-border-light shadow-sm">
              <span className="text-xs font-semibold px-3 text-text-secondary">
                Product Visualization:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>3D Interactive</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('photos')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'photos'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Photo Gallery</span>
                </button>
              </div>
            </div>

            {/* Display Canvas or Gallery */}
            {viewMode === '3d' ? (
              <AppleVarietiesShowcase
                variety={activeVariety}
                originDistrict={`${product.origin} Valley`}
                altitude={product.farm_info?.altitude || '2,750m ASL'}
              />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-md border border-border-light">
                  <img
                    src={product.images[selectedImage]?.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Thumbnails */}
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === idx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={img.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Meta, Pricing, Purchase actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge badge-primary">✦ 100% Wax-Free</span>
                <span className="badge badge-accent">📍 {product.origin} Valley</span>
                {product.is_seasonal && <span className="badge badge-terroir">Autumn Harvest</span>}
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="font-bold text-text-primary">{product.rating}</span>
                </div>
                <span className="text-text-tertiary">({product.review_count} verified buyer reviews)</span>
                <span className="text-text-light">•</span>
                <span className="text-emerald-700 font-medium">In Stock (Dispatched within 48h)</span>
              </div>

              {/* Price */}
              <div className="pt-2">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.original_price}
                  size="xl"
                />
                <p className="text-xs text-text-tertiary mt-1">
                  Inclusive of all taxes. Free shipping on orders above ₹999.
                </p>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-base leading-relaxed pt-2">
                {product.full_description || product.description}
              </p>

              {/* Terroir & Origin Card */}
              <div className="bg-white rounded-2xl p-5 border border-border-light shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-text-tertiary block mb-1">Valley Origin:</span>
                  <span className="font-bold text-text-primary text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {product.origin}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Peak Altitude:</span>
                  <span className="font-bold text-text-primary text-sm font-mono">
                    {product.farm_info?.altitude || '2,750m ASL'}
                  </span>
                </div>
                <div>
                  <span className="text-text-tertiary block mb-1">Farming Standard:</span>
                  <span className="font-bold text-text-primary text-sm">
                    {product.farm_info?.farming_method || 'Glacier-Fed Organic'}
                  </span>
                </div>
              </div>

              {/* Nutrition Breakdown */}
              {product.nutrition_info && (
                <div className="bg-white rounded-2xl p-5 border border-border-light shadow-sm">
                  <h3 className="font-heading font-bold text-sm text-text-primary mb-3">
                    Nutritional Highlights (per 100g)
                  </h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-background-secondary p-2.5 rounded-xl">
                      <span className="font-bold text-primary text-base block">{product.nutrition_info.calories}</span>
                      <span className="text-text-tertiary">Calories</span>
                    </div>
                    <div className="bg-background-secondary p-2.5 rounded-xl">
                      <span className="font-bold text-primary text-base block">{product.nutrition_info.fiber}g</span>
                      <span className="text-text-tertiary">Dietary Fiber</span>
                    </div>
                    <div className="bg-background-secondary p-2.5 rounded-xl">
                      <span className="font-bold text-primary text-base block">{product.nutrition_info.vitamin_c}mg</span>
                      <span className="text-text-tertiary">Vitamin C</span>
                    </div>
                    <div className="bg-background-secondary p-2.5 rounded-xl">
                      <span className="font-bold text-primary text-base block">{product.nutrition_info.carbs}g</span>
                      <span className="text-text-tertiary">Carbs</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper & Add to Cart Controls */}
            <div className="space-y-4 pt-4 border-t border-border-light">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <QuantityStepper
                  quantity={quantity}
                  onIncrement={() => setQuantity((q) => q + 1)}
                  onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                  size="lg"
                />

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-base shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart ({quantity} × ₹{product.price})</span>
                </button>

                <button
                  type="button"
                  onClick={handleWishlist}
                  className="p-4 rounded-xl border border-border-medium bg-white hover:bg-background-tertiary transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-text-secondary'
                    }`}
                  />
                </button>
              </div>

              {/* Trust Features Strip */}
              <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs text-text-tertiary">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Cold-Chain 48h Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Safe Transit Guarantee</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span>Eco-Cushion Packaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CUSTOMER REVIEWS & TESTIMONIAL SECTION
           ───────────────────────────────────────────────────────────── */}
        <section className="mb-20 pt-10 border-t border-border-light">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="badge badge-primary mb-2">Verified Purchases</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                Customer Reviews
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-6 border border-border-light shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={rev.user.avatar}
                    alt={rev.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary text-sm">{rev.user.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-3">"{rev.comment}"</p>
                <p className="text-[11px] text-text-light">{rev.created_at}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            RELATED PRODUCE
           ───────────────────────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-border-light">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-8">
              More from {product.category.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.slug}`}
                  className="card group overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-square bg-background-tertiary overflow-hidden">
                    <img
                      src={rel.images[0]?.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1 mb-1">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-text-tertiary mb-3">📍 {rel.origin} Valley</p>
                    <PriceDisplay price={rel.price} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
