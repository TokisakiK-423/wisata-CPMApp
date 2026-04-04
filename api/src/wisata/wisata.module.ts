import { Module } from '@nestjs/common';
import { WisataController } from './wisata.controller';
import { WisataService } from './wisata.service';

@Module({
  controllers: [WisataController],
  providers: [WisataService],
})
export class WisataModule {}
