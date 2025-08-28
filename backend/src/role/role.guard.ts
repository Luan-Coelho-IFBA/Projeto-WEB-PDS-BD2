import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JWTType } from 'types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (requiredRoles.length <= 0) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const roleName = (request.user as JWTType).role;

    if (!requiredRoles.includes(roleName)) return false;

    return true;
  }
}
