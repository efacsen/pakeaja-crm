export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(num: number): string {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}M`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}Jt`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}Rb`;
  }
  return num.toString();
}