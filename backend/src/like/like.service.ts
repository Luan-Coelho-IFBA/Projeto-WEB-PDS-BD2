import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { LIKE_TRIGGER } from 'consts';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import type { JWTType } from 'types';

@Injectable()
export class LikeService implements OnModuleInit {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async onModuleInit() {
    await this.sequelize.query(LIKE_TRIGGER);
  }

  async giveLike(userJWT: JWTType, commentId: number) {
    try {
      await this.sequelize.query(
        /* sql */
        `INSERT INTO "Likes" ("userId", "commentId", "createdAt", "updatedAt")
        VALUES (:userId, :commentId, NOW(), NOW())`,
        {
          type: QueryTypes.INSERT,
          replacements: {
            userId: userJWT.sub,
            commentId: commentId,
          },
        },
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Usuário já curtiu o comentário');
      }
      throw new InternalServerErrorException();
    }

    return { mensagem: 'Like dado' };
  }

  async removeLike(userJWT: JWTType, commentId: number) {
    await this.sequelize.query(
      /* sql */
      `DELETE FROM "Likes"
      WHERE "userId" = :userId AND "commentId" = :commentId`,
      {
        type: QueryTypes.DELETE,
        replacements: {
          userId: userJWT.sub,
          commentId: commentId,
        },
      },
    );

    return { mensagem: 'Like removido' };
  }
}
