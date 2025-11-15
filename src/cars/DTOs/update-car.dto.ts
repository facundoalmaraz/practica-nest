import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MinLength,
  IsUUID,
} from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id?: string;

  @IsString({ message: 'La marca debe ser un string' })
  @IsOptional()
  readonly brand?: string;

  @IsString({ message: 'El modelo debe ser un string' })
  @MinLength(3)
  @IsOptional()
  readonly model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2025)
  @IsOptional()
  readonly year?: number;
}
