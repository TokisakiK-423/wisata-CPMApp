import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateReviewDto) {  // Accept customerId
    return this.prisma.review.create({ data });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: { wisata: true },
      orderBy: { id: 'desc' },
    });
  }

  async remove(id: number) {
    const data = await this.prisma.review.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('Review tidak ditemukan');
    return this.prisma.review.delete({ where: { id } });
  }
}
