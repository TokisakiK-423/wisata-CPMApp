import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    if (admin && admin.password === password) {
      return {
        token: jwt.sign({ id: admin.id, role: 'admin' }, secret),
        role: 'admin',
      };
    }

    const customer = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (customer && customer.password === password) {
      return {
        token: jwt.sign({ id: customer.id, role: 'customer' }, secret),
        role: 'customer',
      };
    }

    throw new UnauthorizedException(process.env.LOGIN_FAILED);
  }

  // FIX REGISTER KE CUSTOMER
  async register(data: any) {
    const { username, password, nama } = data;

    const existing = await this.prisma.customer.findUnique({
      where: { username },
    });

    if (existing) {
      throw new Error(process.env.USER_SUCCES);
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
