import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserJWT = createParamDecorator((_, ctx) => {
  const request: Request = ctx.switchToHttp().getRequest();
  return request.user;
});
