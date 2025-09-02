import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';

@Table({
  indexes: [
    {
      unique: true,
      name: 'user_comment_like',
      fields: ['userId', 'commentId'],
    },
  ],
})
export class Like extends Model {
  @Column
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  @ForeignKey(() => Comment)
  commentId: number;

  @BelongsTo(() => Comment)
  comment: Comment;
}
