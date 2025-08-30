import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TestGuard implements CanActivate {
  private readonly logger = new Logger(TestGuard.name);

  constructor(
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isTest =
      this.reflector.get<boolean>('isTest', context.getHandler()) ?? false;
    const isProduction =
      this.configService.getOrThrow<string>('PRODUCTION') == 'true';
    this.logger.log(isTest);
    this.logger.log(isProduction);
    this.logger.log(isTest && isProduction);

    if (isTest && isProduction) {
      this.logger.warn('Não é permitido');
      return false;
    }

    return true;
  }
}
