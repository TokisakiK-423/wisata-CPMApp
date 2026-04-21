import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewHelper } from './review.helper';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ReviewHelper],
})
export class ReviewModule {}
