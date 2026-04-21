import { Module } from '@nestjs/common';
import { WisataService } from './wisata.service';
import { WisataController } from './wisata.controller';
import { PrismaService } from '../prisma/prisma.service';
import { WisataHelper } from './wisata.helper';

@Module({
  controllers: [WisataController],
  providers: [WisataService, PrismaService, WisataHelper],
  exports: [WisataService],
})
export class WisataModule {}
