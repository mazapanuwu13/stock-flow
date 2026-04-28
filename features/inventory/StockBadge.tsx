"use client";

import { cn } from "@/lib/utils";

interface StockBadgeProps {
  stock: number;
  threshold?: number;
  className?: string;
}

export function StockBadge({ stock, threshold = 50, className }: StockBadgeProps) {
  const isLowStock = stock < threshold;

  return (
    <span
      className={cn(
        "tabular-nums font-medium",
        isLowStock && "text-amber-400",
        className
      )}
    >
      {stock.toLocaleString()}
    </span>
  );
}
