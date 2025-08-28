import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RolesService implements OnModuleInit {
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
          name: 'Leitor',
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
          name: 'Jornalista',
        },
      },
    );
  }
}
