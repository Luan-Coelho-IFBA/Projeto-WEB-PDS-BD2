import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { ArticleCategory } from '../../article/entities/article-category.entity';
import { Article } from '../../article/entities/article.entity';

@Table
export class Category extends Model {
  @Unique
  @Column
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @BelongsToMany(() => Article, () => ArticleCategory)
  articles: Article[];
}
