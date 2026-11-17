import { useQuery } from '@tanstack/react-query';
import { districtsApi } from '@/services/api';
import type { District, Product, Blog } from '@/types';

export function useDistricts() {
  return useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      const response = await districtsApi.getAll();
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.results)) return response.data.results;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useDistrictBySlug(slug?: string) {
  return useQuery<District>({
    queryKey: ['district', slug],
    queryFn: async () => {
      const response = await districtsApi.getBySlug(slug!);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useDistrictProducts(slug?: string) {
  return useQuery<Product[]>({
    queryKey: ['district', slug, 'products'],
    queryFn: async () => {
      const response = await districtsApi.getProducts(slug!);
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.results)) return response.data.results;
      return [];
    },
    enabled: !!slug,
  });
}

export function useDistrictBlogs(slug?: string) {
  return useQuery<Blog[]>({
    queryKey: ['district', slug, 'blogs'],
    queryFn: async () => {
      const response = await districtsApi.getBlogs(slug!);
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.results)) return response.data.results;
      return [];
    },
    enabled: !!slug,
  });
}

export default useDistricts;
