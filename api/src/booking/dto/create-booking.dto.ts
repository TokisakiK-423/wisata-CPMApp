import { IsInt, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  wisataId: number;

  @IsString()
  nama: string;

  @IsString()
  noHp: string;

  @IsInt()
  @Min(1)
  jumlahTiket: number;

  @IsInt()
  totalBayar: number;
}