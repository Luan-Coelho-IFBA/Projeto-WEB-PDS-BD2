import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { JORNALISTA, LEITOR } from 'consts';
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
  }

  async getAll() {
    const roles = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Roles"`,
    );

    return { roles: roles };
  }
}
