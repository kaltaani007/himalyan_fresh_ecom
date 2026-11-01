import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [activeTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User, href: '/profile' },
    { id: 'orders', label: 'My Orders', icon: Package, href: '/orders' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 mb-8">My Account</h1>
        
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-pine-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-pine-700" />
                </div>
                <h3 className="font-heading font-bold text-charcoal-900">{user?.name || 'Demo User'}</h3>
                <p className="text-sm text-charcoal-500">{user?.email || 'demo@himalayafresh.in'}</p>
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Link key={tab.id} to={tab.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-pine-50 text-pine-700' : 'text-charcoal-600 hover:bg-cream-50'}`}>
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </Link>
                ))}
                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8">
              <h2 className="font-heading font-bold text-xl text-charcoal-900 mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">First Name</label>
                    <input type="text" defaultValue="Demo" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-2">Last Name</label>
                    <input type="text" defaultValue="User" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Email</label>
                  <input type="email" defaultValue="demo@himalayafresh.in" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal-700 mb-2">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="input-field" />
                </div>
                <button className="btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}