import dbConnect from '@/lib/db/mongodb';
import { Product } from '@/models/Product';
import { Stock } from '@/models/Stock';

export async function getAllProducts() {
  await dbConnect();
  return Product.find().lean();
}

export async function getProductById(id: string) {
  await dbConnect();
  return Product.findById(id).lean();
}

export async function createProduct(data: {
  sku: string;
  name: string;
  price: number;
  category: string;
}) {
  await dbConnect();
  return Product.create(data);
}

export async function updateProduct(
  id: string,
  data: Partial<{ name: string; price: number; category: string }>
) {
  await dbConnect();
  return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteProduct(id: string) {
  await dbConnect();
  await Stock.deleteMany({ productId: id });
  return Product.findByIdAndDelete(id);
}
