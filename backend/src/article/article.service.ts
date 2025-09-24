import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateArticleDto } from './dto/create-article.dto';
import { JWTType, PaginationType, RequestPaginationType } from 'types';
import { QueryTypes } from 'sequelize';
import { Article } from './entities/article.entity';
import { GetCategories } from './dto/get-categories.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  ADMIN,
  PAGINATION_COUNT,
  PAGINATION_QUERY,
  RESIZE_HEIGHT,
  RESIZE_WIDTH,
} from 'consts';
import sharp from 'sharp';
import { extractTotalPages } from 'utils';

@Injectable()
export class ArticleService {
  private readonly logger: Logger = new Logger(ArticleService.name);

  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(
    file: Express.Multer.File,
    userJWT: JWTType,
    dto: CreateArticleDto,
  ) {
    const t = await this.sequelize.transaction();
    let article: Article | undefined;

    const resized = await sharp(file.buffer)
      .resize(RESIZE_WIDTH, RESIZE_HEIGHT, {
        fit: 'cover',
        withoutEnlargement: true,
      })
      .toBuffer();

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
            image: resized,
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

  async getAll(pagination: RequestPaginationType) {
    const articles: (Article & PaginationType)[] = await this.sequelize.query(
      /* sql */
      `SELECT a.*, row_to_json(u.*) AS users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac
        INNER JOIN "Categories" c ON c.id = ac."categoryId"
        WHERE ac."articleId" = a.id
      ) AS categories,
      ${PAGINATION_COUNT}
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      ${PAGINATION_QUERY}`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          page: pagination.page ?? null,
          size: pagination.size ?? null,
        },
      },
    );

    const { result, pages } = extractTotalPages(
      articles,
      pagination.page,
      pagination.size,
    );

    const mappedImages = result.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages, pages };
  }

  async getAllByCategories(
    pagination: RequestPaginationType,
    dto: GetCategories,
  ) {
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
      ) AS categories,
      ${PAGINATION_COUNT}
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      INNER JOIN "ArticleCategories" ac ON ac."articleId" = a.id
      WHERE ac."categoryId" IN (:categoriesId)
      GROUP BY a.id, u.id, u.*
      ${PAGINATION_QUERY}`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          categoriesId: dto.categoriesId,
          page: pagination.page ?? null,
          size: pagination.size ?? null,
        },
      },
    );

    const { result, pages } = extractTotalPages(
      articles,
      pagination.page,
      pagination.size,
    );

    const mappedImages = result.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages, pages };
  }

  async getAllByLatest(pagination: RequestPaginationType) {
    const articles: (Article & PaginationType)[] = await this.sequelize.query(
      /* sql */
      `SELECT
      a.*,
      row_to_json(u.*) as users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac_sub
        INNER JOIN "Categories" c ON c.id = ac_sub."categoryId"
        WHERE ac_sub."articleId" = a.id
      ) AS categories,
      ${PAGINATION_COUNT}
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      INNER JOIN "ArticleCategories" ac ON ac."articleId" = a.id
      GROUP BY a.id, u.id, u.*
      ORDER BY a."createdAt" DESC
      ${PAGINATION_QUERY}`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          page: pagination.page,
          size: pagination.size,
        },
      },
    );

    const { result, pages } = extractTotalPages(
      articles,
      pagination.page,
      pagination.size,
    );

    const mappedImages = result.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages, pages };
  }

  async getMostViewed(pagination: RequestPaginationType) {
    const articles: Article[] = await this.sequelize.query(
      /* sql */
      `SELECT a.*, row_to_json(u.*) AS users,
      (
        SELECT json_agg(row_to_json(c.*))
        FROM "ArticleCategories" ac
        INNER JOIN "Categories" c ON c.id = ac."categoryId"
        WHERE ac."articleId" = a.id
      ) AS categories,
      COUNT(cm.id) AS likes,
      ${PAGINATION_COUNT}
      FROM "Articles" a
      INNER JOIN "ShowUsers" u ON u.id = a."userId"
      LEFT JOIN "Comments" cm ON cm."articleId" = a.id
      GROUP BY a.id, u.id, u.*
      ORDER BY COUNT(cm.id)
      ${PAGINATION_QUERY}`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          page: pagination.page,
          size: pagination.size,
        },
      },
    );

    const mappedImages = articles.map((a) => {
      return { ...a, image: a.image.toString('base64') };
    });

    return { articles: mappedImages };
  }

  async getAllMine(userJWT: JWTType) {
    const articles: (Article & PaginationType)[] = await this.sequelize.query(
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
      WHERE a."userId" = :userId`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          userId: userJWT.sub,
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
