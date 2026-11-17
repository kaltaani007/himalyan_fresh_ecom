import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api';
import type { Category } from '@/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.results)) return response.data.results;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['category', slug],
    queryFn: async () => {
      const response = await categoriesApi.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

export default useCategories;
