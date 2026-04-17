import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { WisataService } from './wisata.service';
import type { Express } from 'express';

@Controller('wisata')
export class WisataController {
  constructor(private readonly service: WisataService) {}

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

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.service.update(Number(id), body, file);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: boolean },
  ) {
    return this.service.updateStatus(Number(id), body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
