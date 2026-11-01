import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Truck, Shield, Leaf, Minus, Plus } from 'lucide-react';
import { products, reviews } from '@/data';
import { useCartStore, useWishlistStore } from '@/store';
import { cn, formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const product = products.find(p => p.slug === slug) || products[0];
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const relatedProducts = products.filter(p => p.category_slug === product.category_slug && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="max-w-container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-charcoal-500 mb-8">
          <Link to="/" className="hover:text-pine-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-pine-700">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category_slug}`} className="hover:text-pine-700">{product.category.name}</Link>
          <span>/</span>
          <span className="text-charcoal-800">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="aspect-square rounded-3xl overflow-hidden mb-4 bg-white shadow-premium-sm">
              <img src={product.images[selectedImage].image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={cn("w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors", selectedImage === i ? "border-pine-700" : "border-transparent")}>
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.badges.map((badge, i) => (
                  <span key={i} className="badge badge-pine">{badge}</span>
                ))}
              </div>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold text-charcoal-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 fill-accent text-accent" /><span className="font-semibold">{product.rating}</span></div>
                  <span className="text-charcoal-400">({product.review_count} reviews)</span>
                </div>
                <span className="text-charcoal-300">|</span>
                <span className="text-charcoal-500">{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-heading font-bold text-4xl text-pine-700">{formatPrice(product.price)}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-charcoal-400 line-through">{formatPrice(product.original_price)}</span>
                  <span className="px-3 py-1 bg-accent text-white rounded-full text-sm font-medium">{Math.round((1 - product.price / product.original_price) * 100)}% OFF</span>
                </>
              )}
            </div>

            <p className="text-charcoal-600 leading-relaxed">{product.description}</p>

            {product.farm_info && (
              <div className="bg-pine-50 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-charcoal-800 mb-4">Farm Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-charcoal-500">Farmer:</span> <span className="text-charcoal-800 font-medium">{product.farm_info.farmer_name}</span></div>
                  <div><span className="text-charcoal-500">Location:</span> <span className="text-charcoal-800">{product.farm_info.location}</span></div>
                  <div><span className="textCharcoal-500">Altitude:</span> <span className="text-charcoal-800">{product.farm_info.altitude}</span></div>
                  <div><span className="text-charcoal-500">Method:</span> <span className="text-charcoal-800">{product.farm_info.farming_method}</span></div>
                </div>
              </div>
            )}

            {product.nutrition_info && (
              <div className="border border-charcoal-100 rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-charcoal-800 mb-4">Nutrition (per 100g)</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="text-2xl font-bold text-pine-700">{product.nutrition_info.calories}</p><p className="text-sm text-charcoal-500">Calories</p></div>
                  <div><p className="text-2xl font-bold text-pine-700">{product.nutrition_info.protein}g</p><p className="text-sm text-charcoal-500">Protein</p></div>
                  <div><p className="text-2xl font-bold text-pine-700">{product.nutrition_info.carbs}g</p><p className="text-sm text-charcoal-500">Carbs</p></div>
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-charcoal-200 rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-cream-50"><Minus className="w-4 h-4" /></button>
                <span className="px-6 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-cream-50"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-3 bg-pine-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-pine-800 transition-all hover:-translate-y-0.5">
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleWishlist} className="p-4 border border-charcoal-200 rounded-xl hover:bg-cream-50 transition-colors">
                <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "text-red-500 fill-red-500")} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-charcoal-100">
              {[{ icon: Truck, title: 'Free Delivery', desc: 'On Rs.999+' }, { icon: Shield, title: 'Secure Payment', desc: '100% Secure' }, { icon: Leaf, title: 'Organic Certified', desc: 'Quality Assured' }].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-pine-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <item.icon className="w-5 h-5 text-pine-700" />
                  </div>
                  <p className="font-medium text-charcoal-800 text-sm">{item.title}</p>
                  <p className="text-xs text-charcoal-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-8">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-charcoal-800">{review.user.name}</h4>
                    <div className="flex items-center gap-1">{[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}</div>
                  </div>
                </div>
                <p className="text-charcoal-600 leading-relaxed">{review.comment}</p>
                <p className="text-sm text-charcoal-400 mt-4">{review.created_at}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct, i) => (
                <motion.div key={relProduct.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-premium group">
                  <Link to={`/products/${relProduct.slug}`}>
                    <div className="aspect-square overflow-hidden rounded-t-2xl">
                      <img src={relProduct.images[0].image} alt={relProduct.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-bold text-charcoal-800 mb-2 line-clamp-2">{relProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-pine-700">{formatPrice(relProduct.price)}</span>
                        <div className="flex items-center gap-1"><Star className="w-4 h-4 fill-accent text-accent" /><span className="text-sm">{relProduct.rating}</span></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}