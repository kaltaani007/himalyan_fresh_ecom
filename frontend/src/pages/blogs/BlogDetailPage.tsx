import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowLeft, Share2, MapPin, BookOpen, ArrowUpRight, Leaf, ChevronRight } from 'lucide-react';
import { useBlogBySlug, useRelatedBlogs } from '@/hooks/useBlogs';
import type { Blog } from '@/types';

const PROSE = `prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[#183B2A]
  prose-headings:font-bold prose-p:text-[#59685C] prose-p:leading-[1.95] prose-p:mb-7
  prose-a:text-[#34704A] prose-a:no-underline prose-a:font-semibold prose-a:hover:underline
  prose-strong:text-[#254A32] prose-li:text-[#59685C] prose-blockquote:border-l-[#B99356]
  prose-blockquote:text-[#526C57] prose-blockquote:bg-[#F0F3EC] prose-blockquote:py-3
  prose-blockquote:px-6 prose-img:rounded-2xl prose-img:shadow-lg prose-hr:border-[#E8E5DA]`;

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8A997F]">{children}</span>
);

function RelatedCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.5, delay: index * 0.12 }}>
      <Link to={`/blogs/${blog.slug}`} className="group block bg-white rounded-[22px] overflow-hidden border border-[#EAE7DE] shadow-[0_5px_25px_rgba(30,60,40,0.04)] hover:shadow-[0_15px_40px_rgba(30,60,40,0.12)] hover:-translate-y-1 transition-all duration-500">
        <div className="relative h-56 overflow-hidden">
          <img src={blog.image} alt={blog.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />
          <span className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-[11px] font-bold tracking-wide text-[#285C3E]">HIMALAYA FRESH</span>
        </div>
        <div className="p-6">
          <h3 className="font-heading font-bold text-xl text-[#20402D] leading-snug line-clamp-2 group-hover:text-[#56845D] transition-colors">{blog.title}</h3>
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0EEE7]">
            <span className="text-sm font-medium text-[#89948A]">Read Article</span>
            <span className="w-9 h-9 rounded-full bg-[#EEF3ED] flex items-center justify-center text-[#285C3E] group-hover:bg-[#285C3E] group-hover:text-white transition-all"><ArrowUpRight size={17} /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogDetailPage() {
  const { slug = '' } = useParams();
  const { data: blog, isLoading, isError } = useBlogBySlug(slug);
  const { data: relatedBlogs = [] } = useRelatedBlogs(slug);

  const handleShare = async () => {
    if (!blog) return;
    const data = { title: blog.title, text: blog.summary || blog.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') console.error('Unable to share article:', e);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center">
      <div className="text-center">
        <Leaf className="w-9 h-9 text-[#285C3E] mx-auto mb-4 animate-pulse" />
        <p className="text-[#718276] font-medium">Preparing your reading experience...</p>
      </div>
    </div>
  );

  if (isError || !blog) return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col items-center justify-center px-6">
      <Leaf className="w-12 h-12 text-[#285C3E] mb-5" />
      <h2 className="font-heading text-3xl font-bold text-[#183B2A] mb-3">Article not found</h2>
      <p className="text-[#758477] mb-6">The article you're looking for is unavailable.</p>
      <Link to="/blogs" className="inline-flex items-center gap-2 bg-[#204D35] text-white px-6 py-3 rounded-full hover:bg-[#173C29] transition-colors"><ArrowLeft size={17} /> Back to Blogs</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FAF8F3] pb-24">
      <div className="max-w-9xl mx-auto px-5 lg:px-8 pt-8 pb-6 flex items-center gap-2 text-sm text-[#89948A]">
        <Link to="/" className="hover:text-[#285C3E]">Home</Link><ChevronRight size={14} />
        <Link to="/blogs" className="hover:text-[#285C3E]">Harvest Blog</Link><ChevronRight size={14} />
        <span className="text-[#285C3E] font-medium truncate">{blog.category.name}</span>
      </div>

      <motion.article initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Hero */}
        <section className="relative h-[420px] sm:h-[520px] lg:h-[620px] rounded-[28px] lg:rounded-[36px] overflow-hidden group">
          <img src={blog.image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#091A10]/90 via-[#091A10]/30 to-transparent" />
          <div className="absolute top-6 left-6 lg:top-9 lg:left-9 flex flex-wrap gap-2">
            <span className="px-4 py-2 rounded-full bg-white text-[#204D35] text-xs font-bold uppercase tracking-wider shadow-lg">{blog.category.name}</span>
            {blog.is_trending && <span className="px-4 py-2 rounded-full bg-[#D6A85D] text-[#182B1E] text-xs font-bold uppercase tracking-wider">Trending</span>}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-10 lg:p-16 max-w-5xl">
            <div className="flex items-center gap-2 text-[#D8E6D9] text-sm font-medium mb-5"><Leaf size={16} /><span>Stories from the Himalayas</span></div>
            <h1 className="font-heading text-white text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.12] mb-6 max-w-4xl">{blog.title}</h1>
            {blog.summary && <p className="text-white/80 text-base lg:text-lg max-w-2xl leading-relaxed">{blog.summary}</p>}
          </div>
        </section>

        {/* Meta bar */}
        <section className="border-b border-[#E8E5DA] py-7 lg:py-9 mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src={blog.author.avatar} alt={blog.author.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
            <div>
              <h3 className="font-heading text-[#183B2A] font-bold text-lg">{blog.author.name}</h3>
              <p className="text-sm text-[#89948A]">{blog.author.role}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#788579]">
            <span className="flex items-center gap-2"><Calendar size={17} className="text-[#467B55]" />{blog.published_at}</span>
            <span className="flex items-center gap-2"><Clock size={17} className="text-[#467B55]" />{blog.read_time} min read</span>
            <button onClick={handleShare} aria-label="Share article" className="flex items-center justify-center w-11 h-11 rounded-full bg-[#EDF3EC] text-[#285C3E] hover:bg-[#285C3E] hover:text-white transition-all duration-300"><Share2 size={19} /></button>
          </div>
        </section>

        {/* Content + sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-20 py-12 lg:py-16">
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-8"><span className="w-10 h-[2px] bg-[#B99356]" /><Label>The Story</Label></div>
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <aside className="space-y-7 lg:pt-10">
            {blog.district && (
              <div className="bg-[#EEF3ED] rounded-[24px] p-6 border border-[#E4EBE1]">
                <div className="flex items-center gap-2 mb-5"><MapPin size={17} className="text-[#467B55]" /><h3 className="font-heading font-bold text-lg text-[#183B2A]">Explore the District</h3></div>
                <Link to={`/districts/${blog.district.slug}`} className="group block">
                  <div className="h-44 rounded-2xl overflow-hidden mb-4">
                    <img src={blog.district.image} alt={blog.district.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-heading font-bold text-xl text-[#204D35]">{blog.district.name}</h4>
                    <ArrowUpRight size={19} className="text-[#467B55] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <p className="text-sm text-[#758477] leading-relaxed">{blog.district.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#285C3E] mt-5">Discover District <ChevronRight size={16} /></span>
                </Link>
              </div>
            )}

            <div className="bg-[#183B2A] rounded-[24px] p-7 text-white relative overflow-hidden">
              <Leaf size={100} className="absolute -right-5 -bottom-5 text-white/5" />
              <BookOpen size={24} className="text-[#D5B778] mb-5" />
              <h3 className="font-heading text-xl font-bold mb-3 text-white">Love Himalayan Stories?</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6">Explore more stories about Himalayan agriculture, local traditions and natural produce.</p>
              <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-[#E1C58C] hover:text-white transition-colors">Explore All Stories <ArrowUpRight size={17} /></Link>
            </div>
          </aside>
        </section>

        {/* Related */}
        {relatedBlogs.length > 0 && (
          <section className="border-t border-[#E8E5DA] pt-16 lg:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3"><Leaf size={17} className="text-[#56845D]" /><Label>Continue Exploring</Label></div>
                <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#183B2A]">More Stories to Discover</h2>
                <p className="text-[#879287] mt-3">Discover more from the heart of the Himalayas.</p>
              </div>
              <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-[#285C3E] hover:gap-3 transition-all">View All Stories <ArrowUpRight size={17} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {relatedBlogs.map((r, i) => <RelatedCard key={r.id} blog={r} index={i} />)}
            </div>
          </section>
        )}
      </motion.article>
    </main>
  );
}