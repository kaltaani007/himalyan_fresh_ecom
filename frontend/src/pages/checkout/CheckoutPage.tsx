import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  CreditCard,
  Truck,
  MapPin,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { trackEvent } from '@/lib/analytics';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal, getDiscount, getFinalTotal, appliedCoupon, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15-minute stock reservation countdown

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Himachal Pradesh',
    pincode: '',
    deliveryMethod: 'express',
    paymentMethod: 'card',
  });

  // 15-minute countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const subtotal = getTotal();
  const discount = getDiscount();
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const finalTotal = getFinalTotal() + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.firstName || !formData.address || !formData.pincode || !formData.phone) {
        toast.error('Please fill in all required shipping address fields');
        return;
      }
      trackEvent({ type: 'checkout_step', step: 2, stepName: 'Delivery Options', cartTotal: finalTotal });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      trackEvent({ type: 'checkout_step', step: 3, stepName: 'Payment Method', cartTotal: finalTotal });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Final Order Placement
      setIsProcessing(true);
      setTimeout(() => {
        const orderNumber = `HF-${Date.now().toString().slice(-6)}`;
        trackEvent({
          type: 'order_placed',
          orderNumber,
          total: finalTotal,
          paymentMethod: formData.paymentMethod,
        });

        clearCart();
        setIsProcessing(false);
        toast.success(`Order #${orderNumber} placed successfully! 🏔️`, {
          duration: 5000,
        });
        navigate('/orders');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary py-10 lg:py-16">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-tertiary hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Basket
        </Link>

        {/* Header with Stock Reservation Timer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary">
              Checkout &amp; Cold-Chain Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Direct from high-altitude Himachal orchards to your table
            </p>
          </div>

          {/* 15-min countdown pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-sm">
            <Clock className="w-4 h-4 text-accent" />
            <span>Produce reserved for:</span>
            <span className="font-mono font-bold text-sm text-accent-dark">{formattedTime}</span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3-STEP PROGRESS STEPPER
           ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-4 border border-border-light shadow-sm mb-10 max-w-3xl mx-auto flex items-center justify-between">
          {[
            { step: 1, title: 'Shipping Address', icon: MapPin },
            { step: 2, title: 'Delivery Method', icon: Truck },
            { step: 3, title: 'Secure Payment', icon: Lock },
          ].map((s, idx) => (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                  currentStep >= s.step ? 'text-primary' : 'text-text-tertiary'
                }`}
                onClick={() => {
                  if (currentStep > s.step) setCurrentStep(s.step as any);
                }}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep >= s.step
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-background-tertiary text-text-tertiary'
                  }`}
                >
                  {s.step}
                </div>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-3 sm:mx-6 ${
                    currentStep > s.step ? 'bg-primary' : 'bg-border-light'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ─────────────────────────────────────────────────────────────
            CHECKOUT FORM & SUMMARY (2-COL)
           ───────────────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Area */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-border-light shadow-sm">
            <form onSubmit={handleStepSubmit} className="space-y-6">
              {/* STEP 1: SHIPPING ADDRESS */}
              {currentStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="font-heading font-bold text-2xl text-text-primary">
                    1. Shipping &amp; Recipient Information
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="e.g. Priya"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="e.g. Sharma"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="priya@example.com"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Contact Phone (for SMS updates) *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Street Address &amp; House/Apt No. *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 402, Highridge Towers, Bandra West"
                      className="input-field text-sm"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400050"
                        className="input-field text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button type="submit" className="btn-primary px-8">
                      Continue to Delivery
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: DELIVERY METHOD */}
              {currentStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="font-heading font-bold text-2xl text-text-primary">
                    2. Select Transit &amp; Packaging Method
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border border-border-medium rounded-2xl cursor-pointer hover:border-primary transition-all">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={formData.deliveryMethod === 'express'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-sm text-text-primary block">
                          Cold-Chain Mountain Express (2-3 Business Days)
                        </span>
                        <span className="text-xs text-text-secondary">
                          Eco-cushioned insulated box maintaining 4°C tree freshness.
                        </span>
                      </div>
                      <span className="font-bold text-sm text-primary">
                        {subtotal >= 999 ? 'FREE' : '₹99'}
                      </span>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-border-medium rounded-2xl cursor-pointer hover:border-primary transition-all">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="air"
                        checked={formData.deliveryMethod === 'air'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex-1">
                        <span className="font-bold text-sm text-text-primary block">
                          Next-Flight Air Express (24-48 Hours)
                        </span>
                        <span className="text-xs text-text-secondary">
                          Direct air dispatch from Shimla / Chandigarh hubs.
                        </span>
                      </div>
                      <span className="font-bold text-sm text-text-primary">+₹199</span>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="btn-secondary text-xs"
                    >
                      Back to Address
                    </button>
                    <button type="submit" className="btn-primary px-8">
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {currentStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <h2 className="font-heading font-bold text-2xl text-text-primary">
                    3. Secure Payment Gateway
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-4 border border-border-medium rounded-2xl cursor-pointer hover:border-primary transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <span className="font-bold text-sm text-text-primary block">
                          Credit / Debit Card (Stripe Encrypted)
                        </span>
                        <span className="text-xs text-text-secondary">
                          Visa, Mastercard, RuPay, Amex accepted.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-border-medium rounded-2xl cursor-pointer hover:border-primary transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={formData.paymentMethod === 'upi'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <Sparkles className="w-5 h-5 text-accent" />
                      <div className="flex-1">
                        <span className="font-bold text-sm text-text-primary block">
                          UPI / Net Banking (Razorpay Instant)
                        </span>
                        <span className="text-xs text-text-secondary">
                          Google Pay, PhonePe, Paytm, BHIM or direct Net Banking.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-4 p-4 border border-border-medium rounded-2xl cursor-pointer hover:border-primary transition-all">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary"
                      />
                      <Truck className="w-5 h-5 text-text-tertiary" />
                      <div className="flex-1">
                        <span className="font-bold text-sm text-text-primary block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-xs text-text-secondary">
                          Pay upon delivery inspection.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="btn-secondary text-xs"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="btn-accent px-9 py-3.5 text-base shadow-xl"
                    >
                      {isProcessing ? 'Confirming Order...' : `Pay & Confirm ${formatPrice(finalTotal)}`}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-border-light shadow-lg sticky top-24 space-y-6">
            <h3 className="font-heading font-bold text-xl text-text-primary">
              Order Review ({items.length} items)
            </h3>

            {/* Line items list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images[0]?.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-background-tertiary shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text-primary truncate">{item.product.name}</p>
                    <p className="text-text-tertiary">
                      Qty: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-bold text-text-primary">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="pt-4 border-t border-border-light space-y-2 text-xs text-text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-text-primary">{formatPrice(subtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="pt-3 border-t border-border-light flex justify-between items-baseline text-sm">
                <span className="font-heading font-bold text-text-primary">Amount Payable</span>
                <span className="font-heading font-bold text-xl text-primary">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-background-secondary border border-border-light text-[11px] text-text-tertiary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Free returns on damaged fresh produce within 24 hours of delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
