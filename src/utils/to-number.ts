export const toNumber = (str: string): number => {
  const value = parseFloat(str);

  return Number.isNaN(value) || value === 0 ? 0 : value;
};
