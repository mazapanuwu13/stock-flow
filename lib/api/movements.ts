import { apiClient } from './client';
import type { Movement, CreateMovementInput } from '@/types';

// The API expects DB-level types ('IN' | 'OUT' | 'TRANSFER')
export type ApiMovementType = 'IN' | 'OUT' | 'TRANSFER';

export interface CreateMovementPayload {
  type: ApiMovementType;
  productId: string;
  sourceBranchId?: string;
  destBranchId?: string;
  quantity: number;
}

export const movementsApi = {
  getAll: () => apiClient.get<Movement[]>('/movements'),
  getById: (id: string) => apiClient.get<Movement>(`/movements/${id}`),
  create: (data: CreateMovementPayload) => apiClient.post<Movement>('/movements', data),
};
