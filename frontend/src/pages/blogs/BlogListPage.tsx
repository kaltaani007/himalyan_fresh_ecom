import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { blogs } from '@/data';

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-charcoal-900">Our Blog</h1>
          <p className="text-charcoal-500 mt-3 max-w-2xl mx-auto">Stories from the mountains, tips for healthy living, and the latest from our farms.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <motion.article key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to={`/blogs/${blog.slug}`} className="card-premium group block">
                <div className="relative h-56 overflow-hidden rounded-t-3xl">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="badge badge-pine">{blog.category.name}</span>
                    {blog.is_trending && <span className="badge badge-accent">Trending</span>}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-charcoal-500 mb-3">
                    <div className="flex items-center gap-2"><img src={blog.author.avatar} alt={blog.author.name} className="w-6 h-6 rounded-full" /><span>{blog.author.name}</span></div>
                    <span className="w-1 h-1 bg-charcoal-300 rounded-full"></span>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{blog.read_time} min</span></div>
                  </div>
                  <h2 className="font-heading font-bold text-xl text-charcoal-800 mb-3 line-clamp-2 group-hover:text-pine-700 transition-colors">{blog.title}</h2>
                  <p className="text-charcoal-500 line-clamp-3 mb-4">{blog.summary}</p>
                  <div className="flex items-center gap-2 text-pine-700 font-medium">
                    <span className="text-sm">Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}