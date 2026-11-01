import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, TreePine } from 'lucide-react';
import { districts, products } from '@/data';

export default function DistrictPage() {
  const { slug } = useParams();
  const district = slug ? districts.find(d => d.slug === slug) : null;
  
  const districtProducts = district ? products.filter(p => p.origin.toLowerCase() === district.name.toLowerCase()) : products.slice(0, 8);

  if (!district) {
    return (
      <div className="min-h-screen bg-cream-50 py-12">
        <div className="max-w-container mx-auto px-4">
          <h1 className="font-heading text-4xl font-bold text-charcoal-900 mb-8">Explore Himachal</h1>
          <p className="text-charcoal-500 mb-8">Discover the unique agricultural heritage of each district in Himachal Pradesh.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={`/districts/${d.slug}`} className="card-premium group block">
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-heading text-xl font-bold">{d.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-charcoal-500 text-sm line-clamp-2">{d.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="badge badge-pine">{d.products_count} Products</span>
                      <span className="badge badge-accent">{d.blogs_count} Articles</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={district.image} alt={district.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 to-charcoal-900/30"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-container mx-auto">
            <Link to="/districts" className="text-white/70 hover:text-white mb-4 inline-block">&larr; All Districts</Link>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">{district.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="text-lg text-charcoal-600 leading-relaxed mb-8">{district.description}</p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pine-50 rounded-xl flex items-center justify-center"><MapPin className="w-6 h-6 text-pine-700" /></div>
                  <div><p className="text-sm text-charcoal-500">Altitude</p><p className="font-semibold text-charcoal-800">{district.altitude}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-pine-50 rounded-xl flex items-center justify-center"><TreePine className="w-6 h-6 text-pine-700" /></div>
                  <div><p className="text-sm text-charcoal-500">Climate</p><p className="font-semibold text-charcoal-800">{district.climate}</p></div>
                </div>
              </div>
            </div>

            <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-6">Specialties</h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {district.specialties.map((spec, i) => (
                <span key={i} className="px-4 py-2 bg-pine-50 text-pine-700 rounded-full">{spec}</span>
              ))}
            </div>

            <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-6">Famous For</h2>
            <div className="flex flex-wrap gap-3 mb-12">
              {district.famous_for.map((item, i) => (
                <span key={i} className="px-4 py-2 bg-accent/10 text-accent-dark rounded-full">{item}</span>
              ))}
            </div>

            <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-6">Products from {district.name}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {districtProducts.slice(0, 4).map((product) => (
                <Link key={product.id} to={`/products/${product.slug}`} className="card-premium group flex gap-4 p-4">
                  <img src={product.images[0].image} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-heading font-bold text-charcoal-800 mb-1">{product.name}</h3>
                    <p className="text-pine-700 font-semibold">Rs. {product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-24">
              <h3 className="font-heading font-bold text-xl text-charcoal-800 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-charcoal-500">Products</span><span className="font-semibold">{district.products_count}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Blog Articles</span><span className="font-semibold">{district.blogs_count}</span></div>
                <div className="flex justify-between"><span className="text-charcoal-500">Population</span><span className="font-semibold">{district.population}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}