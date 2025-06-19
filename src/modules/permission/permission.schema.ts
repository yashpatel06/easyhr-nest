import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { COLLECTIONS, dcSchemaOptions, EUserType } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.PermissionMaster })
export class PermissionMaster extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;

  @Prop()
  group: string;

  @Prop({ type: Schema, enum: EUserType })
  permissionType: string;
}

export const PermissionMasterSchema =
  SchemaFactory.createForClass(PermissionMaster);
