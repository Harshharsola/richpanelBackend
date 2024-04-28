import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ConversationsDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop()
  userId: string;

  @Prop()
  senderId: string;

  @Prop()
  fbConvoId: string;

  @Prop()
  timeStamp: Date;
}

export const ConversationsSchema = SchemaFactory.createForClass(Conversation);
