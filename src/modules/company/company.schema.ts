import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { COLLECTIONS, dcSchemaOptions } from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.Company })
export class Company extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  contactNo: string;

  @Prop()
  alternateContactNo: string;

  @Prop()
  ownerName: string;

  @Prop()
  contactPerson: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  pincode: string;

  @Prop()
  companyLogo: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
