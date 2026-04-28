"use client";

import { useState, useEffect, useCallback } from "react";
import { branchesApi, type CreateBranchInput } from "@/lib/api/branches";
import type { Branch } from "@/types";

// MongoDB returns _id; map to the frontend Branch type
function mapBranch(raw: Record<string, unknown>): Branch {
  return {
    id: raw._id as string,
    name: raw.name as string,
    location: raw.location as string,
  };
}

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await branchesApi.getAll();
      setBranches((data as unknown as Record<string, unknown>[]).map(mapBranch));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar sucursales");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const createBranch = async (input: CreateBranchInput) => {
    const raw = await branchesApi.create(input);
    const branch = mapBranch(raw as unknown as Record<string, unknown>);
    setBranches((prev) => [...prev, branch]);
    return branch;
  };

  const updateBranch = async (id: string, input: Partial<CreateBranchInput>) => {
    const raw = await branchesApi.update(id, input);
    const branch = mapBranch(raw as unknown as Record<string, unknown>);
    setBranches((prev) => prev.map((b) => (b.id === id ? branch : b)));
    return branch;
  };

  const deleteBranch = async (id: string) => {
    await branchesApi.delete(id);
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return { branches, isLoading, error, createBranch, updateBranch, deleteBranch, refetch: fetchBranches };
}
