import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthHelper } from './auth.helper';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthHelper],
})
export class AuthModule {}
