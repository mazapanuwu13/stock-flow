import { useMemo } from "react";
import type { Product } from "@/types";

export function useInventoryMetrics(products: Product[]) {
  const totalStock = useMemo(() => {
    return products.reduce((total, product) => {
      const productTotal = Object.values(product.stockByBranch).reduce((a, b) => a + b, 0);
      return total + productTotal;
    }, 0);
  }, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce((total, product) => {
      const productStock = Object.values(product.stockByBranch).reduce((a, b) => a + b, 0);
      return total + productStock * product.price;
    }, 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => {
      const total = Object.values(product.stockByBranch).reduce((a, b) => a + b, 0);
      return total < 100;
    });
  }, [products]);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, [products]);

  return {
    totalStock,
    totalStockValue,
    lowStockProducts,
    categories,
  };
}

export function getProductTotalStock(product: Product): number {
  return Object.values(product.stockByBranch).reduce((a, b) => a + b, 0);
}

export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))];
}
