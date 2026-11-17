import { useQuery } from '@tanstack/react-query';
import { productsApi, reviewsApi } from '@/services/api';
import type { Product, Review } from '@/types';

const unwrapList = <T,>(data: any): T[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

export function useProducts(params?: {
  category?: string;
  district?: string;
  search?: string;
  sort?: string;
  page?: number;
  is_featured?: boolean;
}) {
  return useQuery<Product[]>({
    queryKey: ['products', params ?? {}],
    queryFn: async () => {
      const response = await productsApi.getAll(params);
      return unwrapList<Product>(response.data);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await productsApi.getFeatured();
      return unwrapList<Product>(response.data);
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useProductBySlug(slug: string) {
  return useQuery<Product & { reviews?: Review[] }>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await productsApi.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  });
}

export function useRelatedProducts(slug: string) {
  return useQuery<Product[]>({
    queryKey: ['product', slug, 'related'],
    queryFn: async () => {
      const response = await productsApi.getRelated(slug);
      return unwrapList<Product>(response.data);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductReviews(productId?: number) {
  return useQuery<Review[]>({
    queryKey: ['product', productId, 'reviews'],
    queryFn: async () => {
      const response = await reviewsApi.getByProduct(productId!);
      return unwrapList<Review>(response.data);
    },
    enabled: !!productId,
  });
}

export default useProducts;
