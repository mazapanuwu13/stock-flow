import { z } from 'zod';

export const branchSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  location: z.string().min(5, "La ubicación es obligatoria"),
});