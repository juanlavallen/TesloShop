import { SetMetadata } from '@nestjs/common';
import { AllowedRoles } from '../interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: AllowedRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
