
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (admin && admin.password === password) {
      return {
        token: jwt.sign(
          { id: admin.id, role: 'admin' },
          process.env.JWT_SECRET,
        ),
        role: 'admin',
      };
    }

    const customer = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (customer && customer.password === password) {
      return {
        token: jwt.sign(
          { id: customer.id, role: 'customer' },
          process.env.JWT_SECRET,
        ),
        role: 'customer',
      };
    }

    throw new UnauthorizedException('Login gagal');
  }
}
