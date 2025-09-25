import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Sequelize } from 'sequelize-typescript';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes } from 'sequelize';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(dto: CreateCategoryDto) {
    const categories: Category[] = await this.sequelize.query(
      /* sql */
      `INSERT INTO "Categories" ("name", "description", "createdAt", "updatedAt")
      SELECT :name, :description, NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT * FROM "Categories"
        WHERE name = :name
      ) RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          name: dto.name,
          description: dto.description,
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

  async update(id: number, dto: UpdateCategoryDto) {
    let queries: string[] = [];

    if ('name' in dto) {
      queries.push(`"name" = :name,`);
    }

    if ('description' in dto) {
      queries.push(`"description" = :description,`);
    }

    const categories: Category[] = await this.sequelize.query(
      /* sql */
      `UPDATE "Categories"
      SET ${queries.join(' ')} "updatedAt" = NOW()
      WHERE id = :id
      RETURNING *`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
          name: dto.name,
          description: dto.description,
        },
      },
    );

    if (categories.length <= 0)
      throw new NotFoundException('Categoria não encontrada');

    const category = categories[0];

    return { category };
  }

  async remove(id: number) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.sequelize.query(
        /* sql */
        `DELETE FROM "Articles" 
        WHERE id IN (
        SELECT ac."articleId" 
        FROM "ArticleCategories" ac
        LEFT JOIN "ArticleCategories" ac2 ON ac."articleId" = ac2."articleId" AND ac2."categoryId" != :id
        WHERE ac."categoryId" = :id 
        AND ac2."articleId" IS NULL
       )`,
        {
          type: QueryTypes.DELETE,
          replacements: { id },
          transaction,
        },
      );

      await this.sequelize.query(
        /* sql */
        `DELETE FROM "ArticleCategories" 
        WHERE "categoryId" = :id`,
        {
          type: QueryTypes.DELETE,
          replacements: { id },
          transaction,
        },
      );

      await this.sequelize.query(
        /* sql */
        `DELETE FROM "Categories" 
        WHERE id = :id`,
        {
          type: QueryTypes.DELETE,
          replacements: { id },
          transaction,
        },
      );

      await transaction.commit();
      return { message: 'Categoria deletada' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
