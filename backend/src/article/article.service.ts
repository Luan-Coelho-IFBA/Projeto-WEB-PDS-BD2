import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateArticleDto } from './dto/create-article.dto';
import { JWTType } from 'types';

@Injectable()
export class ArticleService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async create(
    file: Express.Multer.File,
    userJWT: JWTType,
    dto: CreateArticleDto,
  ) {}
}
