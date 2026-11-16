import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/services/api';
import { products as mockProducts } from '@/data';
import type { Product } from '@/types';

export function useProducts(params?: { category?: string; search?: string; sort?: string; page?: number }) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: async () => {
      try {
        const response = await productsApi.getAll(params);
        if (response.data?.results) {
          return response.data.results;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
        return mockProducts;
      } catch (err) {
        // Fallback to local high-altitude produce data if backend is offline
        let filtered = [...mockProducts];
        if (params?.category) {
          filtered = filtered.filter((p) => p.category_slug === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }
        if (params?.sort === 'price-low') {
          filtered.sort((a, b) => a.price - b.price);
        } else if (params?.sort === 'price-high') {
          filtered.sort((a, b) => b.price - a.price);
        } else if (params?.sort === 'rating') {
          filtered.sort((a, b) => b.rating - a.rating);
        }
        return filtered;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        const response = await productsApi.getFeatured();
        return Array.isArray(response.data) ? response.data : mockProducts.filter((p) => p.is_featured);
      } catch {
        return mockProducts.filter((p) => p.is_featured);
      }
    },
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product | undefined>({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const response = await productsApi.getBySlug(slug);
        return response.data || mockProducts.find((p) => p.slug === slug);
      } catch {
        return mockProducts.find((p) => p.slug === slug);
      }
    },
    enabled: !!slug,
  });
}

export default useProducts;
