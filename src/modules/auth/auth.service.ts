import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '@/modules/users/users.service';
import { CreateUserDto } from '@/modules/users/dto';
import { ExistsException } from '@/bases/exceptions/exists.exeption';
import { MessageName } from '@/bases/constants/message';
import { ResourceNotFoundException } from '@exceptions/resource-not-found.exception';
import { IncorrectException } from '@/bases/exceptions/incorrect.exception';
import { AccessDeniedException } from '@/bases/exceptions/access-denied.exception';
import { MailService } from '@/modules/mail/mail.service';
import {
  EMAIL_CONFIRMATION_PATH,
  FE_URL,
  JWT_ACCESS_EXPIRES_IN,
  JWT_VERIFICATION_EXPIRES_IN,
  PRIVATE_TOKEN_EXPIRES_IN,
  PRIVATE_TOKEN_SECRET,
} from '@environments';
import { join } from 'path';
import { VerifiedException } from '@exceptions/verified.exception';
import { ResetPasswordDto } from '@/modules/auth/dto';
import { ExpiredException } from '@exceptions/expired.exception';
import { DocumentsService } from '@/modules/documents/documents.service';
import { FilterDocumentDto } from '@/modules/documents/dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private documentsService: DocumentsService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async signUp(dto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(dto.email);

    if (userExists) {
      throw new ExistsException(MessageName.USER);
    }

    // Hash password
    const hash = this.hashData(dto.password);

    const newUser = await this.usersService.create({
      ...dto,
      password: hash,
    });

    const verificationToken = await this.getVerificationToken(
      newUser.id,
      newUser.email,
    );
    await this.mailService.sendVerificationEmail({
      recipients: [{ name: newUser.displayName, address: newUser.email }],
      context: {
        url: join(FE_URL, EMAIL_CONFIRMATION_PATH, verificationToken),
        name: newUser.displayName,
      },
    });

    delete newUser.password;
    return {
      user: newUser,
    };
  }

  async signIn(data: AuthDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    const passwordMatches = user.comparePassword(data.password);
    if (!passwordMatches) throw new IncorrectException(MessageName.USER);

    if (!user.active) throw new AccessDeniedException();

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    delete user.password;
    return {
      ...tokens,
      user: user,
    };
  }

  async getMe(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      premiumExpireAt: user.premiumExpireAt,
      university: user.university,
    };
  }

  async getDocuments(userId: number, dto: FilterDocumentDto) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    return this.documentsService.findByUserId(userId, dto);
  }

  async getStatistics(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    return this.documentsService.getStatistics(userId);
  }

  async logout(userId: number) {
    await this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken) throw new AccessDeniedException();

    const refreshTokenMatches = bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new AccessDeniedException();

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async verifyUser(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    if (user.active) {
      throw new VerifiedException(MessageName.USER);
    }

    await this.usersService.update(user.id, {
      active: true,
    });

    const tokens = await this.getTokens(user.id, user.email);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    const resetCode = this.generatePrivateToken(6);

    const resetCodeExpireAt = new Date(Date.now() + PRIVATE_TOKEN_EXPIRES_IN);
    await this.usersService.update(user.id, {
      resetCode,
      resetCodeExpireAt,
    });

    await this.mailService.sendResetPasswordEmail({
      recipients: [{ name: user.displayName, address: user.email }],
      context: {
        name: user.displayName,
        code: resetCode,
      },
    });

    return { email, resetCodeExpireAt };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.verifyResetCode(data.email, data.resetCode);

    // Hash password
    const hash = this.hashData(data.password);

    await this.usersService.update(user.id, {
      password: hash,
      resetCode: null,
      resetCodeExpireAt: null,
    });

    const tokens = await this.getTokens(user.id, user.email);
    delete user.password;
    delete user.resetCode;
    delete user.resetCodeExpireAt;
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  hashData(data: string) {
    return bcrypt.hashSync(data, 10);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwtAccessSecret'),
          expiresIn: JWT_ACCESS_EXPIRES_IN,
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
        },
        {
          secret: this.configService.get<string>('jwtRefreshSecret'),
          expiresIn: JWT_ACCESS_EXPIRES_IN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  getVerificationToken(userId: number, email: string) {
    return this.jwtService.signAsync(
      {
        id: userId,
        email,
      },
      {
        secret: this.configService.get<string>('jwtVerificationSecret'),
        expiresIn: JWT_VERIFICATION_EXPIRES_IN,
      },
    );
  }

  generatePrivateToken(length: number) {
    let result = '';
    const characters = PRIVATE_TOKEN_SECRET;
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async verifyResetCode(email: string, resetCode: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new ResourceNotFoundException(MessageName.USER);
    }

    if (!user.resetCode || user.resetCode !== resetCode) {
      throw new IncorrectException(MessageName.RESET_CODE);
    }

    const now = new Date();
    if (now > user.resetCodeExpireAt) {
      throw new ExpiredException(MessageName.RESET_CODE);
    }

    return user;
  }
}
