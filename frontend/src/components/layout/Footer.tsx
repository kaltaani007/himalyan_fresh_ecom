
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Truck,
  Leaf,
  MessageCircle,
  Clock,
  ArrowUpRight,
  ArrowRight,
  Mountain,
  Heart,
} from 'lucide-react';

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
      { label: 'Press & Media', href: '/about' },
    ],
    support: [
      { label: 'FAQs', href: '/contact' },
      { label: 'Shipping Information', href: '/contact' },
      { label: 'Returns & Refunds', href: '/contact' },
      { label: 'Track Your Order', href: '/orders' },
      { label: 'Privacy Policy', href: '/about' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'WhatsApp' },
  ];

  const benefits = [
    {
      icon: Truck,
      title: 'Farm Fresh Delivery',
      desc: 'Freshness at your doorstep',
    },
    {
      icon: Leaf,
      title: 'Naturally Grown',
      desc: 'Quality you can trust',
    },
    {
      icon: Mountain,
      title: 'From 12 Districts',
      desc: 'Straight from Himachal',
    },
    {
      icon: Heart,
      title: 'Farmer First',
      desc: 'Supporting local growers',
    },
  ];

  const FooterLink = ({ item }: { item: { label: string; href: string } }) => (
    <li>
      <Link
        to={item.href}
        className="group inline-flex items-center gap-1 text-sm text-[#AAB9AB] hover:text-[#E3C78D] transition-colors duration-300"
      >
        <span>{item.label}</span>
        <ArrowUpRight
          size={13}
          className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
        />
      </Link>
    </li>
  );

  return (
    <footer className="relative overflow-hidden bg-[#0B1B12] text-white">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-32 w-[450px] h-[450px] rounded-full bg-[#285C3E]/10 blur-[110px]" />
        <div className="absolute bottom-0 -left-40 w-[350px] h-[350px] rounded-full bg-[#A8874D]/[0.06] blur-[100px]" />
      </div>

      {/* Newsletter */}
      <section className="relative border-b border-white/[0.08]">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-14 lg:py-16">

          <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#1C4730] via-[#173B29] to-[#102C1D] border border-[#62866A]/20 px-7 py-10 lg:px-14 lg:py-12">

            <div className="absolute -right-12 -top-24 w-72 h-72 rounded-full border border-white/[0.06]" />
            <div className="absolute -right-4 -top-16 w-56 h-56 rounded-full border border-white/[0.06]" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-9">

              <div className="flex items-start gap-5">
                <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 border border-white/10 items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#E3C78D]" />
                </div>

                <div>
                  <span className="text-[#D5B779] text-xs font-bold uppercase tracking-[0.2em]">
                    A little freshness in your inbox
                  </span>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold mt-2 mb-2 text-white">
                    Stay Close to Nature.
                  </h3>

                  <p className="text-[#C1D1C2] text-sm sm:text-base">
                    Get farm stories, seasonal harvests and exclusive offers.
                  </p>
                </div>
              </div>

              <form
                className="flex flex-col sm:flex-row gap-3 w-full lg:max-w-[470px]"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className="min-w-0 flex-1 px-5 py-4 rounded-xl bg-[#0B2418]/60 border border-white/15 text-white placeholder:text-[#91A596] outline-none focus:border-[#D5B779] focus:ring-2 focus:ring-[#D5B779]/20 transition-all text-sm"
                />

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#D5B779] text-[#173B29] font-bold text-sm hover:bg-[#E8D09F] transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Subscribe
                  <ArrowRight size={17} />
                </button>
              </form>

            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="relative max-w-[1500px] mx-auto px-5 sm:px-8 py-16 lg:py-20">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.85fr_0.85fr_0.9fr_1.15fr] gap-12 lg:gap-10">

          {/* Brand */}
          <div>

            <Link to="/" className="inline-flex items-center gap-3 mb-7 group">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#326849] to-[#173B29] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <span className="font-heading text-xl font-black text-white">
                  HF
                </span>
              </div>

              <div>
                <div className="font-heading text-[23px] font-bold leading-none">
                  Himalaya<span className="text-[#D5B779]">Fresh</span>
                </div>
                <p className="text-[9px] text-[#A8BCA9] uppercase tracking-[0.35em] mt-1.5">
                  Nature's Finest Harvest
                </p>
              </div>
            </Link>

            <p className="text-[#AAB9AB] text-sm leading-7 max-w-xs mb-7">
              Bringing the pure goodness of Himachal Pradesh to your home.
              Fresh apples, organic produce and authentic Himalayan flavours,
              straight from local farms.
            </p>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.07] flex items-center justify-center text-[#B5C6B6] hover:bg-[#D5B779] hover:text-[#102C1D] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading font-bold text-base mb-7 text-white">
              Explore Shop
              <span className="block w-8 h-[2px] bg-[#D5B779] mt-3" />
            </h4>

            <ul className="space-y-4">
              {footerSections.shop.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold text-base mb-7 text-white">
              Our Company
              <span className="block w-8 h-[2px] bg-[#D5B779] mt-3" />
            </h4>

            <ul className="space-y-4">
              {footerSections.company.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-bold text-base mb-7 text-white">
              Customer Care
              <span className="block w-8 h-[2px] bg-[#D5B779] mt-3" />
            </h4>

            <ul className="space-y-4">
              {footerSections.support.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-base mb-7 text-white">
              Get In Touch
              <span className="block w-8 h-[2px] bg-[#D5B779] mt-3" />
            </h4>

            <ul className="space-y-5">

              <li className="flex items-start gap-3">
                <MapPin size={19} className="text-[#D5B779] shrink-0 mt-0.5" />
                <span className="text-sm text-[#AAB9AB] leading-6">
                  Shimla, Himachal Pradesh
                  <br />
                  India - 171001
                </span>
              </li>

              <li>
                <a href="tel:+919876543210" className="flex items-center gap-3 text-sm text-[#AAB9AB] hover:text-[#D5B779] transition-colors">
                  <Phone size={18} className="text-[#D5B779] shrink-0" />
                  +91 98765 43210
                </a>
              </li>

              <li>
                <a href="mailto:support@himalayafresh.in" className="flex items-center gap-3 text-sm text-[#AAB9AB] hover:text-[#D5B779] transition-colors break-all">
                  <Mail size={18} className="text-[#D5B779] shrink-0" />
                  support@himalayafresh.in
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Clock size={18} className="text-[#D5B779] shrink-0" />
                <span className="text-sm text-[#AAB9AB]">
                  Mon - Sat: 9 AM - 6 PM
                </span>
              </li>

            </ul>
          </div>

        </div>
      </section>

      {/* Trust Benefits */}
      <section className="relative border-y border-white/[0.08] bg-white/[0.025]">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-9">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">

                <div className="w-12 h-12 rounded-2xl bg-[#1B3827] border border-[#426448]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D5B779] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#D5B779] group-hover:text-[#173B29] transition-colors" />
                </div>

                <div>
                  <h5 className="text-white font-bold text-sm mb-1">
                    {title}
                  </h5>
                  <p className="text-[#839789] text-xs">
                    {desc}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Copyright */}
      <section className="relative">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 py-7">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <p className="text-[#819386] text-xs text-center md:text-left">
              © {currentYear} <span className="text-white font-semibold">HimalayaFresh</span>.
              Made with <Heart size={12} className="inline text-[#D5B779] mx-1 fill-[#D5B779]" /> in Himachal Pradesh.
            </p>

            <div className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              <Link to="/about" className="text-xs text-[#819386] hover:text-[#D5B779] transition-colors">
                Privacy Policy
              </Link>

              <Link to="/about" className="text-xs text-[#819386] hover:text-[#D5B779] transition-colors">
                Terms of Service
              </Link>

              <Link to="/about" className="text-xs text-[#819386] hover:text-[#D5B779] transition-colors">
                Refund Policy
              </Link>
            </div>

          </div>
        </div>
      </section>

    </footer>
  );
}
