import { Schema, model, models } from 'mongoose';

const StockSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
  quantity: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

// CRUCIAL: Un producto solo puede tener un registro de stock por sucursal
StockSchema.index({ productId: 1, branchId: 1 }, { unique: true });

export const Stock = models.Stock || model('Stock', StockSchema);