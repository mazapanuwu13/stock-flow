"use client";

import { useState } from "react";
import { ArrowRightLeft, Package, Building2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import type { Product, Branch, MovementType, CreateMovementInput } from "@/types";

interface MovementFormProps {
  products: Product[];
  branches: Branch[];
  onSubmit: (movement: CreateMovementInput) => void;
}

export function MovementForm({ products, branches, onSubmit }: MovementFormProps) {
  const [type, setType] = useState<MovementType>("entry");
  const [productId, setProductId] = useState("");
  const [sourceBranchId, setSourceBranchId] = useState("");
  const [destinationBranchId, setDestinationBranchId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      productId,
      sourceBranchId: type !== "entry" ? sourceBranchId : undefined,
      destinationBranchId: type !== "exit" ? destinationBranchId : undefined,
      quantity: parseInt(quantity) || 0,
    });
    // Reset form
    setProductId("");
    setSourceBranchId("");
    setDestinationBranchId("");
    setQuantity("");
  };

  const showSourceBranch = type === "exit" || type === "transfer";
  const showDestinationBranch = type === "entry" || type === "transfer";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Create Movement
        </CardTitle>
        <CardDescription>
          Record stock entries, exits, or transfers between branches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Movement Type</FieldLabel>
              <Select value={type} onValueChange={(v) => setType(v as MovementType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Entry
                    </span>
                  </SelectItem>
                  <SelectItem value="exit">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      Exit
                    </span>
                  </SelectItem>
                  <SelectItem value="transfer">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      Transfer
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product
              </FieldLabel>
              <Select value={productId} onValueChange={setProductId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {showSourceBranch && (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Source Branch
                </FieldLabel>
                <Select value={sourceBranchId} onValueChange={setSourceBranchId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter((b) => b.id !== destinationBranchId)
                      .map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            {showDestinationBranch && (
              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Destination Branch
                </FieldLabel>
                <Select
                  value={destinationBranchId}
                  onValueChange={setDestinationBranchId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter((b) => b.id !== sourceBranchId)
                      .map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field>
              <FieldLabel className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Quantity
              </FieldLabel>
              <Input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="mt-6 w-full">
            Create Movement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
