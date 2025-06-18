import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';
import { COLLECTIONS } from './common';

@Schema()
export class DbDefaultFields {
  @Prop({ type: mongoose.Schema.ObjectId, auto: true })
  _id?: MongooseSchema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.User })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.User })
  updatedBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.ObjectId, ref: COLLECTIONS.User })
  deletedBy?: MongooseSchema.Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}
