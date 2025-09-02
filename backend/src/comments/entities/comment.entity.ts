import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/auth/entities/user.entity';

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
}
