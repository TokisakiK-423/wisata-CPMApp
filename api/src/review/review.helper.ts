import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewHelper {
  constructor(private prisma: PrismaService) {}

  async findCustomerOrFail(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new BadRequestException(process.env.CUSTOMER_FAILED);
    }

    return customer;
  }

  async findReviewOrFail(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new BadRequestException(process.env.RIVIEW_FAILED);
    }

    return review;
  }

  validateOwner(reviewCustomerId: number | null, userId: number) {
    // kalau null → otomatis tidak punya pemilik
    if (!reviewCustomerId || reviewCustomerId !== userId) {
      throw new BadRequestException(process.env.USERS_DO_NOT);
    }
  }
}
