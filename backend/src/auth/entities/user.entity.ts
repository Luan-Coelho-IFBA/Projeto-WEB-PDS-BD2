import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Article } from 'src/article/entities/article.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Role } from 'src/role/entities/role.entity';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column({ unique: true })
  email: string;

  @Column
  hashedPassword: string;

  @Column({
    defaultValue: false,
  })
  isVerified: boolean;

  @Column
  @ForeignKey(() => Role)
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Article, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  articles: Article;

  @HasMany(() => Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true,
  })
  comments: Comment;
}
