import { 
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, 
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() dto: CreateReviewDto, @Req() req?: any) {
    return this.reviewService.create({
      ...dto,
      customerId: req?.user?.role === 'customer' ? req.user.userId : null,
    });
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)  // ← IMPORT SUDAH ADA
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
