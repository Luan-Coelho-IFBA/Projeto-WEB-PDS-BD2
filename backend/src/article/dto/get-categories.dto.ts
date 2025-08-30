import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class GetCategories {
  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  categoriesId: number[];
}
