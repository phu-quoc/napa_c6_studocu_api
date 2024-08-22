export const MessageError = {
  DEFAULT: (message: MessageName) => `${message}`,
  NOT_FOUND: (content: MessageName) => `${content} not found`,
  EXISTS: (content: MessageName) => `${content} already exists`,
  VERIFIED: (content: MessageName) => `${content} already verified`,
  EXPIRED: (content: MessageName) => `${content} has expired`,
  INCORRECT: (content: MessageName) => `${content} is incorrect`,
  INVALID: (content: MessageName) => `${content} is invalid`,
  ACCESS_DENIED: () => `access denied`,
  SEND_MAIL_FAILED: () => `send mail failed`,
};

export enum MessageName {
  USER = 'user',
  RESET_CODE = 'reset code',
  UNIVERSITY = 'university',
  COURSE = 'course',
  CATEGORY = 'category',
  DOCUMENT = 'document',
  PREMIUM = 'premium',
  COMMENT = 'comment',
  FORMAT = 'format',
  SIZE = 'size',
}
