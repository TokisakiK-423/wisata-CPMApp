import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    const secret = process.env.JWT_SECRET as string;

    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    const customer = await this.prisma.customer.findUnique({
      where: { username },
    });

    // USERNAME TIDAK ADA DI KEDUANYA
    if (!admin && !customer) {
      throw new UnauthorizedException(process.env.USERNAME_FAILED);
    }

    // KALAU ADMIN
    if (admin) {
      if (admin.password !== password) {
        throw new UnauthorizedException(process.env.ADMIN_FAILED);
      }

      return {
        token: jwt.sign({ id: admin.id, role: 'admin' }, secret),
        role: 'admin',
        message: process.env.ADMIN_SUCCES,
      };
    }

    // KALAU CUSTOMER
    if (customer) {
      if (customer.password !== password) {
        throw new UnauthorizedException(process.env.LOGIN_FAILED);
      }

      return {
        token: jwt.sign({ id: customer.id, role: 'customer' }, secret),
        role: 'customer',
        message: process.env.CUSTOMER_SUCCES,
      };
    }
  }

  // FIX REGISTER KE CUSTOMER
  async register(data: any) {
    const { username, password, nama } = data;

    const existing = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (existing) {
      throw new BadRequestException(process.env.USER_FAILED);
    }

    const customer = await this.prisma.customer.create({
      data: {
        username,
        password,
        nama: nama || username,
      },
    });

    return {
      message: process.env.REGISTER_SUCCES,
      customer,
    };
  }
}
