import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from '@/bases/types';
import { UsersService } from '@/modules/users/users.service';
import { JWT_VERIFICATION_SECRET } from '@environments';

@Injectable()
export class VerificationTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify',
) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_VERIFICATION_SECRET,
    });
  }

  validate(payload: UserPayload) {
    return this.userService.findById(+payload.id);
  }
}
