import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { User } from './entity/User';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JWTType } from 'types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: CreateUserDto) {
    const checkEmail: User[] = await this.sequelize.query(
      /* sql */
      `SELECT u.email FROM "Users" u WHERE u."email" = :email`,
      { type: QueryTypes.SELECT, replacements: { email: dto.email } },
    );

    if (checkEmail.length != 0)
      throw new UnauthorizedException('Email já cadastrado');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const users: User[] = await this.sequelize.query(
      /* sql */
      `INSERT INTO "Users" ("name", "email", "hashedPassword", "createdAt", "updatedAt")
      VALUES (:name, :email, :hashedPassword, NOW(), NOW())
      RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: { name: dto.name, email: dto.email, hashedPassword },
      },
    );

    const user = users[0];
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });

    await this.emailService.sendMail({
      to: dto.email,
      /* html */
      html: `<a href="${this.config.get('URL')}/auth/verifyEmail/${token}" target="_blank">Clique aqui para verificar a sua conta</a>`,
    });

    return { response: 'Verifique o email' };
  }

  async validateToken(token: string) {
    try {
      const decoded: JWTType = await this.jwtService.verifyAsync(token);
      await this.sequelize.query(
        /* sql */
        `UPDATE "Users"
        SET "isVerified" = TRUE
        WHERE id = :id
        RETURNING *`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            id: decoded.sub,
          },
        },
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro ao autentificar usuário');
    }

    return `<html>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
              <div style="min-height: 100%; min-width: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column;">
                <h1 style="font-family: 'Inter';">Usuário autentificado</h1>
                <h3 style="font-family: 'Inter';">Pode fechar a aba</h3>
              </div>
            </html>`;
  }
}
