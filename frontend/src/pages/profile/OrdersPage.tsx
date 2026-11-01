import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const orders = [
  { id: 1, order_number: 'HF-2024-001', date: '2024-12-15', total: 1299, status: 'delivered', items: 3 },
  { id: 2, order_number: 'HF-2024-002', date: '2024-12-10', total: 599, status: 'shipped', items: 2 },
  { id: 3, order_number: 'HF-2024-003', date: '2024-12-05', total: 899, status: 'processing', items: 1 },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-8">My Orders</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-charcoal-900">{order.order_number}</h3>
                  <p className="text-sm text-charcoal-500">{order.date} • {order.items} items</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-heading font-bold text-pine-700">Rs. {order.total}</p>
                <Link to={`/orders/${order.order_number}`} className="flex items-center gap-2 text-pine-700 font-medium hover:gap-3 transition-all">
                  View Details <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}