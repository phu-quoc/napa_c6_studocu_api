import { applyDecorators, UseGuards } from '@nestjs/common';
import { PremiumGuard } from '@/bases/guards/premium.guard';
import { AccessTokenGuard } from '@guards/access-token.guard';

export function Premium() {
  return applyDecorators(UseGuards(AccessTokenGuard, PremiumGuard));
}
