import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../auth/entities/user.entity';

@Table
export class Comment extends Model {
  @Column({ type: DataType.TEXT })
  text: string;

  @Column
  @ForeignKey(() => Article)
  articleId: number;

  @BelongsTo(() => Article)
  article: Article;

  @Column
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({
    defaultValue: 0,
  })
  likeCount: number;
}
