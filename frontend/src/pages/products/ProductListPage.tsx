import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Star, ShoppingBag, Heart, X } from 'lucide-react';
import { products, categories } from '@/data';
import { useCartStore, useWishlistStore } from '@/store';
import { cn, formatPrice } from '@/lib/utils';

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  let filteredProducts = [...products];

  if (categoryParam) {
    filteredProducts = filteredProducts.filter(p => p.category_slug === categoryParam);
  }
  if (searchParam) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
      p.description.toLowerCase().includes(searchParam.toLowerCase())
    );
  }

  filteredProducts = filteredProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

  switch (sortBy) {
    case 'price-low': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'rating': filteredProducts.sort((a, b) => b.rating - a.rating); break;
    default: filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const selectedCategory = categories.find(c => c.slug === categoryParam);

  const handleWishlist = (product: typeof products[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-900">
            {selectedCategory ? selectedCategory.name : searchParam ? `Search: "${searchParam}"` : 'All Products'}
          </h1>
          <p className="text-charcoal-500 mt-2">{filteredProducts.length} products found</p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("fixed lg:static inset-0 z-50 lg:z-auto lg:block w-80 lg:w-64 bg-white lg:bg-transparent p-6 lg:p-0", showFilters ? "block" : "hidden")}
          >
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="font-heading font-bold text-xl">Filters</h2>
              <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-charcoal-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  <Link to="/products" className={cn("block py-2 px-3 rounded-lg hover:bg-cream-50", !categoryParam && "bg-pine-50 text-pine-700 font-medium")}>All Products</Link>
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/products?category=${cat.slug}`} className={cn("block py-2 px-3 rounded-lg hover:bg-cream-50", categoryParam === cat.slug && "bg-pine-50 text-pine-700 font-medium")}>
                      {cat.name} <span className="text-charcoal-400 text-sm">({cat.product_count})</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-charcoal-100 pt-6">
                <h3 className="font-semibold text-charcoal-800 mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input type="range" min="0" max="2000" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full" />
                  <div className="flex justify-between text-sm text-charcoal-500">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-charcoal-200">
                <Filter className="w-4 h-4" /> Filters
              </button>
              <div className="flex items-center gap-4">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 bg-white rounded-xl border border-charcoal-200">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
                <div className="hidden sm:flex bg-white rounded-xl border border-charcoal-200 p-1">
                  <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-lg", viewMode === 'grid' && "bg-pine-50 text-pine-700")}><Grid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-lg", viewMode === 'list' && "bg-pine-50 text-pine-700")}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className={cn("grid gap-6", viewMode === 'grid' ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1")}>
              {filteredProducts.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn("group", viewMode === 'list' && "flex gap-6")}>
                  <div className={cn("card-premium relative overflow-hidden", viewMode === 'list' ? "w-64 flex-shrink-0" : "w-full")}>
                    <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                      {product.is_featured && <span className="badge badge-pine">Featured</span>}
                      {product.original_price && <span className="px-2 py-1 bg-accent text-white rounded-full text-xs">{Math.round((1 - product.price / product.original_price) * 100)}%</span>}
                    </div>
                    <button onClick={() => handleWishlist(product)} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white shadow-premium-sm hover:bg-pine-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Heart className={cn("w-5 h-5", isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-charcoal-400")} />
                    </button>
                    <Link to={`/products/${product.slug}`}>
                      <div className={cn("overflow-hidden", viewMode === 'list' ? "aspect-square" : "aspect-square")}>
                        <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </Link>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => addToCart(product)} className="w-full py-2 bg-pine-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-pine-800">
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1">
                    <p className="text-xs text-charcoal-500 mb-1">{product.origin}</p>
                    <Link to={`/products/${product.slug}`}><h3 className="font-heading font-bold text-charcoal-800 mb-2 line-clamp-2 hover:text-pine-700">{product.name}</h3></Link>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /><span className="text-sm font-medium">{product.rating}</span></div>
                      <span className="text-sm text-charcoal-400">({product.review_count})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-xl text-pine-700">{formatPrice(product.price)}</span>
                        {product.original_price && <span className="text-sm text-charcoal-400 line-through">{formatPrice(product.original_price)}</span>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-charcoal-500 text-lg">No products found matching your criteria.</p>
                <Link to="/products" className="mt-4 inline-block text-pine-700 font-medium">Clear filters</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}