import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ReviewService } from './review.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private service: ReviewService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);

          cb(null, uniqueName + ext);
        },
      }),
    }),
  )
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    console.log(process.env.FILE_SUCCES, file);

    return this.service.create(body, req.user.id, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtGuard)
@Delete(':id')
remove(@Param('id') id: string, @Req() req: any) {
  return this.service.delete(+id, req.user.id);
}
}
