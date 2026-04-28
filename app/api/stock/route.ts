import { NextResponse } from 'next/server';
import { getAllStock } from '@/lib/services/stock.service';

export async function GET() {
  try {
    const stock = await getAllStock();
    return NextResponse.json({ data: stock });
  } catch {
    return NextResponse.json({ error: 'Error al obtener stock' }, { status: 500 });
  }
}
