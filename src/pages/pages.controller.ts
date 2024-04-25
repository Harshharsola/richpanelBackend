import { Body, Controller, Post } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AddPageDto } from './dtos/addPage.dto';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post()
  async addPage(@Body() addPageDto: AddPageDto) {
    this.pagesService.add(addPageDto);
  }
}
