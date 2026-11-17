import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  FolderOpen,
  MapPin,
  FileText,
  Package,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useDistricts } from '@/hooks/useDistricts';
import { useBlogs } from '@/hooks/useBlogs';
import { productsApi, categoriesApi, districtsApi, blogsApi } from '@/services/api';

type TabId = 'products' | 'categories' | 'districts' | 'blogs';

export default function MediaManagerPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>('products');
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  // New Product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('apples');
  const [newProdDistrict, setNewProdDistrict] = useState('kinnaur');
  const [newProdPrice, setNewProdPrice] = useState('599');
  const [newProdDiscountPrice, setNewProdDiscountPrice] = useState('');
  const [newProdWeight, setNewProdWeight] = useState('1 kg');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdFeatured, setNewProdFeatured] = useState(true);
  const [newProdFiles, setNewProdFiles] = useState<FileList | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const { data: products = [], isLoading: loadingProducts } = useProducts();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const { data: districts = [], isLoading: loadingDistricts } = useDistricts();
  const { data: blogs = [], isLoading: loadingBlogs } = useBlogs();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['product'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['districts'] });
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  };

  // Upload a new catalog image to an existing product
  const handleProductImageUpload = async (slug: string, file: File) => {
    const key = `prod-${slug}`;
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('is_primary', 'false');
      await productsApi.uploadImage(slug, fd);
      toast.success('Uploaded catalog image to Django media/products/!');
      refreshAll();
    } catch {
      toast.error('Upload failed. Ensure Django backend is running on port 8000.');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSetPrimaryImage = async (imageId: number) => {
    try {
      await productsApi.setPrimaryImage(imageId);
      toast.success('Updated primary product image!');
      refreshAll();
    } catch {
      toast.error('Failed to update primary image.');
    }
  };

  const handleDeleteProductImage = async (imageId: number) => {
    try {
      await productsApi.deleteImage(imageId);
      toast.success('Deleted product image.');
      refreshAll();
    } catch {
      toast.error('Failed to delete product image.');
    }
  };

  // Create a brand new product with uploaded catalog image(s)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;
    setIsCreatingProduct(true);
    try {
      const fd = new FormData();
      fd.append('name', newProdName.trim());
      fd.append('category_slug', newProdCategory);
      fd.append('district_slug', newProdDistrict);
      const selectedDist = districts.find((d) => d.slug === newProdDistrict);
      fd.append('origin', selectedDist?.name || 'Kinnaur');
      fd.append('base_price', newProdPrice);
      if (newProdDiscountPrice) {
        fd.append('discount_price', newProdDiscountPrice);
      }
      fd.append('weight', newProdWeight || '1 kg');
      fd.append('description', newProdDescription || `Fresh Himalayan ${newProdName.trim()} sourced directly from mountain farms.`);
      fd.append('is_featured', String(newProdFeatured));
      fd.append('in_stock', 'true');
      fd.append('is_active', 'true');

      if (newProdFiles && newProdFiles.length > 0) {
        Array.from(newProdFiles).forEach((file) => {
          fd.append('images', file);
        });
      }

      await productsApi.create(fd);
      toast.success(`Created "${newProdName}" and saved media to Django!`);
      setNewProdName('');
      setNewProdDescription('');
      setNewProdDiscountPrice('');
      setNewProdFiles(null);
      setShowNewProductForm(false);
      refreshAll();
    } catch {
      toast.error('Failed to create product. Check fields and Django server.');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  // Upload category image
  const handleCategoryImageUpload = async (slug: string, file: File) => {
    const key = `cat-${slug}`;
    setUploadingKey(key);
    try {
      await categoriesApi.updateImage(slug, file);
      toast.success('Updated category image in Django media/categories/!');
      refreshAll();
    } catch {
      toast.error('Failed to upload category image.');
    } finally {
      setUploadingKey(null);
    }
  };

  // Upload district image
  const handleDistrictImageUpload = async (slug: string, file: File) => {
    const key = `dist-${slug}`;
    setUploadingKey(key);
    try {
      await districtsApi.updateImage(slug, file);
      toast.success('Updated district photo in Django media/districts/!');
      refreshAll();
    } catch {
      toast.error('Failed to upload district photo.');
    } finally {
      setUploadingKey(null);
    }
  };

  // Upload blog cover image
  const handleBlogImageUpload = async (slug: string, file: File) => {
    const key = `blog-${slug}`;
    setUploadingKey(key);
    try {
      await blogsApi.updateImage(slug, file);
      toast.success('Updated blog cover image in Django media/blog_posts/!');
      refreshAll();
    } catch {
      toast.error('Failed to upload blog cover image.');
    } finally {
      setUploadingKey(null);
    }
  };

  const tabs: { id: TabId; label: string; count: number; icon: typeof Package }[] = [
    { id: 'products', label: 'Product Catalog', count: products.length, icon: Package },
    { id: 'categories', label: 'Categories', count: categories.length, icon: FolderOpen },
    { id: 'districts', label: 'Districts', count: districts.length, icon: MapPin },
    { id: 'blogs', label: 'Blog Media', count: blogs.length, icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background-secondary py-10 lg:py-14">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="badge badge-primary mb-2 inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Django Media Connected
            </span>
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-text-primary">
              Catalog &amp; Media Upload Studio
            </h1>
            <p className="text-text-secondary text-sm sm:text-base mt-2 max-w-2xl">
              Upload, organize, and manage product catalog galleries, category photography, district landscapes, and blog cover media stored directly in Django <code className="px-1.5 py-0.5 rounded bg-white border border-border-light text-xs">/media/</code>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refreshAll}
              className="btn-ghost border border-border-medium bg-white px-4 py-2.5 text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Backend
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('products');
                setShowNewProductForm((v) => !v);
              }}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {showNewProductForm ? 'Close Form' : 'New Product + Media'}
            </button>
          </div>
        </div>

        {/* Folder Structure Pill Strip */}
        <div className="bg-white rounded-2xl border border-border-light p-4 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-secondary">
            <span className="font-semibold text-primary">Django Media Roots:</span>
            <span className="px-2.5 py-1 rounded-lg bg-background-secondary">media/products/</span>
            <span className="px-2.5 py-1 rounded-lg bg-background-secondary">media/categories/</span>
            <span className="px-2.5 py-1 rounded-lg bg-background-secondary">media/districts/</span>
            <span className="px-2.5 py-1 rounded-lg bg-background-secondary">media/blog_posts/</span>
          </div>
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Open Django Admin &rarr;
          </a>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  active
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-text-secondary hover:bg-background-tertiary border border-border-light'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    active ? 'bg-white/20 text-white' : 'bg-background-secondary text-text-tertiary'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Create New Product Form */}
        {showNewProductForm && activeTab === 'products' && (
          <form
            onSubmit={handleCreateProduct}
            className="bg-white rounded-3xl border border-border-light p-6 sm:p-8 mb-10 shadow-md space-y-6"
          >
            <h2 className="font-heading text-xl font-bold text-text-primary flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Create Dynamic Product &amp; Upload Catalog Photos
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Kalpa Crisp Fuji Apples"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="input-field w-full"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Origin District</label>
                <select
                  value={newProdDistrict}
                  onChange={(e) => setNewProdDistrict(e.target.value)}
                  className="input-field w-full"
                >
                  {districts.map((dist) => (
                    <option key={dist.slug} value={dist.slug}>{dist.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Base Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Sale Price (₹, optional)</label>
                <input
                  type="number"
                  min="1"
                  value={newProdDiscountPrice}
                  onChange={(e) => setNewProdDiscountPrice(e.target.value)}
                  placeholder="Optional discounted price"
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Pack Weight</label>
                <input
                  type="text"
                  value={newProdWeight}
                  onChange={(e) => setNewProdWeight(e.target.value)}
                  placeholder="1 kg"
                  className="input-field w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Description</label>
              <textarea
                rows={2}
                value={newProdDescription}
                onChange={(e) => setNewProdDescription(e.target.value)}
                placeholder="Describe harvest altitude, flavor profile, and orchard freshness..."
                className="input-field w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background-secondary border border-dashed border-primary/50 text-sm font-medium text-primary cursor-pointer hover:bg-primary/5 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>
                    {newProdFiles && newProdFiles.length > 0
                      ? `${newProdFiles.length} image(s) selected`
                      : 'Choose Catalog Images'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewProdFiles(e.target.files)}
                    className="hidden"
                  />
                </label>

                <label className="inline-flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProdFeatured}
                    onChange={(e) => setNewProdFeatured(e.target.checked)}
                    className="rounded text-primary"
                  />
                  Feature on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={isCreatingProduct}
                className="btn-accent px-6 py-3 rounded-xl font-bold disabled:opacity-60"
              >
                {isCreatingProduct ? 'Uploading to Django...' : 'Save Product & Upload Media'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 1: PRODUCTS CATALOG IMAGES */}
        {activeTab === 'products' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingProducts && (
              <div className="col-span-full py-12 text-center text-text-secondary">Loading live catalog from Django...</div>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-background-tertiary overflow-hidden">
                    {product.images[0]?.image ? (
                      <img
                        src={product.images[0].image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-light">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="badge badge-primary text-[11px]">{product.category?.name}</span>
                      <span className="badge bg-black/70 text-white text-[11px]">₹{product.price}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-text-primary">{product.name}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5 mb-4">
                      Origin: {product.origin} • {product.weight} • {product.images.length} media file(s)
                    </p>

                    {/* Gallery Thumbnails */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {product.images.map((img) => (
                        <div
                          key={img.id}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${
                            img.is_primary ? 'border-accent' : 'border-border-light'
                          }`}
                        >
                          <img src={img.image} alt={img.alt_text} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {!img.is_primary && (
                              <button
                                type="button"
                                title="Set as primary"
                                onClick={() => handleSetPrimaryImage(img.id)}
                                className="p-1 rounded bg-accent text-white hover:scale-110 transition-transform"
                              >
                                <Star className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              type="button"
                              title="Delete image"
                              onClick={() => handleDeleteProductImage(img.id)}
                              className="p-1 rounded bg-red-600 text-white hover:scale-110 transition-transform"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <label className="w-full py-2.5 px-4 rounded-xl bg-background-secondary hover:bg-primary hover:text-white border border-border-medium text-xs font-semibold text-text-primary flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploadingKey === `prod-${product.slug}`
                        ? 'Uploading...'
                        : 'Upload Additional Catalog Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProductImageUpload(product.slug, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CATEGORY IMAGES */}
        {activeTab === 'categories' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingCategories && (
              <div className="col-span-full py-12 text-center text-text-secondary">Loading categories...</div>
            )}
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm">
                <div className="aspect-[4/3] bg-background-tertiary overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-text-primary">{cat.name}</h3>
                    <p className="text-xs text-text-tertiary">{cat.product_count} products • slug: {cat.slug}</p>
                  </div>
                  <label className="w-full py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-light text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingKey === `cat-${cat.slug}` ? 'Uploading...' : 'Replace Category Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCategoryImageUpload(cat.slug, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DISTRICT IMAGES */}
        {activeTab === 'districts' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingDistricts && (
              <div className="col-span-full py-12 text-center text-text-secondary">Loading districts...</div>
            )}
            {districts.map((dist) => (
              <div key={dist.id} className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm">
                <div className="aspect-[16/10] bg-background-tertiary overflow-hidden">
                  <img src={dist.image} alt={dist.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-text-primary">{dist.name}</h3>
                    <p className="text-xs text-text-tertiary">
                      {dist.altitude} • {dist.climate} • {dist.products_count} products
                    </p>
                  </div>
                  <label className="w-full py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-light text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingKey === `dist-${dist.slug}` ? 'Uploading...' : 'Upload District Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDistrictImageUpload(dist.slug, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: BLOG MEDIA */}
        {activeTab === 'blogs' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingBlogs && (
              <div className="col-span-full py-12 text-center text-text-secondary">Loading blog articles...</div>
            )}
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-2xl border border-border-light overflow-hidden shadow-sm">
                <div className="aspect-[16/10] bg-background-tertiary overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-primary line-clamp-2">{blog.title}</h3>
                    <p className="text-xs text-text-tertiary mt-1">{blog.category?.name} • {blog.author?.name}</p>
                  </div>
                  <label className="w-full py-2.5 px-4 rounded-xl bg-primary text-white hover:bg-primary-light text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingKey === `blog-${blog.slug}` ? 'Uploading...' : 'Upload Cover Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBlogImageUpload(blog.slug, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
