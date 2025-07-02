import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedLeaveType, seedPermissions } from './seed.service';

async function runSeeders() {
  try {
    dotenv.config();
    const MONGO_URL = process.env.MONGO_URL || '';
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB Connected');

    // all seeder
    await seedPermissions();
    await seedLeaveType();

    console.log('🎉 All seeders finished');

    await mongoose.disconnect();
    console.log('✅ MongoDB Disconnected');

    process.exit(0);
  } catch (err) {
    console.error('❌ All Seeder failed:', err);
    process.exit(1);
  }
}

runSeeders();
