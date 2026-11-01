import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Users, Award, Truck, Shield, Sparkles, ArrowRight, MapPin, Calendar, Target } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, value: '50K+', label: 'Happy Customers' },
    { icon: Truck, value: '1L+', label: 'Orders Delivered' },
    { icon: Award, value: '4.9', label: 'Average Rating' },
    { icon: MapPin, value: '12', label: 'Districts Sourced' },
  ];

  const values = [
    { icon: Leaf, title: 'Farm to Table', desc: 'Direct sourcing from farmers ensuring maximum freshness and authentic Himalayan flavor' },
    { icon: Shield, title: 'Sustainable Practices', desc: 'Eco-friendly packaging and support for organic farming in the mountains' },
    { icon: Target, title: 'Community Impact', desc: 'Supporting local farming communities in Himachal Pradesh' },
    { icon: Sparkles, title: 'Quality First', desc: 'Every product is handpicked and quality checked' },
  ];

  const timeline = [
    { year: '2020', title: 'Our Beginning', desc: 'Started with a small team and a big dream' },
    { year: '2021', title: 'First 10K Customers', desc: 'Reached milestone of serving 10,000 happy families' },
    { year: '2022', title: 'Expanded to 12 Districts', desc: 'Sourced produce from all 12 districts of Himachal' },
    { year: '2023', title: '50K+ Customers', desc: 'Became the trusted name for Himalayan produce' },
    { year: '2024', title: 'Award Winning', desc: 'Recognized for excellence in agricultural e-commerce' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" 
            alt="Himalayan mountains" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="max-w-container mx-auto px-4 relative z-10 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold mb-4"
          >
            Our Story
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Bringing the finest Himalayan produce to homes across India since 2020
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 50C120 100 240 100 360 75C480 50 600 25 720 25C840 25 960 50 1080 50C1200 50 1320 25 1440 0V100H0C0 100 0 50 0 50Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-6">
                From Mountains to Your Table
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                HimalayaFresh was born from a simple vision: to bring the authentic flavors of Himachal Pradesh to homes across India. We work directly with local farmers who have been cultivating these lands for generations.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed mb-8">
                Every apple, every grain of rice, every jar of honey tells a story of dedication, tradition, and the unique terroir of the Himalayan region.
              </p>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
              >
                Explore Our Products <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background-secondary p-6 rounded-2xl text-center"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-heading font-bold text-2xl lg:text-3xl text-text-primary">{stat.value}</p>
                  <p className="text-text-tertiary text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-background-secondary">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-4">Our Values</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">What drives us every day to deliver the best Himalayan produce to your doorstep</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                  <value.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-bold text-xl text-text-primary mb-3">{value.title}</h3>
                <p className="text-text-secondary">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary mb-4">Our Journey</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">From humble beginnings to becoming a trusted name in Himalayan produce</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2"></div>

            <div className="space-y-8 lg:space-y-0">
              {timeline.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative lg:flex ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-md inline-block">
                      <div className="flex items-center gap-2 mb-2 lg:justify-end">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-primary font-bold">{item.year}</span>
                      </div>
                      <h3 className="font-heading font-bold text-lg text-text-primary mb-1">{item.title}</h3>
                      <p className="text-text-secondary text-sm">{item.desc}</p>
                    </div>
                  </div>
                  <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" 
            alt="Mountain background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Experience Himalayan Freshness?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who have discovered the authentic taste of the mountains.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-semibold hover:bg-accent-dark transition-all"
            >
              Shop Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}