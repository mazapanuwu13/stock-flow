// Domain Types

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stockByBranch: Record<string, number>;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
}

export type MovementType = "entry" | "exit" | "transfer";
export type MovementStatus = "pending" | "processed" | "failed";

export interface Movement {
  id: string;
  type: MovementType;
  productId: string;
  sourceBranchId?: string;
  destinationBranchId?: string;
  quantity: number;
  status: MovementStatus;
  createdAt: Date;
}

// Form/Input Types
export interface CreateMovementInput {
  type: MovementType;
  productId: string;
  sourceBranchId?: string;
  destinationBranchId?: string;
  quantity: number;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  category: string;
  price: number;
  stockByBranch: Record<string, number>;
}

// View Types
export type DashboardView = "dashboard" | "inventory" | "branches" | "movements" | "reports";
