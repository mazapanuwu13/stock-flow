import dbConnect from '@/lib/db/mongodb';
import { Stock } from '@/models/Stock';

export async function getAllStock() {
  await dbConnect();
  return Stock.find().populate('productId', 'name sku category').populate('branchId', 'name location').lean();
}

export async function getStockByBranch(branchId: string) {
  await dbConnect();
  return Stock.find({ branchId }).populate('productId', 'name sku category price').lean();
}

export async function getStockByProduct(productId: string) {
  await dbConnect();
  return Stock.find({ productId }).populate('branchId', 'name location').lean();
}
