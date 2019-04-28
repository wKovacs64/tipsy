function getNextEvenDollar(amount: currency): number {
  return amount.add(1).dollars();
}

export default getNextEvenDollar;
