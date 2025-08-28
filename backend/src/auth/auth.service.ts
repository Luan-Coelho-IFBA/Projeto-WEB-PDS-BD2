import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { User } from './entity/user.entity';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JWTType } from 'types';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/roles/entity/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const roles: Role[] = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Roles"
      WHERE name = 'Leitor'`,
      {
        type: QueryTypes.SELECT,
      },
    );

    let users: User[];

    try {
      users = await this.sequelize.query(
        /* sql */
        `INSERT INTO "Users" ("name", "email", "hashedPassword", "roleId", "createdAt", "updatedAt")
        VALUES (:name, :email, :hashedPassword, :roleId, NOW(), NOW())
        RETURNING *`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            name: dto.name,
            email: dto.email,
            hashedPassword,
            roleId: roles[0].id,
          },
        },
      );
    } catch (error) {
      if (error.name == 'SequelizeUniqueConstraintError') {
        throw new UnauthorizedException('Email já existe');
      }

      console.log(error);

      throw new InternalServerErrorException();
    }

    const user = users[0];
    const payload: JWTType = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });

    await this.emailService.sendMail({
      to: dto.email,
      /* html */
      html: `<a href="${this.config.get('URL')}/auth/verifyEmail/${token}" target="_blank">Clique aqui para verificar a sua conta</a>`,
    });

    return { response: 'Verifique o email' };
  }

  async login(dto: LoginUserDto) {
    let users: User[];

    users = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Users"
        WHERE email = :email
        LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          email: dto.email,
        },
      },
    );

    if (users.length < 1)
      throw new BadRequestException('Email ou senha inválida');

    const user = users[0];
    const verifyPassword = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!verifyPassword)
      throw new BadRequestException('Email ou senha inválida');

    const payload: JWTType = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2d' });

    return { token: token };
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

  async updateUser(userJWT: JWTType, dto: UpdateUserDto) {
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      dto.password = hashedPassword;
    }

    const entries = Object.entries(dto)
      .filter(([_, value]) => value != undefined)
      .map(
        ([key, _]) =>
          `"${key == 'password' ? 'hashedPassword' : key}" = :${key}`,
      );

    const replacements = Object.entries(dto)
      .filter(([_, value]) => value != undefined)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, any>,
      );

    const users: User[] = await this.sequelize.query(
      /* sql */
      `UPDATE "Users"
      SET ${entries}, "updatedAt" = NOW()
      WHERE id = :id
      RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: userJWT.sub,
          ...replacements,
        },
      },
    );

    if (users.length < 1)
      throw new BadRequestException('Usuário não encontrado');

    const user = users[0];

    const payload: JWTType = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2d' });

    return { token: token };
  }

  async deleteUser(userJWT: JWTType) {
    await this.sequelize.query(
      /* sql */
      `DELETE FROM "Users"
      WHERE id = :id`,
      {
        type: QueryTypes.DELETE,
        replacements: {
          id: userJWT.sub,
        },
      },
    );

    return { message: 'Usuário deletado com sucesso' };
  }
}
