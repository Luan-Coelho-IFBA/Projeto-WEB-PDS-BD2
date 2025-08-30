import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';
import { ArticleCategory } from './article-category.entity';
import { Category } from 'src/category/entities/category.entity';

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

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => Category, () => ArticleCategory)
  categories: Category[];
}
