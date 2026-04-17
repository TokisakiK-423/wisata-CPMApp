import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWisataDto {
  @IsString()
  nama: string;

  @IsString()
  deskripsi: string;

  @IsString()
  lokasi: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  jamBuka?: string;

  @IsOptional()
  @IsNumber()
  hargaTiket?: number;
}
