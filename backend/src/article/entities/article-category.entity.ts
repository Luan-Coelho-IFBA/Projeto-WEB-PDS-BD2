import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Article } from './article.entity';
import { Category } from 'src/category/entities/category.entity';

@Table
export class ArticleCategory extends Model {
  @Column
  @ForeignKey(() => Article)
  articleId: number;

  @Column
  @ForeignKey(() => Category)
  categoryId: number;
}
