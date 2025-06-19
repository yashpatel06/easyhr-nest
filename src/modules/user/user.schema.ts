import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import {
  COLLECTIONS,
  dcSchemaOptions,
  EGender,
  EUserType,
} from 'src/utils/common';
import { DbDefaultFields } from 'src/utils/dbDefault.schema';

@Schema({ ...dcSchemaOptions, collection: COLLECTIONS.User })
export class User extends DbDefaultFields {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  contactNo: string;

  @Prop({ type: String, enum: EUserType, default: EUserType.Client })
  userType: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.RoleMaster })
  roleId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Department })
  departmentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Designation })
  designationId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: EGender })
  gender: String;

  @Prop()
  dob: Date;

  @Prop()
  dateOfJoining: Date;

  @Prop()
  address: string;

  @Prop()
  profilePic: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Designation })
  companyId: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
