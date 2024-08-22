import { ForbiddenException } from '@nestjs/common';
import { MessageError } from '@/bases/constants/message';

export class AccessDeniedException extends ForbiddenException {
  constructor() {
    super(MessageError.ACCESS_DENIED());
  }
}
