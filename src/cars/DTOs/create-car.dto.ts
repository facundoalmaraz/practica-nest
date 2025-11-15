import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateCarDto {
  @IsString({ message: 'La marca debe ser un string' })
  
  readonly brand: string;

  @IsString({ message: 'El modelo debe ser un string' })
  @MinLength(3)
  readonly model: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(2025)
  readonly year?: number;
}
