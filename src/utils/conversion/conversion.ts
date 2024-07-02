import { div, num, pow } from '@client/libs/math';

export const protectAgainstNaN = (value: any) =>
  isNaN(num(value)) ? 0 : value;

export function convertMicroDenomToDenom(
  value: number | string,
  decimals: number,
): number {
  if (decimals === 0) return Number(value);
  const g = pow('10', decimals);
  return protectAgainstNaN(div(value, g));
}

export function convertDenomToMicroDenom(
  value: number | string,
  decimals: number,
): number {
  if (decimals === 0) return Number(value);
  const g = pow('10', decimals);
  return protectAgainstNaN(parseInt(String(Number(value) * num(g)), 10));
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase();
}

export function convertToFixedDecimals(value: number | string): string {
  const amount = Number(value);
  return amount > 0.01 ? amount.toFixed(2) : String(amount);
}

export const formatTokenName = (name: string) => {
  if (name) {
    return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase();
  }
  return '';
};
