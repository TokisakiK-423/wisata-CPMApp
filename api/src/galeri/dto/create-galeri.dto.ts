import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateGaleriDto {
  @IsInt()
  wisataId: number;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;
}