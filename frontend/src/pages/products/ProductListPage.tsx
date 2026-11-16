import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Grid, List, Star, ShoppingBag, Heart, X, RotateCcw } from 'lucide-react';
import { products, categories } from '@/data';
import { useCartStore, useWishlistStore } from '@/store';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import toast from 'react-hot-toast';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  let filteredProducts = [...products];

  if (categoryParam) {
    filteredProducts = filteredProducts.filter((p) => p.category_slug === categoryParam);
  }
  if (searchParam) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        p.description.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  filteredProducts = filteredProducts.filter(
    (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  switch (sortBy) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const selectedCategory = categories.find((c) => c.slug === categoryParam);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
    toast.success(`Added ${product.name} to cart! 🍎`, {
      style: {
        background: '#1e4631',
        color: '#ffffff',
        borderRadius: '12px',
      },
    });
  };

  const handleWishlistToggle = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast('Removed from wishlist', { icon: '🤍' });
    } else {
      addToWishlist(product);
      toast.success('Saved to wishlist! ❤️');
    }
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange([0, 2000]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-background-secondary py-8 lg:py-12">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="badge badge-primary mb-2">Himalayan Harvest</span>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
              {selectedCategory
                ? selectedCategory.name
                : searchParam
                ? `Search: "${searchParam}"`
                : 'All Mountain Produce'}
            </h1>
            <p className="text-text-secondary mt-1 text-sm">
              Showing {filteredProducts.length} authentic farm items from Himachal Pradesh
            </p>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Category: {selectedCategory?.name}
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('category');
                    setSearchParams(next);
                  }}
                  className="hover:text-primary-dark"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent-dark text-xs font-semibold">
                Query: "{searchParam}"
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete('search');
                    setSearchParams(next);
                  }}
                  className="hover:text-accent-dark"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {(categoryParam || searchParam) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-text-tertiary hover:text-primary flex items-center gap-1 underline ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-border-light shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/products"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !categoryParam
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-background-tertiary text-text-secondary hover:text-text-primary'
              }`}
            >
              All Items
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  categoryParam === cat.slug
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-background-tertiary text-text-secondary hover:text-text-primary'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort & View Mode Controls */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-medium border border-border-medium rounded-xl px-3 py-2 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>

            <div className="hidden sm:flex items-center border border-border-medium rounded-xl overflow-hidden p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-tertiary hover:text-text-primary'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-text-tertiary hover:text-text-primary'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            PRODUCT GRID / LIST VIEW
           ───────────────────────────────────────────────────────────── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-border-light shadow-sm">
            <ShoppingBag className="w-12 h-12 text-text-light mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
              No matching produce found
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
              Try adjusting your search criteria or resetting filters to browse our seasonal harvest.
            </p>
            <button onClick={clearAllFilters} className="btn-primary">
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-square overflow-hidden bg-background-tertiary">
                  <img
                    src={product.images[0]?.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.is_featured && <span className="badge badge-primary">Premium</span>}
                    {product.is_seasonal && <span className="badge badge-accent">Seasonal</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleWishlistToggle(product)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-red-500 shadow-sm transition-all cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-text-primary shadow-sm">
                    📍 {product.origin} Valley
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-2">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                      <span className="font-bold text-text-primary">{product.rating}</span>
                      <span>({product.review_count})</span>
                      <span className="mx-1 text-text-light">•</span>
                      <span>{product.weight}</span>
                    </div>

                    <Link to={`/products/${product.slug}`}>
                      <h3 className="font-heading font-bold text-lg text-text-primary hover:text-primary transition-colors line-clamp-1 mb-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-light flex items-center justify-between">
                    <PriceDisplay price={product.price} originalPrice={product.original_price} size="md" />

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all shadow-md active:scale-95 cursor-pointer"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                className="bg-white rounded-2xl p-5 border border-border-light shadow-sm flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden bg-background-tertiary shrink-0">
                  <img src={product.images[0]?.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary text-[10px]">📍 {product.origin} Valley</span>
                    <span className="text-xs text-text-tertiary">{product.weight}</span>
                  </div>
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="font-heading font-bold text-xl text-text-primary hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="font-bold text-text-primary">{product.rating}</span>
                    <span>({product.review_count} reviews)</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0">
                  <PriceDisplay price={product.price} originalPrice={product.original_price} size="lg" />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleWishlistToggle(product)}
                      className="p-2.5 rounded-xl border border-border-medium hover:bg-background-tertiary cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-text-secondary'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="btn-primary py-2.5 px-5 text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
