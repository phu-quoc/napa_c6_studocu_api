import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { hasPremiumPeriod } from '@/utils/date';
import { ExpiredException } from '@exceptions/expired.exception';
import { MessageName } from '@constants/message';

@Injectable()
export class PremiumGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { user } = context.switchToHttp().getRequest();
    if (!user?.premiumExpireAt || !hasPremiumPeriod(user.premiumExpireAt))
      throw new ExpiredException(MessageName.PREMIUM);
    return true;
  }
}
