import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch, // 🔥 WAJIB
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';
import { WisataService } from './wisata.service';

const storage = diskStorage({
  destination: './public/uploads',
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + extname(file.originalname));
  },
});

@Controller('wisata')
export class WisataController {
  constructor(private readonly service: WisataService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage }))
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

  // 🔥 FIX PATCH (PAKAI STORAGE JUGA)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage }))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.service.update(Number(id), body, file);
  }

  // 🔥 HANYA SATU DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
