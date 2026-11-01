import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Award, Clock, Heart, ShoppingBag, Sparkles, Mountain, ChevronRight, Quote, Leaf, Shield } from 'lucide-react';
import { products, categories, blogs, districts } from '@/data';
import { formatPrice } from '@/lib/utils';

const addToCart = (product: any) => {
  alert(`Added ${product.name} to cart!`);
};

const handleWishlist = (product: any) => console.log('Wishlist:', product.name);

export default function HomePage() {
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  const qualityPromises = [
    { icon: Leaf, title: '100% Wax Free', desc: 'Natural apples without any artificial processing' },
    { icon: Shield, title: 'Certified Organic', desc: 'Grown using sustainable farming practices' },
    { icon: Mountain, title: 'Direct from Farms', desc: 'Sourced directly from Himachal farmers' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Fresh delivery within 2-3 days' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'The Kinnaur apples were incredibly fresh and sweet. Best online produce I have ever bought!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    { name: 'Raj Mehra', location: 'Delhi', rating: 5, text: 'Amazing quality! The Himachal cherries were a hit with my family. Will definitely order again.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    { name: 'Anita Gupta', location: 'Bangalore', rating: 5, text: 'Finally found authentic Himalayan produce. The organic vegetables were farm-fresh!', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean & Elegant */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="Himalayan mountains" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        <div className="max-w-container mx-auto px-4 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-white">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-accent-yellow" />
                Farm Fresh Daily
              </motion.div>
              
              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Premium Apples
                <span className="block text-primary-light mt-2">From The Himalayas</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
                Experience the authentic flavor of premium apples grown with care in the pristine foothills of the Himalayas, where tradition meets sustainable farming.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/products" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all hover:-translate-y-1 shadow-lg">
                  Shop Collection
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products?category=apples" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-white">
                  View Varieties
                </Link>
              </div>

              <div className="flex items-center gap-8 text-gray-400">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary-light" />
                  <span>Free delivery above Rs.999</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-primary-light" />
                  <span>100% Organic Certified</span>
                </div>
              </div>
            </motion.div>

            {/* Product Card */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block">
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop" alt="Premium apples" className="w-full aspect-square object-cover rounded-3xl shadow-2xl" />
                
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Award className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-gray-900 text-lg">Premium Quality</p>
                      <p className="text-gray-500 text-sm">100% Organic</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-lg">
                  25% OFF
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 50C120 100 240 100 360 75C480 50 600 25 720 25C840 25 960 50 1080 50C1200 50 1320 25 1440 0V100H0C0 100 0 50 0 50Z" fill="#ffffff"/>
          </svg>
        </div>
      </section>

      {/* Quality Promise Section - Like ambertalefarms */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-primary">Our Quality Promise</h2>
            <p className="text-text-secondary mt-3 text-lg">Every apple reflects our commitment to purity, tradition, and excellence</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityPromises.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary transition-colors">
                  <item.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-text-primary mb-3">{item.title}</h3>
                <p className="text-text-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-4xl font-bold text-text-primary">Our Best Selling Apples</h2>
              <p className="text-text-secondary mt-2 text-lg">Hand-picked from our orchards every morning</p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark mt-4 md:mt-0">
              View All Varieties <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={product.images[0].image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {product.is_featured && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Premium</span>}
                      {product.is_seasonal && <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">Seasonal</span>}
                    </div>
                    <button onClick={() => handleWishlist(product)} className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-sm font-medium text-text-secondary">{product.rating} ({product.review_count} reviews)</span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-text-primary mb-2">{product.name}</h3>
                    <p className="text-primary text-sm font-medium mb-3">{product.origin}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-heading text-xl font-bold text-text-primary">{formatPrice(product.price)}</span>
                        {product.original_price && <span className="text-sm text-text-light line-through ml-2">{formatPrice(product.original_price)}</span>}
                      </div>
                      <button onClick={() => addToCart(product)} className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white hover:bg-primary-dark transition-colors shadow-lg">
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-primary">Explore Categories</h2>
            <p className="text-text-secondary mt-3 text-lg">From the orchards of the hills to your home</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/products?category=${cat.slug}`} className="group block">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary text-center group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-text-tertiary text-center text-sm">{cat.product_count} products</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Districts Section */}
      <section className="py-20 bg-background-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80" alt="Mountain landscape" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-background-dark/90"></div>
        </div>
        
        <div className="max-w-container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-white">From All 12 Districts</h2>
            <p className="text-gray-400 mt-3 text-lg">Each region brings its unique flavors & specialties</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {districts.slice(0, 8).map((district, i) => (
              <motion.div key={district.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/districts/${district.slug}`} className="group block relative rounded-2xl overflow-hidden shadow-xl">
                  <img src={district.image} alt={district.name} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-bold text-white text-lg">{district.name}</h3>
                    <p className="text-gray-400 text-sm">{district.specialties.slice(0, 2).join(', ')}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/districts" className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all">
              Explore All Districts <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-text-primary">Fresh From Our Happy Customers</h2>
            <p className="text-text-secondary mt-3 text-lg">Join thousands of satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-background-secondary p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-text-secondary mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary" />
                  <div>
                    <p className="font-heading font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-text-tertiary text-sm">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-4xl font-bold text-text-primary">From Our Blog</h2>
              <p className="text-text-secondary mt-2 text-lg">Stories of Himalayan farming & traditions</p>
            </div>
            <Link to="/blogs" className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark mt-4 md:mt-0">
              Read All Posts <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, i) => (
              <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/blogs/${blog.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                  <div className="aspect-video overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-text-tertiary mb-3">
                      <span className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full">{blog.category.name}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.read_time} min read</span>
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-text-primary group-hover:text-primary transition-colors mb-3">{blog.title}</h3>
                    <p className="text-text-secondary line-clamp-2">{blog.summary}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80" alt="Mountain background" className="w-full h-full object-cover opacity-10" />
        </div>
        
        <div className="max-w-container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Mountain className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="font-heading text-4xl font-bold text-white mb-4">Stay Fresh With Our Updates</h2>
            <p className="text-white/80 mb-8 text-lg">Get seasonal variety updates, harvest news, and exclusive offers delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 px-6 py-4 rounded-xl bg-white text-text-primary focus:outline-none focus:ring-4 focus:ring-white/20" />
              <button type="submit" className="px-8 py-4 bg-accent text-white font-bold rounded-xl hover:bg-accent-dark transition-colors shadow-lg">
                Subscribe
              </button>
            </form>
            <p className="text-white/60 text-sm mt-4">Join 12,000+ subscribers. No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}