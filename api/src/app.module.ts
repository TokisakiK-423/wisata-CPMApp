import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { WisataModule } from './wisata/wisata.module';
import { GaleriModule } from './galeri/galeri.module';
import { ReviewModule } from './review/review.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';  // ← IMPORT

@Module({
  imports: [
    PrismaModule, WisataModule, GaleriModule, ReviewModule, BookingModule, AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
