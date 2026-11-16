import { useQuery } from '@tanstack/react-query';
import { districtsApi } from '@/services/api';
import { districts as mockDistricts } from '@/data';
import type { District } from '@/types';

export function useDistricts() {
  return useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: async () => {
      try {
        const response = await districtsApi.getAll();
        return Array.isArray(response.data) ? response.data : mockDistricts;
      } catch {
        return mockDistricts;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
}

export function useDistrictBySlug(slug: string) {
  return useQuery<District | undefined>({
    queryKey: ['district', slug],
    queryFn: async () => {
      try {
        const response = await districtsApi.getBySlug(slug);
        return response.data || mockDistricts.find((d) => d.slug === slug);
      } catch {
        return mockDistricts.find((d) => d.slug === slug);
      }
    },
    enabled: !!slug,
  });
}

export default useDistricts;
