import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { PermissionMasterSchema } from 'src/modules/permission/permission.schema';
import { COLLECTIONS } from 'src/utils/common';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL || '';

const PermissionMasterModel = mongoose.model(
  'PermissionMaster',
  PermissionMasterSchema,
  COLLECTIONS.PermissionMaster,
);

const permissions = [
  // Dashboard permission
  { name: 'view_dashboard', displayName: 'View Dashboard', group: 'dashboard' },

  // Company permission
  { name: 'add_company', displayName: 'Add Company', group: 'company' },
  { name: 'edit_company', displayName: 'Edit Company', group: 'company' },
  { name: 'delete_company', displayName: 'Delete Company', group: 'company' },
  { name: 'list_company', displayName: 'List Company', group: 'company' },

  // User permission
  { name: 'add_user', displayName: 'Add User', group: 'user' },
  { name: 'edit_user', displayName: 'Edit User', group: 'user' },
  { name: 'delete_user', displayName: 'Delete User', group: 'user' },
  { name: 'list_user', displayName: 'List Users', group: 'user' },

  // Role permission
  { name: 'add_role', displayName: 'Add Role', group: 'role' },
  { name: 'edit_role', displayName: 'Edit Role', group: 'role' },
  { name: 'delete_role', displayName: 'Delete Role', group: 'role' },
  { name: 'list_role', displayName: 'List Roles', group: 'role' },

  // PermissionData
  {
    name: 'add_permission',
    displayName: 'Add Permission',
    group: 'permission',
  },
  {
    name: 'edit_permission',
    displayName: 'Edit Permission',
    group: 'permission',
  },
  {
    name: 'delete_permission',
    displayName: 'Delete Permission',
    group: 'permission',
  },
  {
    name: 'list_permission',
    displayName: 'List Permissions',
    group: 'permission',
  },

  // Designation permission
  {
    name: 'add_designation',
    displayName: 'Add Designation',
    group: 'designation',
  },
  {
    name: 'edit_designation',
    displayName: 'Edit Designation',
    group: 'designation',
  },
  {
    name: 'delete_designation',
    displayName: 'Delete Designation',
    group: 'designation',
  },
  {
    name: 'list_designation',
    displayName: 'List Designations',
    group: 'designation',
  },

  // Department permission
  {
    name: 'add_department',
    displayName: 'Add Department',
    group: 'department',
  },
  {
    name: 'edit_department',
    displayName: 'Edit Department',
    group: 'department',
  },
  {
    name: 'delete_department',
    displayName: 'Delete Department',
    group: 'department',
  },
  {
    name: 'list_department',
    displayName: 'List Department',
    group: 'department',
  },
];

async function seedPermissions() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB Connected');

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
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedPermissions();
