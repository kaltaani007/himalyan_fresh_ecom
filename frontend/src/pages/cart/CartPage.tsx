import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-charcoal-300 mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-charcoal-800 mb-2">Your cart is empty</h2>
          <p className="text-charcoal-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="btn-primary inline-flex">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-8">Shopping Cart ({items.length})</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-4 flex gap-4">
                <img src={item.product.images[0].image} alt={item.product.name} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <Link to={`/products/${item.product.slug}`} className="font-heading font-bold text-charcoal-800 hover:text-pine-700">{item.product.name}</Link>
                  <p className="text-sm text-charcoal-500 mb-2">{item.product.weight}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-charcoal-200 rounded-lg">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-2 hover:bg-cream-50"><Minus className="w-4 h-4" /></button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-2 hover:bg-cream-50"><Plus className="w-4 h-4" /></button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-pine-700">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} className="self-start p-2 text-charcoal-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading font-bold text-xl text-charcoal-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between"><span className="text-charcoal-500">Subtotal</span><span className="font-medium">{formatPrice(getTotal())}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Shipping</span><span className="font-medium text-green-600">Free</span></div>
                <div className="border-t border-charcoal-100 pt-4 flex justify-between"><span className="font-bold text-charcoal-900">Total</span><span className="font-heading font-bold text-xl text-pine-700">{formatPrice(getTotal())}</span></div>
              </div>
              <Link to="/checkout" className="w-full btn-primary flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="block text-center mt-4 text-pine-700 font-medium">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}