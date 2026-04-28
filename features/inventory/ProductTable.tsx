"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Package, MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty } from "@/components/ui/empty";
import { StockBadge } from "./StockBadge";
import { getProductTotalStock } from "./use-inventory";
import { formatCurrency } from "@/lib/utils/formatting";
import type { Product, Branch } from "@/types";

interface ProductTableProps {
  products: Product[];
  branches: Branch[];
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
}

type SortField = "name" | "sku" | "category" | "stock" | "price";
type SortDirection = "asc" | "desc";

export function ProductTable({
  products,
  branches,
  onEditProduct,
  onDeleteProduct,
}: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "sku":
        comparison = a.sku.localeCompare(b.sku);
        break;
      case "category":
        comparison = a.category.localeCompare(b.category);
        break;
      case "stock":
        comparison = getProductTotalStock(a) - getProductTotalStock(b);
        break;
      case "price":
        comparison = a.price - b.price;
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  if (products.length === 0) {
    return (
      <Empty>
        <Empty.Icon>
          <Package className="h-10 w-10" />
        </Empty.Icon>
        <Empty.Title>No products found</Empty.Title>
        <Empty.Description>
          Add your first product to start tracking inventory.
        </Empty.Description>
      </Empty>
    );
  }

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("name")}
              >
                Product
                <SortIcon field="name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("sku")}
              >
                SKU
                <SortIcon field="sku" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("category")}
              >
                Category
                <SortIcon field="category" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("stock")}
              >
                Total Stock
                <SortIcon field="stock" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => handleSort("price")}
              >
                Price
                <SortIcon field="price" />
              </Button>
            </TableHead>
            <TableHead className="text-center">Stock by Branch</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => {
            const totalStock = getProductTotalStock(product);

            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <code className="rounded bg-muted px-2 py-1 text-xs">
                    {product.sku}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <StockBadge stock={totalStock} threshold={50} />
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64" align="center">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Stock Distribution</p>
                        {branches.map((branch) => (
                          <div
                            key={branch.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {branch.name}
                            </span>
                            <span className="font-medium">
                              {product.stockByBranch[branch.id] || 0}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditProduct?.(product)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDeleteProduct?.(product.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
