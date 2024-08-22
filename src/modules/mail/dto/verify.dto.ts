import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'nodemailer/lib/mailer';
import { IsNotEmpty } from 'class-validator';
import { VerificationPayload } from '@/bases/types';

export class VerifyDto {
  @ApiProperty()
  @IsNotEmpty()
  recipients: Address[];

  @ApiProperty()
  @IsNotEmpty()
  context: VerificationPayload;
}
