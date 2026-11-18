import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  Printer,
  ChevronRight,
} from 'lucide-react';
import AccountSidebar from '@/components/sidebar/profile/SideBar';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderRecord {
  id: number | string;
  order_number: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered';
  items: number;
  itemsList?: OrderItem[];
  shippingAddress?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
  deliveryMethod?: string;
  paymentMethod?: string;
}

const DEFAULT_ORDERS: OrderRecord[] = [
  {
    id: 1,
    order_number: 'HF-2024-001',
    date: '2024-12-15',
    total: 1299,
    status: 'delivered',
    items: 3,
    itemsList: [
      { name: 'Kinnaur Royal Red Apples (2kg Box)', quantity: 1, price: 599 },
      { name: 'Organic Mountain Raw Honey (500g)', quantity: 1, price: 450 },
      { name: 'Himalayan Herbal Green Tea (100g)', quantity: 1, price: 250 },
    ],
    shippingAddress: {
      name: 'Priya Sharma',
      address: '402, Highridge Towers, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '+91 98765 43210',
    },
    deliveryMethod: 'Cold-Chain Express',
    paymentMethod: 'UPI (Google Pay)',
  },
  {
    id: 2,
    order_number: 'HF-2024-002',
    date: '2024-12-10',
    total: 599,
    status: 'shipped',
    items: 2,
    itemsList: [
      { name: 'Golden Delicious Organic Apples (1kg)', quantity: 2, price: 299 },
    ],
    deliveryMethod: 'Cold-Chain Express',
    paymentMethod: 'Credit Card',
  },
  {
    id: 3,
    order_number: 'HF-2024-003',
    date: '2024-12-05',
    total: 899,
    status: 'processing',
    items: 1,
    itemsList: [
      { name: 'Kinnaur Cold-Cracked Black Walnuts (500g)', quantity: 1, price: 899 },
    ],
    deliveryMethod: 'Next-Flight Air Express',
    paymentMethod: 'Cash on Delivery',
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('hf_user_orders') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        setOrders([...local, ...DEFAULT_ORDERS]);
      } else {
        setOrders(DEFAULT_ORDERS);
      }
    } catch {
      setOrders(DEFAULT_ORDERS);
    }
  }, []);

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF5] py-10 sm:py-14">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#173D29]">
              My Orders &amp; Dispatches
            </h1>
            <p className="text-xs sm:text-sm text-[#6C8170] mt-1">
              Track tree-to-doorstep cold chain logistics across Himachal &amp; Pan-India
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">
          <AccountSidebar />

          <div className="space-y-4 lg:col-span-3">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-[#EEF2EC]">
                <Package className="w-12 h-12 text-[#3D7A4F] mx-auto mb-3" />
                <h3 className="font-heading font-bold text-lg text-[#173D29]">No Orders Yet</h3>
                <p className="text-xs text-[#6C8170] mt-1">
                  You haven't placed an orchard harvest order yet.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF2EC] shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#173D29]">
                          {order.order_number}
                        </h3>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#F2F6F1] text-[#3D7A4F] font-mono font-semibold">
                          Verified Harvest
                        </span>
                      </div>
                      <p className="text-sm text-[#6C8170] mt-0.5">
                        {order.date} • {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold capitalize self-start sm:self-auto ${
                        order.status === 'delivered'
                          ? 'bg-[#E7F6E9] text-[#206935]'
                          : order.status === 'shipped'
                          ? 'bg-[#E6F0FA] text-[#1E5699]'
                          : 'bg-[#FFF6E3] text-[#9A6D14]'
                      }`}
                    >
                      {order.status === 'delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {order.status === 'shipped' && <Truck className="w-3.5 h-3.5" />}
                      {order.status === 'processing' && <Clock className="w-3.5 h-3.5 animate-spin" />}
                      <span>{order.status}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F2F6F0]">
                    <div>
                      <span className="text-xs text-[#6C8170] block">Total Amount</span>
                      <p className="font-heading font-bold text-lg text-[#173D29]">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#173D29] hover:text-[#103B24] hover:gap-2.5 transition-all cursor-pointer bg-[#F2F6F1] hover:bg-[#E2ECE0] px-4 py-2 rounded-xl"
                    >
                      <span>View Details &amp; Tracking</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Order Details & Live Tracking Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#EEF2EC] my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="absolute right-5 top-5 w-8 h-8 rounded-full bg-[#F2F6F1] hover:bg-[#E2ECE0] flex items-center justify-center text-[#244632] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#EEF2EC]">
                <div>
                  <span className="text-xs font-semibold text-[#3D7A4F] uppercase tracking-wider">
                    Orchard Shipment Details
                  </span>
                  <h2 className="font-heading font-bold text-2xl text-[#173D29] mt-0.5">
                    {selectedOrder.order_number}
                  </h2>
                  <p className="text-xs text-[#6C8170] mt-1">Placed on {selectedOrder.date}</p>
                </div>

                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="mr-10 flex items-center gap-1.5 text-xs font-semibold text-[#173D29] border border-[#DCE6DA] hover:bg-[#F2F6F1] px-3 py-1.5 rounded-xl cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>

              {/* Live Cold-Chain Tracking Stages */}
              <div className="mb-6 bg-[#F8FAF5] rounded-2xl p-4 sm:p-5 border border-[#E2ECE0]">
                <h4 className="text-xs font-bold text-[#173D29] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#3D7A4F]" />
                  <span>Cold-Chain Transit Timeline</span>
                </h4>

                <div className="grid grid-cols-4 gap-2 text-center text-[11px] relative">
                  {[
                    { label: 'Order Placed', done: true },
                    { label: 'Harvested', done: true },
                    { label: 'In Transit (4°C)', done: selectedOrder.status !== 'processing' },
                    { label: 'Delivered', done: selectedOrder.status === 'delivered' },
                  ].map((stage, idx) => (
                    <div key={stage.label} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 ${
                          stage.done ? 'bg-[#173D29] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {stage.done ? '✓' : idx + 1}
                      </div>
                      <span className={`font-semibold ${stage.done ? 'text-[#173D29]' : 'text-gray-400'}`}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ordered Items */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-[#173D29] uppercase tracking-wider mb-3">
                  Harvest Items
                </h4>

                <div className="divide-y divide-[#F2F6F0]">
                  {selectedOrder.itemsList ? (
                    selectedOrder.itemsList.map((item, i) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#EAF1E7] flex items-center justify-center text-sm">
                            🍎
                          </div>
                          <div>
                            <p className="font-semibold text-[#173D29]">{item.name}</p>
                            <span className="text-[11px] text-[#6C8170]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#173D29]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#6C8170] py-2">{selectedOrder.items} organic harvest items</p>
                  )}
                </div>
              </div>

              {/* Summary & Shipping Info */}
              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#EEF2EC] text-xs">
                {selectedOrder.shippingAddress && (
                  <div className="space-y-1">
                    <span className="font-bold text-[#173D29] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#3D7A4F]" /> Delivery Address
                    </span>
                    <p className="font-semibold text-gray-800">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-gray-600">{selectedOrder.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                    {selectedOrder.shippingAddress.phone && (
                      <p className="text-gray-600">Phone: {selectedOrder.shippingAddress.phone}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2 bg-[#F8FAF5] p-3.5 rounded-xl border border-[#E2ECE0]">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-semibold text-gray-800">{selectedOrder.paymentMethod || 'Online'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transit:</span>
                    <span className="font-semibold text-gray-800">{selectedOrder.deliveryMethod || 'Cold-Chain Express'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E2ECE0] text-sm">
                    <span className="font-bold text-[#173D29]">Total Paid:</span>
                    <span className="font-bold text-[#173D29]">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
