import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDB } from './config/db.js';
import { ensureBootstrapAdmin } from './controllers/auth.controller.js';

const port = Number(process.env.PORT || 3000);

try {
  await connectDB(process.env.MONGODB_URI || '');
  await ensureBootstrapAdmin();
  const server = app.listen(port, () => {
    console.log(`Surplus-to-Shelter API listening on http://localhost:${port}/api`);
  });

  server.on('error', async (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use by another process. Stop any other running backend instances before starting.`);
    } else {
      console.error('Server error:', err);
    }
    await mongoose.disconnect();
    process.exit(1);
  });

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, () =>
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      })
    );
  }
} catch (error) {
  console.error('Backend startup failed:', error);
  process.exit(1);
}
