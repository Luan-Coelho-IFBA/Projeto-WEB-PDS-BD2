import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ArticleCategory } from 'src/article/entities/article-category.entity';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Role } from 'src/role/entities/role.entity';

const SequelizeConfig = (config: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  models: [Role, User, Article, Category, ArticleCategory, Comment],
  autoLoadModels: true,
  synchronize: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

export default SequelizeConfig;
