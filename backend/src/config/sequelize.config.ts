import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from 'src/auth/entity/user.entity';
import { Role } from 'src/roles/entity/role.entity';

const SequelizeConfig = (config: ConfigService): SequelizeModuleOptions => ({
  dialect: 'postgres',
  host: config.get('DB_HOST'),
  port: config.get('DB_PORT'),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  models: [User, Role],
  autoLoadModels: true,
  synchronize: true,
});

export default SequelizeConfig;
