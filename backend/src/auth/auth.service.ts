import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { User } from './entities/user.entity';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JWTType } from 'types';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/role/entities/role.entity';
import { ADMIN, USER_STORED_PROCEDURE, USER_VIEW } from 'consts';
import { ResendEmailDto } from './dto/resend-email.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly sequelize: Sequelize,
    private readonly emailService: MailerService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const roles: Role[] = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Roles"
      WHERE name = :name`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          name: ADMIN,
        },
      },
    );

    const name = this.config.get<string>('ADMIN_NAME');
    const email = this.config.get<string>('ADMIN_EMAIL');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!name || !email || !password)
      throw new InternalServerErrorException('Admin não encontrado');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.sequelize.query(
      /* sql */
      `INSERT INTO "Users" ("name", "email", "hashedPassword", "roleId", "isVerified", "createdAt", "updatedAt")
      SELECT :name, :email, :hashedPassword, :roleId, :isVerified, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Users"
        WHERE "roleId" = :roleId
      )`,
      {
        type: QueryTypes.INSERT,
        replacements: {
          name: name,
          email: email,
          hashedPassword: hashedPassword,
          roleId: roles[0].id,
          isVerified: true,
        },
      },
    );

    await this.sequelize.query(USER_STORED_PROCEDURE);
    await this.sequelize.query(USER_VIEW);
  }

  async register(dto: RegisterUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    try {
      await this.sequelize.query(
        /* sql */
        `CALL create_user(:name, :email, :hashedPassword)`,
        {
          type: QueryTypes.RAW,
          replacements: {
            name: dto.name,
            email: dto.email,
            hashedPassword: hashedPassword,
          },
        },
      );
    } catch (error) {
      if (error.name == 'SequelizeDatabaseError') {
        throw new UnauthorizedException('Email já existe');
      }

      throw new InternalServerErrorException();
    }

    const users: User[] = await this.sequelize.query(
      /* sql */
      `SELECT u.*, ROW_TO_JSON(r.*) as role
      FROM "Users" u
      LEFT JOIN "Roles" r ON u."roleId" = r.id
      WHERE u.email = :email;`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          email: dto.email,
        },
      },
    );

    const user = users[0];
    const payload: JWTType = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });

    await this.emailService.sendMail({
      to: dto.email,
      /* html */
      html: `<a href="${this.config.get('URL')}/auth/verifyEmail/${token}" target="_blank">Clique aqui para verificar a sua conta</a>`,
    });

    return { response: 'Verifique o email' };
  }

  async login(dto: LoginUserDto) {
    const users: User[] = await this.sequelize.query(
      /* sql */
      `SELECT u.*, ROW_TO_JSON(r.*) as role FROM "Users" u
      LEFT JOIN "Roles" r
      ON r.id = u."roleId"
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

    if (!user.isVerified)
      throw new UnauthorizedException('Usuário não autentificado');

    const verifyPassword = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );

    if (!verifyPassword)
      throw new BadRequestException('Email ou senha inválida');

    const payload: JWTType = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2d' });

    return { token: token, role: user.role.name };
  }

  async getMe(userJWT: JWTType) {
    const users: User[] = await this.sequelize.query(
      /* sql */
      `SELECT u.*, ROW_TO_JSON(r.*) as role FROM "Users" u
      LEFT JOIN "Roles" r
      ON r.id = u."roleId"
      WHERE id = :id
      LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: userJWT.sub,
        },
      },
    );

    if (users.length < 1) throw new NotFoundException('Usuário não encontrado');

    const user = users[0];

    if (!user.isVerified)
      throw new UnauthorizedException('Usuário não autentificado');

    const payload: JWTType = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2d' });

    return { token: token, role: user.role.name };
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

  async resendEmail(dto: ResendEmailDto) {
    const users: User[] = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Users"
      WHERE "email" = :email`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          email: dto.email,
        },
      },
    );

    const user = users[0];
    const payload: JWTType = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });

    await this.emailService.sendMail({
      to: dto.email,
      /* html */
      html: `<a href="${this.config.get('URL')}/auth/verifyEmail/${token}" target="_blank">Clique aqui para verificar a sua conta</a>`,
    });

    return { response: 'Verifique o email' };
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

    let users: User[] = await this.sequelize.query(
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

    users = await this.sequelize.query(
      /* sql */
      `SELECT u.*, ROW_TO_JSON(r.*) as role
      FROM "Users" u
      LEFT JOIN "Roles" r ON u."roleId" = r.id
      WHERE u.id = :id;`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: users[0].id,
        },
      },
    );

    const user = users[0];

    const payload: JWTType = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2d' });

    return { token: token };
  }

  async deleteUser(userJWT: JWTType) {
    if (userJWT.role == ADMIN)
      throw new UnauthorizedException('Admin não pode ser excluído');

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

  async testVerifyEmail() {
    await this.sequelize.query(
      /* sql */
      `UPDATE "Users"
      SET "isVerified" = TRUE, "updatedAt" = NOW()
      WHERE id = (
        SELECT id FROM "Users" 
        ORDER BY "createdAt" DESC 
        LIMIT 1
      )`,
      {
        type: QueryTypes.UPDATE,
      },
    );

    return { message: 'Usuário verificado' };
  }
}
