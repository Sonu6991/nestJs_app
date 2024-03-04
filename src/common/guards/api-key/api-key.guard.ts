import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    console.log('isPublic', isPublic);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers.authorization;
    const isAuthorized = apiKey === this.configService.get('API_KEY');
    console.log(isAuthorized ? 'authorized' : 'Unauthorized');
    return isAuthorized;
  }
}
