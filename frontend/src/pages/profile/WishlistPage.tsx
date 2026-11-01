import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-charcoal-800 mb-2">Your wishlist is empty</h2>
          <p className="text-charcoal-500 mb-6">Save items you love for later.</p>
          <Link to="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-8">My Wishlist ({items.length})</h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-premium group">
              <div className="relative">
                <img src={product.images[0].image} alt={product.name} className="w-full aspect-square object-cover rounded-t-2xl" />
                <button onClick={() => removeItem(product.id)} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-premium-sm hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-charcoal-400 hover:text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-charcoal-800 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-heading font-bold text-pine-700">{formatPrice(product.price)}</span>
                  <div className="flex items-center gap-1"><span className="text-sm">⭐</span><span className="text-sm">{product.rating}</span></div>
                </div>
                <button onClick={() => addToCart(product)} className="w-full py-2 bg-pine-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-pine-800">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}