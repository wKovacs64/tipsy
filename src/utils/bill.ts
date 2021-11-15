export function billToUrlParam(bill: string) {
  return bill.replace('.', '');
}

export function billFromUrlParam(param?: string) {
  return param ? `${param.slice(0, -2)}.${param.slice(-2)}` : '0.00';
}
