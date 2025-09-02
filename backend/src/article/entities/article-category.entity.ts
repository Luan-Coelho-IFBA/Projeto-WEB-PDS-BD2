import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Article } from './article.entity';
import { Category } from 'src/category/entities/category.entity';

@Table
export class ArticleCategory extends Model {
  @Column
  @ForeignKey(() => Article)
  articleId: number;

  @BelongsTo(() => Article, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  articles: Article[];

  @Column
  @ForeignKey(() => Category)
  categoryId: number;

  @BelongsTo(() => Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  categories: Category[];
}
