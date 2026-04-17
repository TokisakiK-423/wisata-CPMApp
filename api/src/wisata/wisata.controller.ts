import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Express } from 'express';
import { WisataService } from './wisata.service';

@Controller('wisata')
export class WisataController {
  constructor(private readonly service: WisataService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}
