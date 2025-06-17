import { SchemaOptions } from '@nestjs/mongoose';

export const dcSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { versionKey: false },
};

export const COLLECTIONS = {
  User: 'user',
  RoleMaster: 'role_master',
  Department: 'department',
  Designation: 'designation',
};

export const ROLES = {
  Admin: 'Admin',
  User: 'User',
};
