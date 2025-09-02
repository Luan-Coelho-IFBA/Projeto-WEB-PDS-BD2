import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateArticleDto } from './dto/create-article.dto';
import { JWTType } from 'types';
import { QueryTypes } from 'sequelize';
import { Article } from './entities/article.entity';
import { GetCategories } from './dto/get-categories.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ADMIN } from 'consts';

@Injectable()
export class ArticleService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(
    file: Express.Multer.File,
    userJWT: JWTType,
    dto: CreateArticleDto,
  ) {
    const t = await this.sequelize.transaction();
    let article: Article | undefined;

    try {
      const articles: Article[] = await this.sequelize.query(
        /* sql */
        `INSERT INTO "Articles" ("title", "subtitle", "text", "image", "imageMimeType", "userId", "createdAt", "updatedAt")
      VALUES (:title, :subtitle, :text, :image, :imageMimeType, :userId, NOW(), NOW())
      RETURNING *`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            title: dto.title,
            subtitle: dto.subtitle,
            text: dto.text,
            image: file.buffer,
            imageMimeType: file.mimetype,
            userId: userJWT.sub,
          },
        },
      );

      article = articles[0];

      const articleCategories = dto.categoryId.map(async (ci) => {
        return this.sequelize.query(
          /* sql */
          `INSERT INTO "ArticleCategories" ("articleId", "categoryId", "createdAt", "updatedAt")
          VALUES (:articleId, :categoryId, NOW(), NOW())`,
          {
            type: QueryTypes.INSERT,
            replacements: {
              articleId: article?.id,
              categoryId: ci,
            },
            transaction: t,
          },
        );
      });

      await Promise.all(articleCategories);
      await t.commit();

      return { message: 'Artigo criado' };
    } catch (error) {
      if (article == undefined) {
        throw new NotFoundException('Usuário não encontrado');
      }

      await this.sequelize.query(
        /* sql */
        `DELETE FROM "ArticleCategories"
        WHERE "articleId" = :articleId`,
        {
          type: QueryTypes.DELETE,
          replacements: {
            articleId: article.id,
          },
        },
      );

      await this.sequelize.query(
        /* sql */
        `DELETE FROM "Articles"
        WHERE id = :id`,
        {
          type: QueryTypes.DELETE,
          replacements: {
            id: article.id,
          },
        },
      );

      if (error.name == 'SequelizeForeignKeyConstraintError') {
        throw new NotFoundException(`Categoria de id não encontrada`);
      }

      throw new InternalServerErrorException();
    }
  }

  async getAll() {
    const articles: Article[] = await this.sequelize.query(
      /* sql */
      `SELECT a.*, row_to_json(u.*) AS users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac
        INNER JOIN "Categories" c ON c.id = ac."categoryId"
        WHERE ac."articleId" = a.id
      ) AS categories
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"`,
      {
        type: QueryTypes.SELECT,
      },
    );

    const mappedImages = articles.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages };
  }

  async getAllByCategories(dto: GetCategories) {
    const articles: Article[] = await this.sequelize.query(
      /* sql */
      `SELECT
      a.*,
      row_to_json(u.*) AS users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac_sub
        INNER JOIN "Categories" c ON c.id = ac_sub."categoryId"
        WHERE ac_sub."articleId" = a.id
      ) AS categories
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      INNER JOIN "ArticleCategories" ac ON ac."articleId" = a.id
      WHERE ac."categoryId" IN (:categoriesId)
      GROUP BY a.id, u.id, u.*`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          categoriesId: dto.categoriesId,
        },
      },
    );

    const mappedImages = articles.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages };
  }

  async getById(id: number) {
    const articles: Article[] = await this.sequelize.query(
      /* sql */
      `SELECT a.*, row_to_json(u.*) AS users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac
        INNER JOIN "Categories" c ON c.id = ac."categoryId"
        WHERE ac."articleId" = a.id
      ) AS categories
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      WHERE a.id = :id`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
        },
      },
    );

    if (articles.length <= 0)
      throw new NotFoundException('Artigo não encontrado');

    const article = articles[0];
    const mappedArticle = {
      ...article,
      image: article.image.toString('base64'),
    };

    return { article: mappedArticle };
  }

  async update(
    id: number,
    image: Express.Multer.File,
    userJWT: JWTType,
    dto: UpdateArticleDto,
  ) {
    let queries: string[] = [];

    if (dto.title) {
      queries.push(`"title" = :title`);
    }

    if (dto.subtitle) {
      queries.push(`"subtitle" = :subtitle`);
    }

    if (dto.text) {
      queries.push(`"text" = :text`);
    }

    if (image) {
      queries.push(`"image" = :image`);
      queries.push(`"imageMimeType" = :imageMimeType`);
    }

    const queriesJoin = queries.join(', ');

    await this.sequelize.query(
      /* sql */
      `UPDATE "Articles"
      SET ${queriesJoin}, "updatedAt" = NOW()
      WHERE id = :id AND ("userId" = :userId OR :userId IS NULL)`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          id: id,
          title: dto.title,
          subtitle: dto.subtitle,
          text: dto.text,
          image: image?.buffer ?? undefined,
          imageMimeType: image?.mimetype ?? undefined,
          userId: userJWT.role == ADMIN ? null : userJWT.sub,
        },
      },
    );

    return { message: 'Artigo atualizado' };
  }

  async delete(id: number, userJWT: JWTType) {
    await this.sequelize.query(
      /* sql */
      `DELETE FROM "ArticleCategories" ac
      WHERE ac."articleId" in (
      	SELECT ac."articleId" FROM "ArticleCategories" ac2
      	INNER JOIN "Articles" a
      	ON a.id = ac2."articleId"
      	INNER JOIN "Users"
      	ON "Users".id = a."userId"
      	WHERE a.id = :id AND ("userId" = :userId OR :userId IS NULL)
      )`,
      {
        type: QueryTypes.DELETE,
        replacements: {
          id: id,
          userId: userJWT.role == ADMIN ? null : userJWT.sub,
        },
      },
    );

    await this.sequelize.query(
      /* sql */
      `DELETE FROM "Articles"
      WHERE id = :id AND ("userId" = :userId OR :userId IS NULL)`,
      {
        type: QueryTypes.DELETE,
        replacements: {
          id: id,
          userId: userJWT.role == ADMIN ? null : userJWT.sub,
        },
      },
    );

    return { message: 'Artigo deletado' };
  }
}
