import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Authenticate } from '../auth/autenticate.decorator';
import { UserJWT } from '../auth/auth.decorator';
import type { JWTType } from 'types';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Authenticate()
  async create(@UserJWT() userJWT: JWTType, @Body() dto: CreateCommentDto) {
    return await this.commentService.create(userJWT, dto);
  }

  @Get(':id')
  async getByArticleId(@Param('id') id: number) {
    return await this.commentService.getByArticleId(id);
  }

  @Delete(':id')
  @Authenticate()
  async delete(@UserJWT() userJWT: JWTType, @Param('id') id: number) {
    return await this.commentService.delete(userJWT, id);
  }
}
