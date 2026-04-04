import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException('username dan password wajib diisi');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || admin.password !== password) {
      throw new UnauthorizedException('Username atau password salah');
    }

    return {
      message: 'Login berhasil',
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }
}
