import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/services/api';
import { categories as mockCategories } from '@/data';
import type { Category } from '@/types';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await categoriesApi.getAll();
        return Array.isArray(response.data) ? response.data : mockCategories;
      } catch {
        return mockCategories;
      }
    },
    staleTime: 1000 * 60 * 15,
  });
}

export default useCategories;
