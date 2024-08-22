import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'nodemailer/lib/mailer';
import { IsNotEmpty } from 'class-validator';
import { ResetPasswordPayload } from '@/bases/types';

export class ResetDto {
  @ApiProperty()
  @IsNotEmpty()
  recipients: Address[];

  @ApiProperty()
  @IsNotEmpty()
  context: ResetPasswordPayload;
}
