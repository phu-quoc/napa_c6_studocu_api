import { MessageError, MessageName } from '@/bases/constants/message';
import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
  constructor(text: MessageName) {
    super(MessageError.NOT_FOUND(text));
  }
}
