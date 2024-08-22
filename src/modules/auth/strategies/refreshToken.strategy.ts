import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JWT_REFRESH_SECRET } from '@/bases/environments';
import { UsersService } from '@/modules/users/users.service';
import { Request } from 'express';
import { UserPayload } from '@/bases/types';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: UserPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    const user = await this.userService.findById(+payload.id);
    return { ...user, refreshToken };
  }
}
