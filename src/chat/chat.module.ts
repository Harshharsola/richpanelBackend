import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageScema } from 'src/schemas/messages.schema';
import { Page, PagesSchema } from 'src/schemas/pages.schema';
import { FacebookService } from 'src/facebook/facebook.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageScema },
      { name: Page.name, schema: PagesSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService, FacebookService],
})
export class ChatModule {}
