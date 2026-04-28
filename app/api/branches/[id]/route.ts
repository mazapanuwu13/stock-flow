import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getBranchById, updateBranch, deleteBranch } from '@/lib/services/branch.service';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  location: z.string().min(1).max(200).optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const branch = await getBranchById(id);
    if (!branch) return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    return NextResponse.json({ data: branch });
  } catch {
    return NextResponse.json({ error: 'Error al obtener sucursal' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const branch = await updateBranch(id, parsed.data);
    if (!branch) return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    return NextResponse.json({ data: branch });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar sucursal' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const branch = await deleteBranch(id);
    if (!branch) return NextResponse.json({ error: 'Sucursal no encontrada' }, { status: 404 });
    return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar sucursal' }, { status: 500 });
  }
}
