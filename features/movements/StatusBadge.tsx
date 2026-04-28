"use client";

import { Badge } from "@/components/ui/badge";
import type { MovementStatus } from "@/types";

interface StatusBadgeProps {
  status: MovementStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Pending
        </Badge>
      );
    case "processed":
      return (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Processed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
          Failed
        </Badge>
      );
  }
}
