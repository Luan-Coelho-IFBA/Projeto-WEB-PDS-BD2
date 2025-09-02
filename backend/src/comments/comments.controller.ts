import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Authenticate } from 'src/auth/autenticate.decorator';
import { UserJWT } from 'src/auth/auth.decorator';
import type { JWTType } from 'types';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Authenticate()
  async create(@UserJWT() userJWT: JWTType, @Body() dto: CreateCommentDto) {
    return await this.commentsService.create(userJWT, dto);
  }

  @Get(':id')
  async getByArticleId(@Param('id') id: number) {
    return await this.commentsService.getByArticleId(id);
  }

  @Delete(':id')
  @Authenticate()
  async delete(@UserJWT() userJWT: JWTType, @Param('id') id: number) {
    return await this.commentsService.delete(userJWT, id);
  }
}
