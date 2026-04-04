import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { WisataModule } from './wisata/wisata.module';
import { GaleriModule } from './galeri/galeri.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    WisataModule,
    GaleriModule,
    ReviewModule,
    BookingModule,
    AuthModule,
  ],
})
export class AppModule {}
