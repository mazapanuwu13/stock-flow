import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(100),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "SKU must be uppercase alphanumeric with dashes"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Price must be positive"),
  stockByBranch: z.record(z.string(), z.number().int().nonnegative()),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
