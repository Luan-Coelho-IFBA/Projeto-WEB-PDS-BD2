import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthStrategy } from './auth.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [PassportModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService, AuthStrategy],
})
export class AuthModule {}
