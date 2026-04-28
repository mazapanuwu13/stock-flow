import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllProducts, createProduct } from '@/lib/services/product.service';

const createSchema = z.object({
  sku: z.string().min(1).max(20).regex(/^[A-Z0-9-]+$/, 'SKU debe ser alfanumérico en mayúsculas'),
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  category: z.string().min(1),
});

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ data: products });
  } catch {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const product = await createProduct(parsed.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json({ error: 'El SKU ya existe' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}
