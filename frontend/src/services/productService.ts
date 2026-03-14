import { get, post } from './api';
import type { Product, CreateProductPayload } from '@/types';

export const productService = {
  getAll: () => get<Product[]>('/products'),
  create: (data: CreateProductPayload) => post<Product>('/products', data),
};
