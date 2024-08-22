import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { VerifyDto } from '@/modules/mail/dto/verify.dto';
import { SendMailFailedException } from '@exceptions/send-mail-failed.exception';
import { Mail } from '@constants/mail';
import { ResetDto } from '@/modules/mail/dto/reset.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(mail: VerifyDto) {
    try {
      await this.mailerService.sendMail({
        to: mail.recipients,
        subject: Mail.VERIFICATION_SUBJECT,
        template: './verificationEmail',
        context: mail.context,
      });
    } catch (e) {
      throw new SendMailFailedException();
    }
  }

  async sendResetPasswordEmail(mail: ResetDto) {
    try {
      await this.mailerService.sendMail({
        to: mail.recipients,
        subject: Mail.RESET_PASSWORD_SUBJECT,
        template: './resetPasswordEmail',
        context: mail.context,
      });
    } catch (e) {
      throw new SendMailFailedException();
    }
  }
}
