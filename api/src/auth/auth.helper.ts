import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthHelper {
  constructor(private prisma: PrismaService) {}

  async findUser(username: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (admin) return { ...admin, role: 'admin' };

    const customer = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (customer) return { ...customer, role: 'customer' };

    throw new UnauthorizedException(process.env.USERNAME_FAILED);
  }

  validatePassword(userPassword: string, inputPassword: string, role: string) {
    if (userPassword !== inputPassword) {
      if (role === 'admin') {
        throw new UnauthorizedException(process.env.ADMIN_FAILED);
      }
      throw new UnauthorizedException(process.env.LOGIN_FAILED);
    }
  }

  async checkCustomerExists(username: string) {
    const existing = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (existing) {
      throw new BadRequestException(process.env.USER_FAILED);
    }
  }
}
