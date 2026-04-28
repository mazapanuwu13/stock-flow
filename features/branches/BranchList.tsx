"use client";

import { BranchCard } from "./BranchCard";
import type { Branch, Product } from "@/types";

interface BranchListProps {
  branches: Branch[];
  products: Product[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (branchId: string) => void;
}

export function BranchList({ branches, products, onEdit, onDelete }: BranchListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
