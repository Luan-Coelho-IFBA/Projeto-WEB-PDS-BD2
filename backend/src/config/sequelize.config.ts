import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import { ArticleCategory } from 'src/article/entities/article-category.entity';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Role } from 'src/role/entities/role.entity';

const SequelizeConfig = (config: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  models: [Role, User, Article, Category, ArticleCategory, Comment, Like],
  autoLoadModels: false,
  synchronize: false,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  hooks: {
    afterConnect: async (connection: Client, options) => {
      console.log('Database connected');

      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: options.host,
        username: options.username,
        password: options.password as string,
        database: options.database,
        port: Number(options.port),
        dialectOptions: {
          ssl: {
            require: true,
          },
        },
      });

      await sequelize.authenticate();
    },
  },
});

export default SequelizeConfig;
