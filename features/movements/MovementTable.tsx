"use client";

import { useState } from "react";
import { ArrowRight, ArrowDown, ArrowUp, Filter, ArrowLeftRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Empty } from "@/components/ui/empty";
import { StatusBadge } from "./StatusBadge";
import { ClientDate } from "./ClientDate";
import { filterMovements } from "./movement-logic";
import type { Movement, Product, Branch, MovementType, MovementStatus } from "@/types";

interface MovementTableProps {
  movements: Movement[];
  products: Product[];
  branches: Branch[];
}

export function MovementTable({ movements, products, branches }: MovementTableProps) {
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<MovementStatus | "all">("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const getProductName = (productId: string) =>
    products.find((p) => p.id === productId)?.name || "Unknown";

  const getBranchName = (branchId?: string) =>
    branchId ? branches.find((b) => b.id === branchId)?.name || "Unknown" : "-";

  const filteredMovements = filterMovements(movements, {
    type: typeFilter,
    status: statusFilter,
    branchId: branchFilter,
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
  });

  const getTypeIcon = (type: MovementType) => {
    switch (type) {
      case "entry":
        return <ArrowDown className="h-4 w-4 text-emerald-400" />;
      case "exit":
        return <ArrowUp className="h-4 w-4 text-red-400" />;
      case "transfer":
        return <ArrowRight className="h-4 w-4 text-blue-400" />;
    }
  };

  if (movements.length === 0) {
    return (
      <Empty>
        <Empty.Icon>
          <ArrowLeftRight className="h-10 w-10" />
        </Empty.Icon>
        <Empty.Title>No movements recorded</Empty.Title>
        <Empty.Description>
          Create your first movement to start tracking stock changes.
        </Empty.Description>
      </Empty>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters:
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as MovementType | "all")}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="entry">Entry</SelectItem>
            <SelectItem value="exit">Exit</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as MovementStatus | "all")}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              {dateRange.from
                ? `${dateRange.from.toLocaleDateString()} - ${
                    dateRange.to?.toLocaleDateString() || "..."
                  }`
                : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(typeFilter !== "all" ||
          statusFilter !== "all" ||
          branchFilter !== "all" ||
          dateRange.from) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTypeFilter("all");
              setStatusFilter("all");
              setBranchFilter("all");
              setDateRange({});
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No movements match your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(movement.type)}
                      <span className="capitalize">{movement.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {getProductName(movement.productId)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getBranchName(movement.sourceBranchId)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getBranchName(movement.destinationBranchId)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {movement.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={movement.status} />
                  </TableCell>
                  <TableCell>
                    <ClientDate date={movement.createdAt} className="text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
