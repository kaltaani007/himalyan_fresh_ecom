import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import AccountSidebar from '@/components/sidebar/profile/SideBar';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  return (
    <div className="min-h-screen bg-[#F8FAF5] py-10 sm:py-14">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#173D29] mb-8">
          My Wishlist ({items.length})
        </h1>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <AccountSidebar />

          <div className="lg:col-span-3">
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EEF2EC] shadow-xs">
                <Heart className="w-16 h-16 text-[#A0B5A4] mx-auto mb-4 stroke-[1.5]" />
                <h2 className="font-heading text-2xl font-bold text-[#173D29] mb-2">
                  Your wishlist is empty
                </h2>
                <p className="text-[#5E7363] mb-6 text-sm">
                  Save your favorite mountain apples and dry fruits for quick ordering.
                </p>
                <Link
                  to="/products"
                  className="rounded-full bg-[#173D29] hover:bg-[#112E1F] text-white px-7 py-3 font-semibold text-sm shadow-md shadow-[#173D29]/20 transition-all inline-flex"
                >
                  Browse Mountain Produce
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-premium group bg-white rounded-3xl border border-[#EEF2EC] overflow-hidden shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="relative">
                      <img
                        src={product.images?.[0]?.image || ''}
                        alt={product.name}
                        className="w-full aspect-square object-cover"
                      />
                      <button
                        onClick={() => removeItem(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-xs hover:bg-red-50 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 text-[#728B77] hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-base text-[#173D29] mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-heading font-bold text-lg text-[#173D29]">
                          {formatPrice(product.price)}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold text-[#54755A]">
                          <span>★</span>
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2.5 bg-[#173D29] hover:bg-[#112E1F] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}