import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from './roles.decorator';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // If no roles are required, access is granted
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;

    if (!user || !user.roles) {
      throw new ForbiddenException(
        'User does not have the necessary roles to access this resource',
      );
    }

    if (!requiredRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException(
        'User does not have the necessary roles to access this resource',
      );
    }

    return true;
  }
}
