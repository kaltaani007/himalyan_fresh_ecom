import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Truck, Leaf, MessageCircle, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    shop: [
      { label: 'All Products', href: '/products' },
      { label: 'Fresh Apples', href: '/products?category=apples' },
      { label: 'Organic Range', href: '/products?category=organic' },
      { label: 'Dry Fruits', href: '/products?category=dry-fruits' },
      { label: 'Vegetables', href: '/products?category=vegetables' },
      { label: 'Honey & Preserves', href: '/products?category=honey' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/about' },
      { label: 'Press', href: '/about' },
    ],
    support: [
      { label: 'FAQs', href: '/contact' },
      { label: 'Shipping Info', href: '/contact' },
      { label: 'Returns & Refunds', href: '/contact' },
      { label: 'Track Order', href: '/orders' },
      { label: 'Privacy Policy', href: '/about' },
      { label: 'Terms of Service', href: '/about' },
    ],
    connect: [
      { label: 'Instagram', href: '#', icon: Instagram },
      { label: 'Facebook', href: '#', icon: Facebook },
      { label: 'Twitter', href: '#', icon: Twitter },
      { label: 'WhatsApp', href: '#', icon: MessageCircle },
    ],
  };

  return (
    <footer className="bg-background-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary-light" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-white">Subscribe to our Newsletter</h3>
                <p className="text-gray-400 text-sm">Get fresh updates and exclusive offers</p>
              </div>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary w-full md:w-64 text-sm"
              />
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand & About */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">HF</span>
              </div>
              <span className="font-heading font-bold text-xl">
                <span className="text-white">Himalaya</span>
                <span className="text-primary-light">Fresh</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed text-sm">
              Premium apples and organic produce straight from the farms of Himachal Pradesh. 
              We deliver farm-fresh quality right to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-3">
              {footerSections.shop.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerSections.company.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-heading font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-3">
              {footerSections.support.slice(0, 5).map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h4 className="font-heading font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Shimla, HP<br />India - 171001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-light flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-light flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@himalayafresh.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary-light flex-shrink-0" />
                <span className="text-gray-400 text-sm">Mon-Sat: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above Rs.999' },
              { icon: Leaf, title: '100% Organic', desc: 'Certified products' },
              { icon: MapPin, title: '12 Districts', desc: 'Direct from farmers' },
              { icon: Phone, title: '24/7 Support', desc: 'Dedicated assistance' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-light" />
                </div>
                <div>
                  <h4 className="font-medium text-white text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {currentYear} HimalayaFresh. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/about" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}