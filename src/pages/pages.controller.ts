import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { AddPageDto } from './dtos/addPage.dto';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post()
  async addPage(@Body() addPageDto: AddPageDto) {
    this.pagesService.add(addPageDto);
  }

  @Get()
  async getPages(@Query('id') id: string, @Res() res) {
    const response = await this.pagesService.get(id);
    res.send(response);
    return;
  }

  @Delete('delete')
  async deletePage(@Query('id') id: string, @Res() res) {
    const response = await this.pagesService.delete(id);
    res.send(response);
  }
}
