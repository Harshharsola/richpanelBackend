import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type PagesDocument = HydratedDocument<Page>;

@Schema()
export class Page {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  pageAccessToken: string;
}

export const PagesSchema = SchemaFactory.createForClass(Page);
