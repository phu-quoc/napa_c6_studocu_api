import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/modules/users/dto';
import { AuthDto, ResetPasswordDto, UpdateRefresh } from '@/modules/auth/dto';
import { UserPayload } from '@/bases/types';
import { Auth, User } from '@/bases/decorators';
import { RefreshTokenGuard } from '@/bases/guards/refresh-token.guard';
import { VerifyTokenGuard } from '@guards/verify-token.guard';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }

  @Auth()
  @Get('me')
  getMe(@User() user: UserPayload) {
    return this.authService.getMe(user.id);
  }

  @Auth()
  @Get('logout')
  logout(@User() user: UserPayload) {
    return this.authService.logout(user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@User() user: UserPayload, @Body() dto: UpdateRefresh) {
    return this.authService.refreshTokens(user.id, dto.refreshToken);
  }

  @UseGuards(VerifyTokenGuard)
  @Get('verify')
  verifyUser(@User() user: UserPayload) {
    return this.authService.verifyUser(user.id);
  }

  @Get('forgot-password/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
