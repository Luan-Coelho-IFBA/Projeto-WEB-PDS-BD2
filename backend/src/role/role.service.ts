import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { ADMIN, JORNALISTA, LEITOR } from 'consts';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    await this.sequelize.query(
      /* sql */
      `INSERT INTO "Roles" ("name", "createdAt", "updatedAt")
      SELECT :name, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Roles"
        WHERE name = :name
      )`,
      {
        type: QueryTypes.INSERT,
        replacements: {
          name: LEITOR,
        },
      },
    );

    await this.sequelize.query(
      /* sql */
      `INSERT INTO "Roles" ("name", "createdAt", "updatedAt")
      SELECT :name, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Roles"
        WHERE name = :name
      )`,
      {
        replacements: {
          name: JORNALISTA,
        },
      },
    );

    await this.sequelize.query(
      /* sql */
      `INSERT INTO "Roles" ("name", "createdAt", "updatedAt")
      SELECT :name, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Roles"
        WHERE name = :name
      )`,
      {
        replacements: {
          name: ADMIN,
        },
      },
    );
  }

  async changeToJornalista(userId: number) {
    await this.sequelize.query(
      /* sql */
      `UPDATE "Users"
      SET "roleId" = (
        SELECT id FROM "Roles" r
        WHERE r."name" = :name
      ), "updatedAt" = NOW()
      WHERE id = :userId`,
      {
        type: QueryTypes.UPDATE,
        replacements: {
          userId: userId,
          name: JORNALISTA,
        },
      },
    );

    return { message: 'Cargo mudado' };
  }

  async changeToLeitor(userId: number) {
    await this.sequelize.query(
      /* sql */
      `UPDATE "Users"
      SET "roleId" = (
        SELECT id FROM "Roles" r
        WHERE r."name" = :name
      ), "updatedAt" = NOW()
      WHERE id = :userId`,
      {
        type: QueryTypes.UPDATE,
        replacements: {
          userId: userId,
          name: LEITOR,
        },
      },
    );

    return { message: 'Cargo mudado' };
  }
}
