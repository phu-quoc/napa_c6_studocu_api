import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/users/dto/create.dto';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  premiumExpireAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resetCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  resetCodeExpireAt?: Date;
}
