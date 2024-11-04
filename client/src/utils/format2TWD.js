export const formatTWD = (value) => {
  if (!value) return '';

  // Return formatted TWD
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(value);
};
