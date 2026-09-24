import mongoose from 'mongoose';

export async function connectDB(uri?: string): Promise<void> {
  const connectionUri = uri || process.env.MONGODB_URI;
  if (!connectionUri) throw new Error('MONGODB_URI is required. Set it in server/.env to your MongoDB Atlas connection string.');
  if (/^mongodb:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(connectionUri)) throw new Error('Local MongoDB is disabled for this project. Set MONGODB_URI to your Atlas connection string in server/.env.');

  try {
    await mongoose.connect(connectionUri, {
      dbName: process.env.MONGODB_DB_NAME || 'surplus_to_shelter',
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    await mongoose.connection.db?.admin().ping();
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (error) {
    await mongoose.disconnect().catch(() => undefined);
    throw new Error(`MongoDB Atlas connection failed: ${(error as Error).message}`);
  }
}
