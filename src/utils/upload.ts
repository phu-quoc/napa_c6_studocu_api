import { InvalidException } from '@exceptions/invalid.exception';
import { MessageName } from '@constants/message';
import { MAX_FILE_SIZE } from '@environments';

const validMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const isAllowSize = (size: number) => {
  if (size > MAX_FILE_SIZE * 1024 * 1024)
    throw new InvalidException(MessageName.SIZE);
  return true;
};

export const isValidFormat = (mimetype: string) => {
  if (!validMimeTypes.includes(mimetype))
    throw new InvalidException(MessageName.FORMAT);
  return true;
};
