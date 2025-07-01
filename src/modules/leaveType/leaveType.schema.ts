import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { COLLECTIONS, dcSchemaOptions } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.LeaveType })
export class LeaveType extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop()
  description: string;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Company })
  companyId: MongooseSchema.Types.ObjectId;
}

export const LeaveTypeSchema = SchemaFactory.createForClass(LeaveType);
