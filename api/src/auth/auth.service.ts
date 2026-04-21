import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private helper: AuthHelper,
  ) {}

  async login(username: string, password: string) {
    const secret = process.env.JWT_SECRET as string;

    const user = await this.helper.findUser(username);

    this.helper.validatePassword(user.password, password, user.role);

    return {
      token: jwt.sign({ id: user.id, role: user.role }, secret),
      role: user.role,
      message:
        user.role === 'admin'
          ? process.env.ADMIN_SUCCES
          : process.env.CUSTOMER_SUCCES,
    };
  }

  async register(data: any) {
    const { username, password, nama } = data;

    await this.helper.checkCustomerExists(username);

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
