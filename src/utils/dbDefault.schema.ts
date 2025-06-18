import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { mongo } from 'mongoose';
import { COLLECTIONS } from './common';

@Schema()
export class DbDefaultFields {
  @Prop({ type: mongoose.Schema.ObjectId, auto: true })
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: COLLECTIONS.User })
  createdBy?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: COLLECTIONS.User })
  updatedBy?: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: COLLECTIONS.User })
  deletedBy?: mongoose.Schema.Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}
