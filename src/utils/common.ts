import { SchemaOptions } from '@nestjs/mongoose';

export const dcSchemaOptions: SchemaOptions = {
  timestamps: true,
  toJSON: { versionKey: false },
};

export const COLLECTIONS = {
  User: 'user',
  Company: 'company',
  RoleMaster: 'role_master',
  PermissionMaster: 'permission_master',
  Department: 'department',
  Designation: 'designation',
  LeaveType: 'leave_type',
};

export enum EGender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  PreferNotToSay = 'prefer not to say',
}

export enum EUserType {
  System = 'System',
  Client = 'Client',
}
