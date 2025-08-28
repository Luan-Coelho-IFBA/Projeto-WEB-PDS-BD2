import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Email deve ser um texto' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Senha deve ser um texto' })
  @Length(6, 30, { message: 'Senha deve ter entre 6 e 30 caracteres' })
  password: string;
}
