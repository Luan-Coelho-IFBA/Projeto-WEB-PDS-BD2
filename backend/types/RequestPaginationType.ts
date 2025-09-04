import { IsNumber, IsOptional } from 'class-validator';

export class RequestPaginationType {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  size?: number;
}
