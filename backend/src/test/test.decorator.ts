import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { TestGuard } from './test.guard';

export const TestOnly = () =>
  applyDecorators(SetMetadata('isTest', true), UseGuards(TestGuard));
