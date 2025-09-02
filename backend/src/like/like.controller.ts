import { Controller, Delete, Param, Post } from '@nestjs/common';
import { LikeService } from './like.service';
import { UserJWT } from 'src/auth/auth.decorator';
import type { JWTType } from 'types';
import { Authenticate } from 'src/auth/autenticate.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':id')
  @Authenticate()
  async giveLike(@UserJWT() userJWT: JWTType, @Param('id') id: number) {
    return await this.likeService.giveLike(userJWT, id);
  }

  @Delete()
  @Authenticate()
  async removeLike(@UserJWT() userJWT: JWTType, @Param('id') id: number) {
    return await this.likeService.removeLike(userJWT, id);
  }
}
