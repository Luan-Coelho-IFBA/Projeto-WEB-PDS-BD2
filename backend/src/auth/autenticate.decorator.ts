import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth.guard';
import { Roles } from '../role/role.decorator';
import { RoleGuard } from '../role/role.guard';

export const Authenticate = (...roles: string[]) =>
  applyDecorators(UseGuards(JwtAuthGuard, RoleGuard), Roles(...roles));
