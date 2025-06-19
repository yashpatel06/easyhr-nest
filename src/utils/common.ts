import { SchemaOptions } from '@nestjs/mongoose';

export const dcSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { versionKey: false },
};

export const COLLECTIONS = {
  User: 'user',
  Company: 'company',
  RoleMaster: 'role_master',
  Department: 'department',
  Designation: 'designation',
};

export const ROLES = {
  Admin: 'Admin',
  User: 'User',
};

export const EGender = {
  Male: 'male',
  Female: 'female',
};

export enum EUserType {
  System = 'System',
  Client = 'Client',
}
