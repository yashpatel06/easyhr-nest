import { SchemaOptions } from '@nestjs/mongoose';

export const dcSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { versionKey: false },
};

export const COLLECTIONS = {
  User: 'user',
  RoleMaster: 'role_master',
  Department: 'department',
};

export const ROLES = {
  Admin: 'Admin',
  User: 'User',
};
