import { z } from "zod";

export const movementTypeSchema = z.enum(["entry", "exit", "transfer"]);

export const createMovementSchema = z
  .object({
    type: movementTypeSchema,
    productId: z.string().min(1, "Product is required"),
    sourceBranchId: z.string().optional(),
    destinationBranchId: z.string().optional(),
    quantity: z.number().int().positive("Quantity must be a positive number"),
  })
  .refine(
    (data) => {
      // Entry requires destination
      if (data.type === "entry" && !data.destinationBranchId) {
        return false;
      }
      // Exit requires source
      if (data.type === "exit" && !data.sourceBranchId) {
        return false;
      }
      // Transfer requires both
      if (data.type === "transfer" && (!data.sourceBranchId || !data.destinationBranchId)) {
        return false;
      }
      return true;
    },
    {
      message: "Invalid branch configuration for movement type",
    }
  )
  .refine(
    (data) => {
      // For transfers, source and destination must be different
      if (data.type === "transfer" && data.sourceBranchId === data.destinationBranchId) {
        return false;
      }
      return true;
    },
    {
      message: "Source and destination branches must be different",
    }
  );

export type CreateMovementSchema = z.infer<typeof createMovementSchema>;
