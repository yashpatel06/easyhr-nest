import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { COLLECTIONS, dcSchemaOptions } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.Designation })
export class Designation extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.RoleMaster })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Department })
  departmentId: MongooseSchema.Types.ObjectId;
}

export const DesignationSchema = SchemaFactory.createForClass(Designation);
