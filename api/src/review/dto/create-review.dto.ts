import { IsInt, IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';  // ← TAMBAH Max

export class CreateReviewDto {
  @IsInt()
  wisataId: number;

  @IsOptional()
  @IsInt()
  customerId?: number;

  @IsString()
  nama: string;

  @Min(1)
  @Max(5)  // ← OK sekarang
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  komentar?: string;
}