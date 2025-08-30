import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { Sequelize } from 'sequelize-typescript';
import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { CategoryDto } from 'src/category/dto/category.dto';

const PORT = 3333;

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let sequelize: Sequelize;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    await app.listen(PORT);

    config = moduleFixture.get<ConfigService>(ConfigService);
    sequelize = moduleFixture.get<Sequelize>(Sequelize);

    pactum.request.setBaseUrl(`http://localhost:${PORT}`);
    pactum.request.setDefaultTimeout(10000);
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.truncate({ cascade: true, force: true });
      sequelize.close();
    }
    app.close();
  });

  describe('ADMIN', () => {
    describe('AUTH', () => {
      it('should log admin', () => {
        const dto: LoginUserDto = {
          email: config.get<string>('ADMIN_EMAIL')!,
          password: config.get<string>('ADMIN_PASSWORD')!,
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('tokenAdmin', 'token');
      });

      it('should give an email error', () => {
        const dto: LoginUserDto = {
          email: 'blahblah@gmail.com',
          password: config.get<string>('ADMIN_PASSWORD')!,
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should give a password error', () => {
        const dto: LoginUserDto = {
          email: config.get<string>('ADMIN_EMAIL')!,
          password: 'senha incorreta',
        };
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(400);
      });

      it('should update admin', () => {
        const dto: UpdateUserDto = {
          name: 'Luannn',
          password: '123456',
        };
        return pactum
          .spec()
          .patch('/auth')
          .withBearerToken('$S{tokenAdmin}')
          .withBody(dto)
          .expectStatus(200)
          .stores('tokenAdmin', 'token');
      });

      it('should return a error on delete user', () => {
        return pactum
          .spec()
          .delete('/auth')
          .withBearerToken('$S{tokenAdmin}')
          .expectStatus(401);
      });
    });

    describe('CATEGORIES', () => {
      it('should create a category', () => {
        const dto: CategoryDto = {
          name: 'Esporte',
        };
        return pactum
          .spec()
          .post('/category')
          .withBearerToken('$S{tokenAdmin}')
          .withBody(dto)
          .expectStatus(201);
      });
    });
  });

  describe('LEITOR', () => {
    describe('AUTH', () => {
      it('should register user', () => {
        const dto: RegisterUserDto = {
          name: 'Luan Coelho',
          email: 'test@test.com',
          password: '123456',
        };
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should verify user', () => {
        return pactum.spec().get('/auth/test/verifyEmail').expectStatus(200);
      });

      it('should log user', () => {
        const dto: LoginUserDto = {
          email: 'test@test.com',
          password: '123456',
        };

        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(201)
          .stores('tokenUser', 'token');
      });

      it('should update user', () => {
        const dto: UpdateUserDto = {
          name: 'Luannn',
          password: '123456',
        };
        return pactum
          .spec()
          .patch('/auth')
          .withBearerToken('$S{tokenUser}')
          .withBody(dto)
          .expectStatus(200)
          .stores('tokenUser', 'token');
      });
    });
  });
});
