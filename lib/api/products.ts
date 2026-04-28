import { apiClient } from './client';
import type { Product, CreateProductInput } from '@/types';

export const productsApi = {
  getAll: () => apiClient.get<Product[]>('/products'),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  create: (data: CreateProductInput) => apiClient.post<Product>('/products', data),
  update: (id: string, data: Partial<CreateProductInput>) =>
    apiClient.put<Product>(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete<null>(`/products/${id}`),
};
