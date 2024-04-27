import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PagesController } from './pages/pages.controller';
import { PagesService } from './pages/pages.service';
import { PagesModule } from './pages/pages.module';
import { FacebookService } from './facebook/facebook.service';
import { ChatGateway } from './chat/chat.gateway';
import { ConversationsService } from './conversations/conversations.service';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConversationsModule,
    UsersModule,
    PagesModule,
    ChatModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FacebookService,
    // ChatGateway,
    // ConversationsService,
    // ChatService,
  ],
})
export class AppModule {}
