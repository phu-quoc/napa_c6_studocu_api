import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@constants/message';

export class VerifiedException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.VERIFIED(text));
  }
}
