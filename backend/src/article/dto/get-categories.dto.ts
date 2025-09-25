import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class GetCategories {
  @IsNotEmpty()
  categoriesId: number;
}
