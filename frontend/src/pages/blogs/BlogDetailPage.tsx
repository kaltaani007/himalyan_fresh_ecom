import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { blogs } from '@/data';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const blog = blogs.find(b => b.slug === slug) || blogs[0];
  const relatedBlogs = blogs.filter(b => b.id !== blog.id && b.category.id === blog.category.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-content mx-auto px-4">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-charcoal-500 hover:text-pine-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-8">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="badge badge-pine mb-4">{blog.category.name}</span>
              <h1 className="font-heading text-3xl lg:text-4xl font-bold">{blog.title}</h1>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8 pb-8 border-b border-charcoal-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img src={blog.author.avatar} alt={blog.author.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold text-charcoal-800">{blog.author.name}</h3>
                  <p className="text-sm text-charcoal-500">{blog.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-charcoal-500">
                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /><span>{blog.published_at}</span></div>
                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /><span>{blog.read_time} min read</span></div>
              </div>
            </div>
            <button className="p-3 rounded-full bg-cream-100 hover:bg-pine-50 transition-colors">
              <Share2 className="w-5 h-5 text-charcoal-600" />
            </button>
          </div>

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

          {blog.district && (
            <div className="mt-12 p-6 bg-pine-50 rounded-2xl">
              <h3 className="font-heading font-semibold text-charcoal-800 mb-3">Related District</h3>
              <Link to={`/districts/${blog.district.slug}`} className="flex items-center gap-4">
                <img src={blog.district.image} alt={blog.district.name} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-semibold text-charcoal-800">{blog.district.name}</h4>
                  <p className="text-sm text-charcoal-500">{blog.district.description.slice(0, 100)}...</p>
                </div>
              </Link>
            </div>
          )}
        </motion.article>

        {relatedBlogs.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-charcoal-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map((related, i) => (
                <motion.div key={related.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/blogs/${related.slug}`} className="card-premium group block">
                    <div className="h-40 overflow-hidden rounded-t-2xl">
                      <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading font-bold text-charcoal-800 line-clamp-2">{related.title}</h3>
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