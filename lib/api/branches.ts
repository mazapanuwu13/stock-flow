import { apiClient } from './client';
import type { Branch } from '@/types';

export interface CreateBranchInput {
  name: string;
  location: string;
}

export const branchesApi = {
  getAll: () => apiClient.get<Branch[]>('/branches'),
  getById: (id: string) => apiClient.get<Branch>(`/branches/${id}`),
  create: (data: CreateBranchInput) => apiClient.post<Branch>('/branches', data),
  update: (id: string, data: Partial<CreateBranchInput>) =>
    apiClient.put<Branch>(`/branches/${id}`, data),
  delete: (id: string) => apiClient.delete<null>(`/branches/${id}`),
};
