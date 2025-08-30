import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { ArticleCategory } from 'src/article/entities/article-category.entity';
import { Article } from 'src/article/entities/article.entity';

@Table
export class Category extends Model {
  @Column
  name: string;

  @BelongsToMany(() => Article, () => ArticleCategory)
  articles: Article[];
}
