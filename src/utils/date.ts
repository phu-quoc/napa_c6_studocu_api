import { PREMIUM_EXPIRE_DURATION } from '@environments';

export const hasPremiumPeriod = (expireAt: Date) => {
  const datetime = new Date(expireAt);
  const now = new Date();
  return datetime.getTime() >= now.getTime();
};

export const upgradePremiumPeriod = (premiumExpireAt?: Date) => {
  if (premiumExpireAt) {
    const newPremium =
      new Date(premiumExpireAt).getTime() + PREMIUM_EXPIRE_DURATION;
    return new Date(newPremium);
  }
  const now = new Date();
  const newPremium = now.getTime() + PREMIUM_EXPIRE_DURATION;
  return new Date(newPremium);
};
