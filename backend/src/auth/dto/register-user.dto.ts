import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Nome completo deve ser preenchido' })
  @IsString({ message: 'Nome completo deve ser um texto' })
  name: string;

  @IsNotEmpty({ message: 'Email deve ser preenchido' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsString({ message: 'Email deve ser um texto' })
  email: string;

  @IsNotEmpty({ message: 'Senha deve ser preenchida' })
  @IsString({ message: 'Senha deve ser um texto' })
  @Length(6, 30, { message: 'Senha deve ter entre 6 e 30 caracteres' })
  password: string;
}
