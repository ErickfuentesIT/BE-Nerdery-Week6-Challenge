import { IsNotEmpty, IsString, Min, IsInt } from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description?: string;

  @IsInt()
  @Min(0)
  stock?: number;

  @IsInt()
  @Min(0)
  price!: number;
}
