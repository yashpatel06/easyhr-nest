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
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  contactNo: string;

  @Prop()
  alternateContactNo: string;

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
  currentAddress: string;

  @Prop()
  currentCity: string;

  @Prop()
  currentState: string;

  @Prop()
  currentPincode: string;

  @Prop()
  permanentAddress: string;

  @Prop()
  permanentCity: string;

  @Prop()
  permanentState: string;

  @Prop()
  permanentPincode: string;

  @Prop()
  profilePicture: string;

  @Prop()
  aadharNumber: string;

  @Prop()
  panNumber: string;

  @Prop()
  emergnacyContactName: string;

  @Prop()
  emergnacyContactNumber: string;

  @Prop()
  bankName: string;

  @Prop()
  bankAccountNumber: string;

  @Prop()
  bankIfscCode: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.Company })
  companyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.ObjectId], ref: COLLECTIONS.User })
  reportingManager: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [mongoose.Schema.ObjectId], ref: COLLECTIONS.User })
  projectManager: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
