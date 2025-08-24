import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { User } from './entity/User';
import bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async register(dto: CreateUserDto) {
    const checkEmail: User[] = await this.sequelize.query(
      /* sql */
      `SELECT u.email FROM "Users" u`,
      { type: QueryTypes.SELECT },
    );

    if (checkEmail.length != 0)
      throw new UnauthorizedException('Email já cadastrado');

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const users = await this.sequelize.query(
      /* sql */
      `INSERT INTO "Users" ("name", "email", "hashedPassword", "createdAt", "updatedAt")
      VALUES (:name, :email, :hashedPassword, NOW(), NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: { name: dto.name, email: dto.email, hashedPassword },
      },
    );

    // TODO: Fazer email

    return { response: 'Verifique o email' };
  }

  async validateToken(token: string) {}
}
