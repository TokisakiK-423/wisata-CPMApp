import {
  Controller,
  Post,
  Get,
  Delete,
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
  create(@Body() body, @Req() req) {
    return this.service.create(body, req.user);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
