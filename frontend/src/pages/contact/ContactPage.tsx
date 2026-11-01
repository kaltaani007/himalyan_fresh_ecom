import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Clock, Send, MessageCircle, Headphones, MapPinned, Instagram, Facebook, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: MapPinned, title: 'Visit Us', content: 'Shimla, Himachal Pradesh, India - 171001', color: 'bg-primary' },
    { icon: Phone, title: 'Call Us', content: '+91 98765 43210', color: 'bg-accent' },
    { icon: Mail, title: 'Email Us', content: 'support@himalayafresh.in', color: 'bg-secondary' },
    { icon: Clock, title: 'Working Hours', content: 'Mon-Sat: 9AM - 6PM', color: 'bg-primary' },
  ];

  const quickActions = [
    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with us for instant support', color: 'bg-primary' },
    { icon: Headphones, title: 'Call Support', desc: 'Speak to our team directly', color: 'bg-accent' },
    { icon: MessageCircle, title: 'WhatsApp', desc: 'Quick responses on WhatsApp', color: 'bg-green-500' },
  ];

  const faqs = [
    { q: 'What are your delivery times?', a: 'We deliver within 2-3 days across India. Free shipping on orders above Rs.999.' },
    { q: 'How do I track my order?', a: 'You can track your order using the tracking link sent to your email or SMS.' },
    { q: 'What is your return policy?', a: 'We offer a 7-day return policy for any damaged or quality issues. Contact us for returns.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship only within India. Stay tuned for international shipping updates!' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[300px] lg:h-[400px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" 
            alt="Contact us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="max-w-container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="font-heading text-4xl lg:text-5xl font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            We would love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 50C120 100 240 100 360 75C480 50 600 25 720 25C840 25 960 50 1080 50C1200 50 1320 25 1440 0V100H0C0 100 0 50 0 50Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-text-primary">Send us a Message</h2>
                  <p className="text-text-tertiary text-sm">We'll get back to you within 24 hours</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Subject *</label>
                    <select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm"
                    >
                      <option value="">Select a subject</option>
                      <option value="order">Order Related</option>
                      <option value="product">Product Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Your Message *</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help you..." 
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-4 rounded-xl hover:bg-primary-dark transition-all"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Contact Details */}
              <div className="bg-background-secondary rounded-3xl p-8">
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {contactInfo.map((info, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <info.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-primary">{info.title}</h3>
                        <p className="text-text-secondary text-sm">{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-text-primary mb-4">Follow Us</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-colors">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-primary hover:text-white transition-colors">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:bg-green-500 hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-3 gap-4">
                {quickActions.map((action, i) => (
                  <motion.button 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm">{action.title}</h3>
                    <p className="text-text-tertiary text-xs mt-1">{action.desc}</p>
                  </motion.button>
                ))}
              </div>

              {/* FAQ Preview */}
              <div className="bg-white rounded-3xl p-8 shadow-lg">
                <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">Quick FAQs</h2>
                <div className="space-y-4">
                  {faqs.slice(0, 3).map((faq, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <span className="font-medium text-text-primary text-sm">{faq.q}</span>
                        <span className="transition-transform group-open:rotate-180">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <p className="text-text-tertiary text-sm mt-2">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}