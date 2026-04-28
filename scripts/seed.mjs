import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
try {
  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
} catch { /* .env.local not found, rely on existing env */ }

const uri = process.env.LOCAL_MONGODB_URI || process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Define la variable MONGODB_URI en .env.local");
}
async function seed() {
  try {
    console.log("⏳ Conectando a MongoDB Atlas...");
    await mongoose.connect(uri);
    console.log("✅ Conexión exitosa.");

    // Limpiar datos previos (Cuidado: esto borra todo en las colecciones mencionadas)
    await mongoose.connection.db.dropDatabase();

    // 1. Crear Sucursales
    const branches = await mongoose.connection.db.collection('branches').insertMany([
      { name: "Norte - Hermosillo", location: "Blvd. Morelos" },
      { name: "Sur - Hermosillo", location: "Colonia Centro" }
    ]);

    // 2. Crear Productos
    const products = await mongoose.connection.db.collection('products').insertMany([
      { sku: "HD-001", name: "Salchicha Jumbo", price: 150, category: "Alimentos" },
      { sku: "HD-002", name: "Pan Artesanal", price: 80, category: "Alimentos" },
      { sku: "HD-003", name: "Capsup 1L", price: 45, category: "Aderezos" }
    ]);

    // 3. Inicializar Stock (Cero en todo al inicio)
    const productIds = Object.values(products.insertedIds);
    const branchIds = Object.values(branches.insertedIds);

    const initialStock = [];
    for (const pId of productIds) {
      for (const bId of branchIds) {
        initialStock.push({ productId: pId, branchId: bId, quantity: 100 }); // Empezamos con 100 de cada uno
      }
    }
    await mongoose.connection.db.collection('stocks').insertMany(initialStock);

    console.log("✨ Base de datos poblada con éxito.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error en el seeding:", error);
    process.exit(1);
  }
}

seed();