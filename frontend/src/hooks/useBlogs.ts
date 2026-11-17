import { useQuery } from '@tanstack/react-query';
import { blogsApi } from '@/services/api';
import type { Blog, BlogCategory } from '@/types';

export function useBlogs(params?: { category?: string; district?: string; search?: string }) {
  return useQuery<Blog[]>({
    queryKey: ['blogs', params ?? {}],
    queryFn: async () => {
      const response = await blogsApi.getAll(params);
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.results)) return response.data.results;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useFeaturedBlogs() {
  return useQuery<Blog[]>({
    queryKey: ['blogs', 'featured'],
    queryFn: async () => {
      const response = await blogsApi.getFeatured();
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ['blogs', 'categories'],
    queryFn: async () => {
      const response = await blogsApi.getCategories();
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useBlogBySlug(slug: string) {
  return useQuery<Blog>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await blogsApi.getBySlug(slug);
      return response.data;
    },
    enabled: !!slug,
  });
}

export function useRelatedBlogs(slug: string) {
  return useQuery<Blog[]>({
    queryKey: ['blog', slug, 'related'],
    queryFn: async () => {
      const response = await blogsApi.getRelated(slug);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: !!slug,
  });
}

export default useBlogs;
