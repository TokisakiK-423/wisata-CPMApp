import {
  Controller, Get, Post, Delete, Param, Body,
  Patch, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { WisataService } from './wisata.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('wisata')
export class WisataController {
  constructor(private service: WisataService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.service.create(body, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  // 🔥 INI YANG BELUM ADA
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.service.update(Number(id), body, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
