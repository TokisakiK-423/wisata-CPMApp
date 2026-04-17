import { IsInt, IsString, IsOptional, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  wisataId: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsString()
  nama: string;

  @IsString()
  noHp: string;

  @Min(1)
  @IsInt()
  jumlahTiket: number;
}