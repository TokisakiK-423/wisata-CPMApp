import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new BadRequestException('username dan password wajib diisi');
    }

    // Cek admin
    let user = await this.prisma.admin.findUnique({ where: { username } });
    let role = 'admin';

    if (!user || user.password !== password) {
      // Cek customer
      user = await this.prisma.customer.findUnique({ where: { username } });
      if (!user || user.password !== password) {
        throw new UnauthorizedException('Username atau password salah');
      }
      role = 'customer';
    }

    const payload = { 
      sub: user.id, 
      username: user.username,
      role 
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login berhasil',
      access_token: token,
      role,
      user: { 
        id: user.id, 
        username: user.username,
        role 
      }
    };
  }
}
