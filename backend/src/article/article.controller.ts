import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArticleDto } from './dto/create-article.dto';
import { UserJWT } from 'src/auth/auth.decorator';
import type { JWTType, RequestPaginationType } from 'types';
import { Authenticate } from 'src/auth/autenticate.decorator';
import { ADMIN, JORNALISTA } from 'consts';
import { GetCategories } from './dto/get-categories.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Authenticate(JORNALISTA, ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @UserJWT() userJWT: JWTType,
    @Body() dto: CreateArticleDto,
  ) {
    if (!file) throw new BadRequestException(['Imagem deve ser inserida']);
    if (typeof dto.categoryId == 'string') {
      dto.categoryId = [parseInt(dto.categoryId)];
      if (dto.categoryId.some((ci) => Number.isNaN(ci)))
        throw new BadRequestException('Categoria inválida');
    }

    return await this.articleService.create(file, userJWT, dto);
  }

  @Get()
  async getAll(@Query() pagination: RequestPaginationType) {
    return await this.articleService.getAll(pagination);
  }

  @Get('categories')
  async getAllByCategories(
    @Query() pagination: RequestPaginationType,
    @Body() dto: GetCategories,
  ) {
    return await this.articleService.getAllByCategories(pagination, dto);
  }

  @Get('latest')
  async getAllByLatest(@Query() pagination: RequestPaginationType) {
    return await this.articleService.getAllByLatest(pagination);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return await this.articleService.getById(id);
  }

  @Patch(':id')
  @Authenticate(JORNALISTA, ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
    @UserJWT() userJWT: JWTType,
    @Body() dto: UpdateArticleDto,
  ) {
    return await this.articleService.update(id, image, userJWT, dto);
  }

  @Delete(':id')
  @Authenticate(JORNALISTA, ADMIN)
  async delete(@Param('id') id: number, @UserJWT() userJWT: JWTType) {
    return await this.articleService.delete(id, userJWT);
  }
}
