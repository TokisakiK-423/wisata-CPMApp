import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private service: ReviewService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.service.create(body, req.user.id);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
