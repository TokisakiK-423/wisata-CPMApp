import { Module } from '@nestjs/common';
import { WisataService } from './wisata.service';
import { WisataController } from './wisata.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [WisataController],
  providers: [WisataService, PrismaService],
})
export class WisataModule {}
