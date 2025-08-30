import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((id: string) => parseInt(id));
    }
    return [parseInt(value)];
  })
  categoryId: number[];
}
