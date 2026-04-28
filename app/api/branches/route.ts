import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllBranches, createBranch } from '@/lib/services/branch.service';

const createSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().min(1).max(200),
});

export async function GET() {
  try {
    const branches = await getAllBranches();
    return NextResponse.json({ data: branches });
  } catch {
    return NextResponse.json({ error: 'Error al obtener sucursales' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const branch = await createBranch(parsed.data);
    return NextResponse.json({ data: branch }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear sucursal' }, { status: 500 });
  }
}
