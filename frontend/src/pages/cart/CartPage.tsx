import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getDiscount,
    getFinalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getTotal();
  const discount = getDiscount();
  const finalTotal = getFinalTotal();
  const freeShippingThreshold = 999;
  const freeShippingDifference = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      toast.success(res.message);
      setCouponInput('');
    } else {
      toast.error(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] bg-background-secondary py-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-text-primary mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            Looks like you haven’t added any fresh Himalayan harvest yet. Explore our Royal Apples and organic produce!
          </p>
          <Link to="/products" className="btn-primary text-base px-8 py-3.5 shadow-lg">
            <span>Explore Produce</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary py-10 lg:py-16">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="badge badge-primary mb-1">Your Basket</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <button
            onClick={() => {
              clearCart();
              toast('Cart cleared', { icon: '🗑️' });
            }}
            className="text-xs text-text-tertiary hover:text-red-600 transition-colors cursor-pointer"
          >
            Clear all items
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white rounded-2xl p-4 border border-border-light shadow-sm mb-8">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accent" />
              {freeShippingDifference === 0
                ? 'Congratulations! You unlocked Free Mountain Express Shipping.'
                : `Add ${formatPrice(freeShippingDifference)} more for FREE Express Delivery`}
            </span>
            <span className="text-primary">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-background-tertiary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Line Items */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-border-light shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.product.images[0]?.image}
                      alt={item.product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-background-tertiary shrink-0"
                    />
                    <div className="space-y-1">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-heading font-bold text-base sm:text-lg text-text-primary hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-text-tertiary">
                        📍 {item.product.origin} Valley • {item.product.weight}
                      </p>
                      <p className="text-xs text-primary font-semibold">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border-light">
                    <QuantityStepper
                      quantity={item.quantity}
                      onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
                      onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
                      size="sm"
                    />

                    <span className="font-heading font-bold text-lg text-primary min-w-[5rem] text-right">
                      {formatPrice(item.price * item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-text-tertiary hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-border-light shadow-lg sticky top-24 space-y-6">
              <h2 className="font-heading font-bold text-2xl text-text-primary">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div className="pt-2 border-t border-border-light">
                {appliedCoupon ? (
                  <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-primary flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {appliedCoupon.code}
                      </span>
                      <span className="text-text-secondary">{appliedCoupon.description}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-text-tertiary hover:text-red-500 cursor-pointer"
                      title="Remove coupon"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. HIMALAYA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="input-field text-xs uppercase py-2.5 flex-1"
                    />
                    <button type="submit" className="btn-secondary text-xs px-4 py-2.5">
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-3 pt-2 text-sm text-text-secondary border-t border-border-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({appliedCoupon.discountPercent}%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-700">
                    {freeShippingDifference === 0 ? 'FREE' : '₹99'}
                  </span>
                </div>

                <div className="pt-3 border-t border-border-light flex justify-between items-baseline">
                  <span className="font-heading font-bold text-lg text-text-primary">Final Total</span>
                  <span className="font-heading font-bold text-2xl text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <Link to="/checkout" className="btn-primary w-full py-4 text-base shadow-lg">
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-text-tertiary pt-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
