import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000';

export const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${MEDIA_BASE_URL}${cleanPath}`;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let browser set boundary automatically for multipart FormData uploads
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = response.data?.access;
          if (newAccess) {
            localStorage.setItem('access_token', newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: (params?: { category?: string; district?: string; search?: string; sort?: string; page?: number; is_featured?: boolean }) =>
    api.get('/products/', { params }),
  getFeatured: () => api.get('/products/featured/'),
  getBySlug: (slug: string) => api.get(`/products/${slug}/`),
  getRelated: (slug: string) => api.get(`/products/${slug}/related/`),
  create: (formData: FormData) => api.post('/products/', formData),
  update: (slug: string, data: Record<string, any> | FormData) => api.patch(`/products/${slug}/`, data),
  delete: (slug: string) => api.delete(`/products/${slug}/`),
  uploadImage: (slug: string, formData: FormData) => api.post(`/products/${slug}/upload-image/`, formData),
  setPrimaryImage: (imageId: number) => api.patch(`/products/images/${imageId}/`, { is_primary: true }),
  deleteImage: (imageId: number) => api.delete(`/products/images/${imageId}/`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories/'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}/`),
  getProducts: (slug: string, params?: { page?: number; sort?: string }) =>
    api.get(`/categories/${slug}/products/`, { params }),
  create: (formData: FormData) => api.post('/categories/', formData),
  updateImage: (slug: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.patch(`/categories/${slug}/`, formData);
  },
};

// Districts API
export const districtsApi = {
  getAll: () => api.get('/districts/'),
  getBySlug: (slug: string) => api.get(`/districts/${slug}/`),
  getProducts: (slug: string) => api.get(`/districts/${slug}/products/`),
  getBlogs: (slug: string) => api.get(`/districts/${slug}/blogs/`),
  updateImage: (slug: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.patch(`/districts/${slug}/`, formData);
  },
};

// Blogs API
export const blogsApi = {
  getAll: (params?: { category?: string; district?: string; search?: string; page?: number }) =>
    api.get('/blogs/', { params }),
  getFeatured: () => api.get('/blogs/featured/'),
  getCategories: () => api.get('/blogs/categories/'),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}/`),
  getRelated: (slug: string) => api.get(`/blogs/${slug}/related/`),
  updateImage: (slug: string, file: File) => {
    const formData = new FormData();
    formData.append('featured_image', file);
    return api.patch(`/blogs/${slug}/`, formData);
  },
};

// Testimonials & Newsletter API
export const testimonialsApi = {
  getAll: () => api.get('/testimonials/'),
};

export const newsletterApi = {
  subscribe: (email: string) => api.post('/newsletter/subscribe/', { email }),
};

// Banners API
export const bannersApi = {
  getAll: () => api.get('/banners/'),
};

// Cart API
export const cartApi = {
  get: () => api.get('/cart/'),
  add: (productId: number, quantity: number) =>
    api.post('/cart/items/', { product_id: productId, quantity }),
  update: (itemId: number, quantity: number) =>
    api.patch(`/cart/items/${itemId}/`, { quantity }),
  remove: (itemId: number) => api.delete(`/cart/items/${itemId}/`),
  clear: () => api.delete('/cart/clear/'),
};

// Wishlist API
export const wishlistApi = {
  get: () => api.get('/wishlist/'),
  add: (productId: number) => api.post('/wishlist/', { product_id: productId }),
  remove: (productId: number) => api.delete(`/wishlist/${productId}/`),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: { email: string; password: string; password_confirm?: string; first_name?: string; last_name?: string; username?: string }) =>
    api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
  updateProfile: (data: any) => api.patch('/auth/me/', data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
  googleLogin: (payload: {
    credential?: string;
    id_token?: string;
    access_token?: string;
    email?: string;
    name?: string;
    picture?: string;
    avatar?: string;
  }) => api.post('/auth/google/', payload),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/orders/'),
  getById: (id: number) => api.get(`/orders/${id}/`),
  getByNumber: (orderNumber: string) => api.get(`/orders/${orderNumber}/`),
  create: (data: any) => api.post('/orders/', data),
  cancel: (id: number) => api.post(`/orders/${id}/cancel/`),
};

// Reviews API
export const reviewsApi = {
  getByProduct: (productId: number, params?: { page?: number }) =>
    api.get(`/products/${productId}/reviews/`, { params }),
  create: (productId: number, data: { rating: number; title?: string; comment: string }) =>
    api.post(`/products/${productId}/reviews/`, data),
};

// Search API
export const searchApi = {
  search: (query: string, params?: { type?: string; category?: string; district?: string }) =>
    api.get('/search/', { params: { q: query, ...params } }),
  suggestions: (query: string) => api.get('/search/suggestions/', { params: { q: query } }),
};

export default api;
