import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { Roles } from 'src/role/role.decorator';
import { RoleGuard } from 'src/role/role.guard';

export const Authenticate = (...roles: string[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, RoleGuard), Roles(...roles));
