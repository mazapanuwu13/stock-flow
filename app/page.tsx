"use client";

import { useState } from "react";
import {
  DollarSign,
  Package,
  AlertTriangle,
  Building2,
  ArrowLeftRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Feature imports
import { DashboardHeader, MetricCard, ReportsView } from "@/features/dashboard";
import { ProductTable, ProductDialog, useInventoryMetrics } from "@/features/inventory";
import { MovementForm, MovementTable, simulateMovementProcessing } from "@/features/movements";
import { BranchList, BranchDialog, useBranches } from "@/features/branches";

// Data & Types
import { initialProducts, initialMovements } from "@/lib/data/seed";
import { formatCurrency } from "@/lib/utils/formatting";
import type {
  Product,
  Branch,
  Movement,
  DashboardView,
  CreateProductInput,
  CreateMovementInput,
  MovementStatus,
} from "@/types"; // Branch still used by editingBranch state

export default function StockFlowDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("dashboard");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);

  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Branches — connected to API
  const { branches, isLoading: branchesLoading, createBranch, updateBranch, deleteBranch } = useBranches();
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Use the inventory metrics hook
  const { totalStockValue, lowStockProducts } = useInventoryMetrics(products);
  const pendingMovements = movements.filter((m) => m.status === "pending").length;

  // Movement status change handler
  const handleMovementStatusChange = (id: string, status: MovementStatus) => {
    setMovements((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    if (status === "processed") {
      toast.success("Movement processed successfully");
    } else {
      toast.error("Movement failed", {
        description: "Please check the movement details and try again.",
      });
    }
  };

  // Product handlers
  const handleAddProduct = (productData: CreateProductInput) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts([...products, newProduct]);
    toast.success("Product added successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductDialogOpen(true);
  };

  const handleSaveProduct = (productData: CreateProductInput) => {
    if (editingProduct) {
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p
        )
      );
      toast.success("Product updated successfully");
      setEditingProduct(null);
    } else {
      handleAddProduct(productData);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast.success("Product deleted successfully");
  };

  // Movement handlers
  const handleCreateMovement = (movementData: CreateMovementInput) => {
    const newMovement: Movement = {
      ...movementData,
      id: `mov-${Date.now()}`,
      status: "pending",
      createdAt: new Date(),
    };
    setMovements([newMovement, ...movements]);
    toast.success("Movement created successfully", {
      description: "Status: Pending",
    });

    // Simulate processing
    simulateMovementProcessing(newMovement.id, handleMovementStatusChange);
  };

  // Render view content
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Stock Value"
                value={formatCurrency(totalStockValue)}
                icon={DollarSign}
                trend={{ value: 12.5, isPositive: true }}
              />
              <MetricCard
                title="Active Movements"
                value={pendingMovements}
                icon={ArrowLeftRight}
                variant="warning"
              />
              <MetricCard
                title="Low Stock Alerts"
                value={lowStockProducts.length}
                icon={AlertTriangle}
                variant={lowStockProducts.length > 0 ? "warning" : "success"}
              />
              <MetricCard
                title="Total Branches"
                value={branches.length}
                icon={Building2}
              />
            </div>

            {/* Stock Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Overview
                </CardTitle>
                <Button size="sm" onClick={() => setCurrentView("inventory")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <ProductTable
                  products={products.slice(0, 5)}
                  branches={branches}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5" />
                  Recent Movements
                </CardTitle>
                <Button size="sm" onClick={() => setCurrentView("movements")}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <MovementTable
                  movements={movements.slice(0, 5)}
                  products={products}
                  branches={branches}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
                <p className="text-muted-foreground">
                  Manage your products and stock levels across all branches.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
            <ProductTable
              products={products}
              branches={branches}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
        );

      case "branches":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Sucursales</h2>
                <p className="text-muted-foreground">
                  Visualiza y administra tus ubicaciones.
                </p>
              </div>
              <Button onClick={() => { setEditingBranch(null); setBranchDialogOpen(true); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Sucursal
              </Button>
            </div>
            {branchesLoading ? (
              <p className="text-muted-foreground text-sm">Cargando sucursales...</p>
            ) : (
              <BranchList
                branches={branches}
                products={products}
                onEdit={(branch) => { setEditingBranch(branch); setBranchDialogOpen(true); }}
                onDelete={async (id) => {
                  await deleteBranch(id);
                  toast.success("Sucursal eliminada");
                }}
              />
            )}
          </div>
        );

      case "movements":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Movement Registry</h2>
              <p className="text-muted-foreground">
                Create and track stock entries, exits, and transfers.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
              <MovementForm
                products={products}
                branches={branches}
                onSubmit={handleCreateMovement}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Movement History</CardTitle>
                </CardHeader>
                <CardContent>
                  <MovementTable
                    movements={movements}
                    products={products}
                    branches={branches}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
              <p className="text-muted-foreground">
                Analyze your inventory movements and trends.
              </p>
            </div>
            <ReportsView movements={movements} branches={branches} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        currentView={currentView}
        onViewChange={setCurrentView}
        products={products}
        branches={branches}
      />

      <main className="p-6">{renderContent()}</main>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={(open) => {
          setProductDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        product={editingProduct}
        existingProducts={products}
        branches={branches}
      />

      <BranchDialog
        open={branchDialogOpen}
        onOpenChange={(open) => { setBranchDialogOpen(open); if (!open) setEditingBranch(null); }}
        branch={editingBranch}
        onSave={async (data) => {
          if (editingBranch) {
            await updateBranch(editingBranch.id, data);
            toast.success("Sucursal actualizada");
          } else {
            await createBranch(data);
            toast.success("Sucursal creada");
          }
        }}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
