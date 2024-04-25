import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Page, PagesSchema } from 'src/schemas/pages.schema';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Page.name, schema: PagesSchema }]),
  ],
  providers: [PagesService],
  controllers: [PagesController],
})
export class PagesModule {}
