import dbConnect from '@/lib/db/mongodb';
import { Branch } from '@/models/Branch';
import { Stock } from '@/models/Stock';

export async function getAllBranches() {
  await dbConnect();
  return Branch.find().lean();
}

export async function getBranchById(id: string) {
  await dbConnect();
  return Branch.findById(id).lean();
}

export async function createBranch(data: { name: string; location: string }) {
  await dbConnect();
  return Branch.create(data);
}

export async function updateBranch(
  id: string,
  data: Partial<{ name: string; location: string }>
) {
  await dbConnect();
  return Branch.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
}

export async function deleteBranch(id: string) {
  await dbConnect();
  await Stock.deleteMany({ branchId: id });
  return Branch.findByIdAndDelete(id);
}
