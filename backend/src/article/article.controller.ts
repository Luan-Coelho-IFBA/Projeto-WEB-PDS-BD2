import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserJWT } from 'src/auth/auth.decorator';
import type { JWTType } from 'types';
import { Authenticate } from 'src/auth/autenticate.decorator';
import { JORNALISTA } from 'consts';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Authenticate(JORNALISTA)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @UserJWT() userJWT: JWTType,
    @Body() dto: CreateArticleDto,
  ) {
    if (!file) throw new BadRequestException(['Imagem deve ser inserida']);

    return await this.articleService.create(file, userJWT, dto);
  }
}
