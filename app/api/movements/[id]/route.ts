import { NextResponse } from 'next/server';
import { getMovementById } from '@/lib/services/movement.service';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movement = await getMovementById(id);
    if (!movement) return NextResponse.json({ error: 'Movimiento no encontrado' }, { status: 404 });
    return NextResponse.json({ data: movement });
  } catch {
    return NextResponse.json({ error: 'Error al obtener movimiento' }, { status: 500 });
  }
}
