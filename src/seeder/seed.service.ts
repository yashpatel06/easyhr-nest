import mongoose from 'mongoose';
import { PermissionMasterSchema } from 'src/modules/permission/permission.schema';
import { COLLECTIONS } from 'src/utils/common';
import * as permissions from 'src/seeder/permission.seed.json';

export async function seedPermissions() {
  try {
    const PermissionMasterModel = mongoose.model(
      'PermissionMaster',
      PermissionMasterSchema,
      COLLECTIONS.PermissionMaster,
    );
    for (const permission of permissions) {
      const exists = await PermissionMasterModel.findOne({
        name: permission.name,
      });
      if (!exists) {
        await PermissionMasterModel.create(permission);
        // console.log(`✅ Inserted: ${permission.name}`);
      } else {
        // console.log(`⚠️ Already exists: ${permission.name}`);
      }
    }

    console.log('🎉 Permission seeding completed.');
  } catch (err) {
    console.error('❌ Permission Seeding error:', err);
    process.exit(1);
  }
}
