import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(dto: CategoryDto) {
    const categories: Category[] = await this.sequelize.query(
      /* sql */
      `INSERT INTO "Categories" ("name", "createdAt", "updatedAt")
      SELECT :name, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Categories"
        WHERE name = :name
      ) RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          name: dto.name,
        },
      },
    );

    if (categories.length <= 0)
      throw new BadRequestException('Categoria já existe');

    return { message: 'Categoria criada' };
  }

  async findAll() {
    const categories = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Categories"`,
      {
        type: QueryTypes.SELECT,
      },
    );

    return { categories };
  }

  async findOne(id: number) {
    const categories: Category[] = await this.sequelize.query(
      /* sql */
      `SELECT * FROM "Categories"
      WHERE id = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      },
    );

    if (categories.length <= 0)
      throw new NotFoundException('Categoria não encontrada');

    const category = categories[0];

    return { category };
  }

  async update(id: number, dto: CategoryDto) {
    const categories: Category[] = await this.sequelize.query(
      /* sql */
      `UPDATE "Categories"
      SET "name" = :name, "updatedAt" = NOW()
      WHERE id = :id
      RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
          name: dto.name,
        },
      },
    );

    if (categories.length <= 0)
      throw new NotFoundException('Categoria não encontrada');

    const category = categories[0];

    return { category };
  }

  async remove(id: number) {
    await this.sequelize.query(
      /* sql */
      `DELETE FROM "Categories"
      WHERE id = :id`,
      {
        type: QueryTypes.DELETE,
        replacements: {
          id: id,
        },
      },
    );

    return { message: 'Categoria deletada' };
  }
}
