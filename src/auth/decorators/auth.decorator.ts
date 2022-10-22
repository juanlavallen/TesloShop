import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from '.';
import { RoleGuard } from '../guards/role.guard';
import { AllowedRoles } from '../interfaces';

export function Auth(...roles: AllowedRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), RoleGuard),
  );
}
