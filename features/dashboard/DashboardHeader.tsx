"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Building2,
  ArrowLeftRight,
  FileBarChart,
  Search,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Product, Branch, DashboardView } from "@/types";

interface DashboardHeaderProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  products: Product[];
  branches: Branch[];
  onSearchSelect?: (type: "product" | "branch", id: string) => void;
}

const navItems: { id: DashboardView; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "branches", label: "Branches", icon: Building2 },
  { id: "movements", label: "Movements", icon: ArrowLeftRight },
  { id: "reports", label: "Reports", icon: FileBarChart },
];

export function DashboardHeader({
  currentView,
  onViewChange,
  products,
  branches,
  onSearchSelect,
}: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">StockFlow</span>
          </div>

          {/* Navigation */}
          <nav className="ml-8 flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Search */}
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="relative h-9 w-64 justify-start gap-2 text-muted-foreground"
            >
              <Search className="h-4 w-4" />
              <span>Search products or SKUs...</span>
              <kbd className="pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                <Command className="h-3 w-3" />K
              </kbd>
            </Button>
          </div>
        </div>
      </header>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search products, SKUs, or branches..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => {
                  onSearchSelect?.("product", product.id);
                  onViewChange("inventory");
                  setOpen(false);
                }}
              >
                <Package className="mr-2 h-4 w-4" />
                <span>{product.name}</span>
                <span className="ml-2 text-muted-foreground">{product.sku}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Branches">
            {branches.map((branch) => (
              <CommandItem
                key={branch.id}
                onSelect={() => {
                  onSearchSelect?.("branch", branch.id);
                  onViewChange("branches");
                  setOpen(false);
                }}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>{branch.name}</span>
                <span className="ml-2 text-muted-foreground">{branch.location}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
