import { ForbiddenException } from '@nestjs/common';
import { MessageError, MessageName } from '@constants/message';

export class ExpiredException extends ForbiddenException {
  constructor(text: MessageName) {
    super(MessageError.EXPIRED(text));
  }
}
