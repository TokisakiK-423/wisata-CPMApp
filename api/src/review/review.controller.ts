import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReviewService } from './review.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private service: ReviewService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image')) // 🔥 INI PENTING
  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.service.create(body, req.user.id, file);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
