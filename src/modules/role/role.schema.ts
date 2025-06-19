import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { COLLECTIONS, dcSchemaOptions, EUserType } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.RoleMaster })
export class RoleMaster extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop({ type: String, enum: EUserType })
  roleType: string;

  @Prop({ type: Boolean })
  isDefault: boolean;

  @Prop({ type: [mongoose.Schema.ObjectId], ref: COLLECTIONS.PermissionMaster })
  permissionIds: MongooseSchema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Company })
  companyId: MongooseSchema.Types.ObjectId;
}

export const RoleMasterSchema = SchemaFactory.createForClass(RoleMaster);
