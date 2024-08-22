export const hasPremiumPeriod = (expireAt: Date) => {
  const datetime = new Date(expireAt);
  const now = new Date();
  return datetime.getTime() >= now.getTime();
};
