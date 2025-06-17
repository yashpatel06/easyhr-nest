import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { COLLECTIONS, dcSchemaOptions } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.Department })
export class Department extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  displayName: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
