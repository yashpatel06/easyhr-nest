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
  LeaveTypeMaster: 'leave_type_master',
  CompanyLeaveType: 'company_leave_type',
  EmployeeLeave: 'employee_leave',
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

export enum ELeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Cancelled = 'Cancelled',
  rejected = 'Rejected',
}

export enum ELeaveDayType {
  HalfDay = 'Half Day',
  FullDay = 'Full Day',
}

export enum ELeaveHalfDayType {
  FirstHalf = 'First Half',
  SecondHalf = 'Second Half',
}
