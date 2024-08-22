import { BadRequestException } from '@nestjs/common';
import { MessageError, MessageName } from '@constants/message';

export class InvalidException extends BadRequestException {
  constructor(text: MessageName) {
    super(MessageError.INVALID(text));
  }
}
