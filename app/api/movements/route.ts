import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllMovements, createMovement } from '@/lib/services/movement.service';

const createSchema = z
  .object({
    type: z.enum(['IN', 'OUT', 'TRANSFER']),
    productId: z.string().min(1),
    sourceBranchId: z.string().optional(),
    destBranchId: z.string().optional(),
    quantity: z.number().int().positive(),
  })
  .refine(
    (d) => {
      if (d.type === 'IN') return !!d.destBranchId;
      if (d.type === 'OUT') return !!d.sourceBranchId;
      if (d.type === 'TRANSFER') return !!d.sourceBranchId && !!d.destBranchId;
      return true;
    },
    { message: 'Configuración de sucursales inválida para el tipo de movimiento' }
  );

export async function GET() {
  try {
    const movements = await getAllMovements();
    return NextResponse.json({ data: movements });
  } catch {
    return NextResponse.json({ error: 'Error al obtener movimientos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const movement = await createMovement(parsed.data);
    return NextResponse.json({ data: movement }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error al crear movimiento';
    const status = msg === 'Stock insuficiente para realizar el movimiento' ? 422 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
