import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
