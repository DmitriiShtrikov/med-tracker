// src/shared/utils/dateUtils.ts

export const getDaysUntilExpiry = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU');
};