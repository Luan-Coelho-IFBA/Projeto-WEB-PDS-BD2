import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JWTType } from 'types';
import { QueryTypes } from 'sequelize';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(userJWT: JWTType, dto: CreateCommentDto) {
    await this.sequelize.query(
      /* sql */
      `INSERT INTO "Comments" ("text", "userId", "articleId", "createdAt", "updatedAt")
      VALUES (:text, :userId, :articleId, NOW(), NOW())`,
      {
        type: QueryTypes.INSERT,
        replacements: {
          text: dto.text,
          userId: userJWT.sub,
          articleId: dto.articleId,
        },
      },
    );

    return { mensagem: 'Comentário criado' };
  }

  async getByArticleId(userJWT: JWTType, id: number) {
    const comments: (Comment & { self?: boolean })[] =
      await this.sequelize.query(
        /* sql */
        `SELECT c.*, row_to_json(u.*) as user FROM "Comments" c
        INNER JOIN "ShowUsers" u ON u.id = c."userId"
        WHERE c."articleId" = :articleId
        ORDER BY c."likeCount"`,
        {
          type: QueryTypes.SELECT,
          replacements: {
            articleId: id,
          },
        },
      );

    return {
      comments: comments.map((c) => seeIfUserCommented(userJWT.sub, c)),
    };
  }

  async delete(userJWT: JWTType, id: number) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.sequelize.query(
        /* sql */
        `DELETE FROM "Likes"
        WHERE "commentId" = :id`,
        {
          type: QueryTypes.DELETE,
          replacements: {
            id: id,
          },
          transaction: transaction,
        },
      );

      await this.sequelize.query(
        /* sql */
        `DELETE FROM "Comments"
        WHERE id = :id AND "userId" = :userId`,
        {
          type: QueryTypes.DELETE,
          replacements: {
            id: id,
            userId: userJWT.sub,
          },
          transaction: transaction,
        },
      );

      await transaction.commit();
      return { message: 'Comentário deletado' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

function seeIfUserCommented(userId: number, comment: Comment) {
  if (userId === comment.userId) {
    return { ...comment, self: true };
  }

  return comment;
}
