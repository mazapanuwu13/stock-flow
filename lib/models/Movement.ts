import { Schema, model, models } from 'mongoose';

const MovementSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, enum: ['IN', 'OUT', 'TRANSFER'], required: true },
  sourceBranchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
  destBranchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
  quantity: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'failed'], 
    default: 'pending' 
  },
  retryCount: { type: Number, default: 0 },
  errorReason: { type: String },
}, { timestamps: true });

export const Movement = models.Movement || model('Movement', MovementSchema);