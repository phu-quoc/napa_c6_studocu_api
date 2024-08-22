import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@/bases/constants/role';
import { AccessTokenGuard } from '@/bases/guards/access-token.guard';
import { RolesGuard } from '@/bases/guards/roles.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AccessTokenGuard, RolesGuard),
  );
}
