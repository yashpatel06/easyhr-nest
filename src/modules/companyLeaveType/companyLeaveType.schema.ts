import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { COLLECTIONS, dcSchemaOptions } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.CompanyLeaveType })
export class CompanyLeaveType extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop()
  description: string;

  @Prop()
  leaveCount: number;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.LeaveTypeMaster })
  leaveTypeMasterId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Company })
  companyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: Boolean, default: false })
  isCarryForword: boolean;

  @Prop({ type: Boolean, default: false })
  isCashable: boolean;

  @Prop({ type: Boolean, default: false })
  isRequiredProof: boolean;
}

export const CompanyLeaveTypeSchema =
  SchemaFactory.createForClass(CompanyLeaveType);
