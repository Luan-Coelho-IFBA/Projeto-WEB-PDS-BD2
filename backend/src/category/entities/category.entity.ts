import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { ArticleCategory } from 'src/article/entities/article-category.entity';
import { Article } from 'src/article/entities/article.entity';

@Table
export class Category extends Model {
  @Column
  @Unique
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @BelongsToMany(() => Article, () => ArticleCategory)
  articles: Article[];
}
