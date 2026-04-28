import { NextResponse } from 'next/server';
import { getStockByBranch } from '@/lib/services/stock.service';

export async function GET(_: Request, { params }: { params: Promise<{ branchId: string }> }) {
  try {
    const { branchId } = await params;
    const stock = await getStockByBranch(branchId);
    return NextResponse.json({ data: stock });
  } catch {
    return NextResponse.json({ error: 'Error al obtener stock de la sucursal' }, { status: 500 });
  }
}
