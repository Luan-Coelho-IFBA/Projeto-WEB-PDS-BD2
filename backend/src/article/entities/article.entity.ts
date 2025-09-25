import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../auth/entities/user.entity';
import { ArticleCategory } from './article-category.entity';
import { Category } from '../../category/entities/category.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Table
export class Article extends Model {
  @Column
  title: string;

  @Column
  subtitle: string;

  @Column({ type: DataType.TEXT })
  text: string;

  @Column({
    type: DataType.BLOB('long'),
  })
  image: Buffer;

  @Column
  imageMimeType: string;

  @Column
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  user: User;

  @BelongsToMany(() => Category, () => ArticleCategory)
  categories: Category[];

  @HasMany(() => Comment)
  comments: Comment[];
}
