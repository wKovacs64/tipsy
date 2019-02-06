// Shamelessly taken from https://github.com/ianmcnally/react-currency-masked-input

const getDigitsFromValue = (value = ''): string =>
  value.replace(/(-(?!\d))|[^0-9|-]/g, '') || '';

const padDigits = (digits: string): string => {
  const desiredLength = 3;
  const actualLength = digits.length;

  if (actualLength >= desiredLength) {
    return digits;
  }

  const amountToAdd = desiredLength - actualLength;
  const padding = '0'.repeat(amountToAdd);

  return padding + digits;
};

const removeLeadingZeros = (number: string): string =>
  number.replace(/^0+([0-9]+)/, '$1');

const addDecimalToNumber = (number: string): string => {
  const centsStartingPosition = number.length - 2;
  const dollars = removeLeadingZeros(
    number.substring(0, centsStartingPosition),
  );
  const cents = number.substring(centsStartingPosition);
  return `${dollars}.${cents}`;
};

const toCurrency = (value: string): string => {
  const digits = getDigitsFromValue(value);
  const digitsWithPadding = padDigits(digits);
  return addDecimalToNumber(digitsWithPadding);
};

export default toCurrency;
