import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PagesSchema } from 'src/schemas/pages.schema';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { User, UsersSchema } from 'src/schemas/users.schema';
import { FacebookService } from 'src/facebook/facebook.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PagesSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [PagesService, FacebookService],
  controllers: [PagesController],
})
export class PagesModule {}
