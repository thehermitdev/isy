import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import type { CreateProductPayload } from '@/types';

export const PRODUCTS_KEY = ['products'] as const;

export function useProducts() {
  return useQuery({ queryKey: PRODUCTS_KEY, queryFn: productService.getAll });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) => productService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
