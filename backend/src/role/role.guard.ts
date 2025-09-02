import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectConnection } from '@nestjs/sequelize';
import { Request } from 'express';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { JWTType } from 'types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const userJWT = request.user as JWTType;

    const users = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Users"
      WHERE id = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: userJWT.sub,
        },
      },
    );

    if (users.length < 1) return false;

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (requiredRoles.length <= 0) {
      return true;
    }

    const roleName = userJWT.role;

    if (!requiredRoles.includes(roleName)) return false;

    return true;
  }
}
