import dbConnect from '@/lib/db/mongodb';
import { Movement } from '@/models/Movement';
import { Stock } from '@/models/Stock';
import mongoose from 'mongoose';

export type DbMovementType = 'IN' | 'OUT' | 'TRANSFER';

export interface CreateMovementData {
  type: DbMovementType;
  productId: string;
  sourceBranchId?: string;
  destBranchId?: string;
  quantity: number;
}

export async function getAllMovements() {
  await dbConnect();
  return Movement.find()
    .populate('productId', 'name sku')
    .populate('sourceBranchId', 'name')
    .populate('destBranchId', 'name')
    .sort({ createdAt: -1 })
    .lean();
}

export async function getMovementById(id: string) {
  await dbConnect();
  return Movement.findById(id)
    .populate('productId', 'name sku')
    .populate('sourceBranchId', 'name')
    .populate('destBranchId', 'name')
    .lean();
}

export async function createMovement(data: CreateMovementData) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { type, productId, sourceBranchId, destBranchId, quantity } = data;

    // Descontar stock de origen (OUT o TRANSFER)
    if (type === 'OUT' || type === 'TRANSFER') {
      if (!sourceBranchId) throw new Error('sourceBranchId es requerido para OUT/TRANSFER');
      const stock = await Stock.findOne({ productId, branchId: sourceBranchId }).session(session);
      if (!stock || stock.quantity < quantity) {
        throw new Error('Stock insuficiente para realizar el movimiento');
      }
      await Stock.findOneAndUpdate(
        { productId, branchId: sourceBranchId },
        { $inc: { quantity: -quantity } },
        { session }
      );
    }

    // Agregar stock en destino (IN o TRANSFER)
    if (type === 'IN' || type === 'TRANSFER') {
      if (!destBranchId) throw new Error('destBranchId es requerido para IN/TRANSFER');
      await Stock.findOneAndUpdate(
        { productId, branchId: destBranchId },
        { $inc: { quantity } },
        { upsert: true, new: true, session }
      );
    }

    const [movement] = await Movement.create(
      [{ type, productId, sourceBranchId, destBranchId, quantity, status: 'processed' }],
      { session }
    );

    await session.commitTransaction();
    return movement;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
