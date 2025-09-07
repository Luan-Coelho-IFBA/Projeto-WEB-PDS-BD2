import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { JWTType } from 'types';
import { UserJWT } from './auth.decorator';
import { Authenticate } from './autenticate.decorator';
import { TestOnly } from 'src/test/test.decorator';
import { ResendEmailDto } from './dto/resend-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return await this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return await this.authService.login(dto);
  }

  @Post('resendEmail')
  async resendEmail(@Body() dto: ResendEmailDto) {
    return await this.authService.resendEmail(dto);
  }

  @Get()
  @Authenticate()
  async getMe(@UserJWT() userJWT: JWTType) {
    return await this.authService.getMe(userJWT);
  }

  @Get('verifyEmail/:token')
  async verifyEmail(@Param('token') token: string) {
    return await this.authService.validateToken(token);
  }

  @Get('test/verifyEmail')
  @TestOnly()
  async testVerifyEmail() {
    return await this.authService.testVerifyEmail();
  }

  @Patch()
  @Authenticate()
  async updateUser(@UserJWT() userJWT: JWTType, @Body() dto: UpdateUserDto) {
    return await this.authService.updateUser(userJWT, dto);
  }

  @Delete()
  @Authenticate()
  async deleteUser(@UserJWT() userJWT: JWTType) {
    return await this.authService.deleteUser(userJWT);
  }
}
