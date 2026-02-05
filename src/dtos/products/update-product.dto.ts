import {
  IsNotEmpty,
  IsString,
  Min,
  IsInt,
  IsBoolean,
  IsUUID,
} from "class-validator";

export class UpdateProductDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  stock?: number;

  @IsInt()
  @Min(0)
  price?: number;

  @IsBoolean()
  isActive?: boolean;
}
