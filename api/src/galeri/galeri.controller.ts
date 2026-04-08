import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GaleriService } from './galeri.service';
import { JwtAuthGuard } from '../auth/jwt.guard';  // ← IMPORT BENAR
import { RolesGuard } from '../auth/roles.guard';  // ← IMPORT BARU
import { Roles } from '../auth/roles.decorator';   // ← IMPORT BARU

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('galeri')
export class GaleriController {
  constructor(private readonly galeriService: GaleriService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: any,
    @Body() body: { wisataId: string; caption?: string },
  ) {
    return this.galeriService.create({
      wisataId: Number(body.wisataId),
      url: `/uploads/${file.filename}`,
      caption: body.caption,
    });
  }

  @Get()
  findAll() {
    return this.galeriService.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.galeriService.remove(id);
  }
}
