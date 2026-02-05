import { IsUUID, IsNotEmpty } from 'class-validator';

export class GetProductDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}
