import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { UserJWT } from 'src/auth/auth.decorator';
import type { JWTType } from 'types';
import { Authenticate } from '../auth/autenticate.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @Authenticate()
  async giveLike(@UserJWT() userJWT: JWTType, @Body('id') id: number) {
    return await this.likeService.giveLike(userJWT, id);
  }

  @Delete(':id')
  @Authenticate()
  async removeLike(@UserJWT() userJWT: JWTType, @Param('id') id: number) {
    return await this.likeService.removeLike(userJWT, id);
  }
}
