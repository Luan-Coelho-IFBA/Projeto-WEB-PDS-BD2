import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

const JWTConfig = (config: ConfigService): JwtModuleOptions => ({
  global: true,
  secret: config.get('JWT_SECRET'),
  signOptions: { expiresIn: '2d' },
});

export default JWTConfig;
