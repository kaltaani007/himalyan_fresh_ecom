import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center gap-2 text-charcoal-500 hover:text-pine-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6">
              <h2 className="font-heading font-bold text-xl text-charcoal-900 mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="input-field" />
                  <input type="text" placeholder="Last Name" className="input-field" />
                </div>
                <input type="text" placeholder="Address" className="input-field" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="City" className="input-field" />
                  <input type="text" placeholder="State" className="input-field" />
                  <input type="text" placeholder="PIN Code" className="input-field" />
                </div>
                <input type="tel" placeholder="Phone Number" className="input-field" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6">
              <h2 className="font-heading font-bold text-xl text-charcoal-900 mb-6">Payment Method</h2>
              <div className="space-y-3">
                {['Credit/Debit Card', 'UPI', 'Cash on Delivery', 'Net Banking'].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-4 border border-charcoal-200 rounded-xl cursor-pointer hover:border-pine-500">
                    <input type="radio" name="payment" className="w-4 h-4 text-pine-700" />
                    <span className="font-medium text-charcoal-800">{method}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading font-bold text-xl text-charcoal-900 mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.product.images[0].image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-charcoal-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-sm text-charcoal-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 border-t border-charcoal-100 pt-4 mb-6">
                <div className="flex justify-between"><span className="text-charcoal-500">Subtotal</span><span>{formatPrice(getTotal())}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Shipping</span><span className="text-green-600">Free</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-pine-700">{formatPrice(getTotal())}</span></div>
              </div>
              <button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50">
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}