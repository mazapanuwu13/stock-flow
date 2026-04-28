import { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  sku: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);