import type currency from 'currency.js';

export const getPreviousEvenDollar = (current: currency): number =>
  current.cents() ? current.dollars() : current.subtract(1).dollars();
