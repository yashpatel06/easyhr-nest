import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import {
  COLLECTIONS,
  dcSchemaOptions,
  ELeaveDayType,
  ELeaveHalfDayType,
  ELeaveStatus,
} from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.EmployeeLeave })
export class EmployeeLeave extends DbDefaultFields {
  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.User })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.CompanyLeaveType })
  companyLeaveTypeId: MongooseSchema.Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  reason: string;

  @Prop({ type: String, enum: ELeaveStatus, default: ELeaveStatus.Pending })
  status: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Company })
  companyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.User })
  actionBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ELeaveDayType })
  dayType: string;

  @Prop({ type: String, enum: ELeaveHalfDayType })
  halfDayType: string;
}

export const EmployeeLeaveSchema = SchemaFactory.createForClass(EmployeeLeave);
