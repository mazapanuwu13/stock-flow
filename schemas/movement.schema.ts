import { z } from 'zod';

export const movementSchema = z.object({
  productId: z.string().min(1, "Producto requerido"),
  type: z.enum(['IN', 'OUT', 'TRANSFER']),
  quantity: z.number().positive("La cantidad debe ser mayor a 0"),
  sourceBranchId: z.string().optional(),
  destBranchId: z.string().optional(),
}).refine((data) => {
  if (data.type === 'TRANSFER' || data.type === 'OUT') return !!data.sourceBranchId;
  return true;
}, { message: "Sucursal de origen requerida", path: ["sourceBranchId"] })
  .refine((data) => {
  if (data.type === 'TRANSFER' || data.type === 'IN') return !!data.destBranchId;
  return true;
}, { message: "Sucursal de destino requerida", path: ["destBranchId"] });