"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { getCategories } from "./use-inventory";
import type { Product, Branch, CreateProductInput } from "@/types";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: CreateProductInput) => void;
  product?: Product | null;
  existingProducts: Product[];
  branches: Branch[];
}

const defaultCategories = ["Electronics", "Furniture", "Food & Beverage", "Sports", "Home"];

export function ProductDialog({
  open,
  onOpenChange,
  onSave,
  product,
  existingProducts,
  branches,
}: ProductDialogProps) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stockByBranch, setStockByBranch] = useState<Record<string, number>>({});

  const categories = [...new Set([...defaultCategories, ...getCategories(existingProducts)])];

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategory(product.category);
      setPrice(product.price.toString());
      setStockByBranch(product.stockByBranch);
    } else {
      setName("");
      setSku("");
      setCategory("");
      setPrice("");
      setStockByBranch(
        branches.reduce((acc, branch) => ({ ...acc, [branch.id]: 0 }), {})
      );
    }
  }, [product, branches, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      stockByBranch,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Enter the details for the new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Product Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Wireless Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="sku">SKU</FieldLabel>
              <Input
                id="sku"
                placeholder="e.g., WHP-001"
                value={sku}
                onChange={(e) => setSku(e.target.value.toUpperCase())}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Category</FieldLabel>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="price">Price ($)</FieldLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Field>
            {!product && (
              <div className="space-y-3">
                <FieldLabel>Initial Stock by Branch</FieldLabel>
                <div className="grid gap-3">
                  {branches.map((branch) => (
                    <div key={branch.id} className="flex items-center gap-3">
                      <span className="w-40 text-sm text-muted-foreground truncate">
                        {branch.name}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        className="w-24"
                        value={stockByBranch[branch.id] || 0}
                        onChange={(e) =>
                          setStockByBranch({
                            ...stockByBranch,
                            [branch.id]: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Save Changes" : "Add Product"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
