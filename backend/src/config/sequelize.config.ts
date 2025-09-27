import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ArticleCategory } from '../article/entities/article-category.entity';
import { Article } from '../article/entities/article.entity';
import { User } from '../auth/entities/user.entity';
import { Category } from '../category/entities/category.entity';
import { Comment } from '../comment/entities/comment.entity';
import { Like } from '../like/entities/like.entity';
import { Role } from '../role/entities/role.entity';

const SequelizeConfig = (config: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  models: [Role, User, Article, Category, ArticleCategory, Comment, Like],
  autoLoadModels: true,
  synchronize: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  hooks: {
    afterConnect: async (_, options) => {
      const sequelize: Sequelize = new Sequelize({
        dialect: 'postgres',
        ...(options as any),
      });

      await sequelize.query(
        /* sql */
        `CREATE TABLE IF NOT EXISTS "ArticleCategories" (
            "articleId" integer PRIMARY KEY NOT NULL,
            "categoryId" integer NOT NULL,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Articles" (
            id serial PRIMARY KEY NOT NULL,
            title character varying(255),
            subtitle character varying(255),
            text text,
            image bytea,
            "imageMimeType" character varying(255),
            "userId" integer,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Categories" (
            id serial PRIMARY KEY NOT NULL,
            name character varying(255) UNIQUE,
            description text,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Comments" (
            id serial PRIMARY KEY NOT NULL,
            text text,
            "articleId" integer,
            "userId" integer,
            "likesCount" integer DEFAULT 0,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Likes" (
            id serial PRIMARY KEY NOT NULL,
            "userId" integer,
            "commentId" integer,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Roles" (
            id serial PRIMARY KEY NOT NULL,
            name character varying(255),
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Users" (
            id serial PRIMARY KEY NOT NULL,
            name character varying(255),
            email character varying(255) UNIQUE,
            "hashedPassword" character varying(255),
            "isVerified" boolean DEFAULT false,
            "roleId" integer,
            "createdAt" timestamp with time zone NOT NULL DEFAULT NOW(),
            "updatedAt" timestamp with time zone NOT NULL DEFAULT NOW()
        );

        ALTER TABLE "ArticleCategories" DROP CONSTRAINT IF EXISTS "ArticleCategories_articleId_fkey";
        ALTER TABLE "ArticleCategories" DROP CONSTRAINT IF EXISTS "ArticleCategories_categoryId_fkey";
        ALTER TABLE "Articles" DROP CONSTRAINT IF EXISTS "Articles_userId_fkey";
        ALTER TABLE "Comments" DROP CONSTRAINT IF EXISTS "Comments_articleId_fkey";
        ALTER TABLE "Comments" DROP CONSTRAINT IF EXISTS "Comments_userId_fkey";
        ALTER TABLE "Likes" DROP CONSTRAINT IF EXISTS "Likes_commentId_fkey";
        ALTER TABLE "Likes" DROP CONSTRAINT IF EXISTS "Likes_userId_fkey";
        ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS "Users_roleId_fkey";

        ALTER TABLE "ArticleCategories"
            ADD CONSTRAINT "ArticleCategories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"(id) ON UPDATE CASCADE ON DELETE CASCADE;

        ALTER TABLE "ArticleCategories"
            ADD CONSTRAINT "ArticleCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"(id) ON UPDATE CASCADE ON DELETE CASCADE;

        ALTER TABLE "Articles"
            ADD CONSTRAINT "Articles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;

        ALTER TABLE "Comments"
            ADD CONSTRAINT "Comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"(id) ON UPDATE CASCADE ON DELETE CASCADE;

        ALTER TABLE "Comments"
            ADD CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;

        ALTER TABLE "Likes"
            ADD CONSTRAINT "Likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comments"(id) ON UPDATE CASCADE;

        ALTER TABLE "Likes"
            ADD CONSTRAINT "Likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"(id) ON UPDATE CASCADE;

        ALTER TABLE "Users"
            ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"(id) ON UPDATE CASCADE ON DELETE CASCADE;`,
      );
    },
  },
});

export default SequelizeConfig;
