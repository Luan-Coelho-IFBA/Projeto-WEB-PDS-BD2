import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [AuthModule, CommentModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
