import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
          localStorage.setItem('access_token', response.data.access);
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: (params?: { category?: string; search?: string; sort?: string; page?: number }) =>
    api.get('/products/', { params }),
  getFeatured: () => api.get('/products/featured/'),
  getBySlug: (slug: string) => api.get(`/products/${slug}/`),
  getById: (id: number) => api.get(`/products/${id}/`),
  getRelated: (slug: string) => api.get(`/products/${slug}/related/`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories/'),
  getBySlug: (slug: string) => api.get(`/categories/${slug}/`),
  getProducts: (slug: string, params?: { page?: number; sort?: string }) =>
    api.get(`/categories/${slug}/products/`, { params }),
};

// Districts API
export const districtsApi = {
  getAll: () => api.get('/districts/'),
  getBySlug: (slug: string) => api.get(`/districts/${slug}/`),
  getProducts: (slug: string) => api.get(`/districts/${slug}/products/`),
  getBlogs: (slug: string) => api.get(`/districts/${slug}/blogs/`),
};

// Blogs API
export const blogsApi = {
  getAll: (params?: { category?: string; search?: string; page?: number }) =>
    api.get('/blogs/', { params }),
  getFeatured: () => api.get('/blogs/featured/'),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}/`),
  getByCategory: (category: string) => api.get(`/blogs/category/${category}/`),
  getRelated: (slug: string) => api.get(`/blogs/${slug}/related/`),
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
  check: (productId: number) => api.get(`/wishlist/check/${productId}/`),
};

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: { email: string; password: string; first_name: string; last_name: string }) =>
    api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  me: () => api.get('/auth/me/'),
  updateProfile: (data: any) => api.patch('/auth/me/', data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
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
  create: (productId: number, data: { rating: number; comment: string }) =>
    api.post(`/products/${productId}/reviews/`, data),
  update: (reviewId: number, data: { rating?: number; comment?: string }) =>
    api.patch(`/reviews/${reviewId}/`, data),
  delete: (reviewId: number) => api.delete(`/reviews/${reviewId}/`),
};

// Search API
export const searchApi = {
  search: (query: string, params?: { type?: string; category?: string; district?: string }) =>
    api.get('/search/', { params: { q: query, ...params } }),
  suggestions: (query: string) => api.get('/search/suggestions/', { params: { q: query } }),
};

// AI Assistant API (mock for now)
export const aiApi = {
  chat: (message: string, context?: any) =>
    api.post('/ai/chat/', { message, context }),
  getRecommendations: (productId?: number) =>
    api.get('/ai/recommendations/', { params: { product_id: productId } }),
  getDistrictGuide: (district: string) =>
    api.get('/ai/district-guide/', { params: { district } }),
};

export default api;