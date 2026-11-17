import { useQuery } from '@tanstack/react-query';
import { testimonialsApi } from '@/services/api';

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  product: string;
  purchase: string;
  text: string;
}

export function useTestimonials() {
  return useQuery<TestimonialItem[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const response = await testimonialsApi.getAll();
      return Array.isArray(response.data) ? response.data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export default useTestimonials;
