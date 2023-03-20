import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES_KEY } from '../decorators/role-protected.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      META_ROLES_KEY,
      context.getHandler(),
    );

    if (!roles) return true;
    if (roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    if (!user) {
      throw new BadRequestException('User not found in request');
    }
    for (const role of user.roles) {
      if (roles.includes(role)) {
        return true;
      }
    }
    throw new ForbiddenException('User does not have required role(s)');
  }
}
