import { apiClient } from './client';

export interface StockEntry {
  _id: string;
  productId: { _id: string; name: string; sku: string; category: string };
  branchId: { _id: string; name: string; location: string };
  quantity: number;
}

export const stockApi = {
  getAll: () => apiClient.get<StockEntry[]>('/stock'),
  getByBranch: (branchId: string) => apiClient.get<StockEntry[]>(`/stock/${branchId}`),
};
