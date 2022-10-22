import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const META_ROLES = 'roles';
    const allowedRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!allowedRoles) return true;
    if (allowedRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException(`User not found`);

    for (const role of user.roles) {
      if (allowedRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(`User ${user.fullname} need a valid role`);
  }
}
