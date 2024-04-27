import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationsSchema,
} from 'src/schemas/conversations.schema';
import { Message, MessageScema } from 'src/schemas/messages.schema';
import { User, UsersSchema } from 'src/schemas/users.schema';
import { ChatGateway } from 'src/chat/chat.gateway';
import { Page, PagesSchema } from 'src/schemas/pages.schema';
import { FacebookService } from 'src/facebook/facebook.service';
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';
// import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [
    ChatModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationsSchema },
      { name: Message.name, schema: MessageScema },
      { name: User.name, schema: UsersSchema },
      { name: Page.name, schema: PagesSchema },
    ]),
  ],

  providers: [ConversationsService, ChatGateway, ChatService, FacebookService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
