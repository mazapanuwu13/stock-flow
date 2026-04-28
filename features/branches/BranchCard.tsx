"use client";

import { MapPin, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Branch, Product } from "@/types";

interface BranchCardProps {
  branch: Branch;
  products: Product[];
  onEdit?: (branch: Branch) => void;
  onDelete?: (branchId: string) => void;
}

export function BranchCard({ branch, products, onEdit, onDelete }: BranchCardProps) {
  const totalProducts = products.filter(
    (p) => (p.stockByBranch[branch.id] || 0) > 0
  ).length;

  const totalUnits = products.reduce(
    (sum, p) => sum + (p.stockByBranch[branch.id] || 0),
    0
  );

  return (
    <Card className="group relative">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{branch.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-3.5 w-3.5" />
            {branch.location}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(branch)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete?.(branch.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-2xl font-bold">{totalProducts}</p>
            <p className="text-xs text-muted-foreground">Products</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{totalUnits.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Units</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
