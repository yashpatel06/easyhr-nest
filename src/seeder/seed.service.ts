import mongoose from 'mongoose';
import { PermissionMasterSchema } from 'src/modules/permission/permission.schema';
import { COLLECTIONS, EUserType } from 'src/utils/common';
import * as permissions from 'src/seeder/permission.seed.json';
import * as leaveType from 'src/seeder/leaveType.seed.json';
import { RoleMasterSchema } from 'src/modules/role/role.schema';
import { LeaveTypeMasterSchema } from 'src/modules/leaveTypeMaster/leaveTypeMaster.schema';

export async function seedPermissions() {
  try {
    const PermissionMasterModel = mongoose.model(
      'PermissionMaster',
      PermissionMasterSchema,
      COLLECTIONS.PermissionMaster,
    );

    const RoleMasterModel = mongoose.model(
      'RoleMaster',
      RoleMasterSchema,
      COLLECTIONS.RoleMaster,
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

    const permissionData = await PermissionMasterModel.find(
      {
        isActive: true,
        isDeleted: false,
        permissionType: { $in: [EUserType.System] },
      },
      { _id: 1 },
    ).lean();
    const permissionIds = permissionData?.map((p) => p._id);

    // Add all permission to super admin role
    await RoleMasterModel.findOneAndUpdate(
      {
        name: 'Super Admin',
        roleType: EUserType.System,
        isActive: true,
        isDeleted: false,
      },
      { $set: { permissionIds } },
      { new: true },
    );

    console.log('🎉 Permission seeding completed.');
  } catch (err) {
    console.error('❌ Permission Seeding error:', err);
    process.exit(1);
  }
}

export async function seedLeaveType() {
  try {
    const LeaveTypeMasterModel = mongoose.model(
      'LeaveTypeMaster',
      LeaveTypeMasterSchema,
      COLLECTIONS.LeaveTypeMaster,
    );

    for (const ele of leaveType) {
      const exists = await LeaveTypeMasterModel.findOne({
        name: ele.name,
      });
      if (!exists) {
        await LeaveTypeMasterModel.create(ele);
        // console.log(`✅ Inserted: ${permission.name}`);
      } else {
        // console.log(`⚠️ Already exists: ${permission.name}`);
      }
    }

    console.log('🎉 LeaveType seeding completed.');
  } catch (error) {
    console.error('❌ LeaveType Seeding error:', error);
    process.exit(1);
  }
}
