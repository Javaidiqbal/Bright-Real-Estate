/**
 * Universal Currency & Numerical Formatter for Pakistani Rupees (PKR)
 */

export const CURRENCY_SYMBOL = 'PKR ';

/**
 * Formats a number as Pakistani Rupees with standard comma separation (e.g. PKR 9,850,000)
 */
export const formatPKR = (amount: number, fractionDigits = 0): string => {
  if (isNaN(amount) || amount === null || amount === undefined) return `${CURRENCY_SYMBOL}0`;
  const rounded = fractionDigits > 0 ? amount.toFixed(fractionDigits) : Math.round(amount);
  return `${CURRENCY_SYMBOL}${Number(rounded).toLocaleString('en-PK')}`;
};

// Backwards compatibility alias
export const formatRupees = formatPKR;

/**
 * Formats property listing prices with period designation for rentals
 */
export const formatPropertyPrice = (price: number, listingType: 'for_sale' | 'for_rent' = 'for_sale'): string => {
  const formatted = formatPKR(price);
  return listingType === 'for_rent' ? `${formatted}/mo` : formatted;
};

/**
 * Formats large amounts compactly (e.g., PKR 9.8M or PKR 9.85 Cr / PKR 98.5 Lakh)
 */
export const formatCompactPKR = (amount: number): string => {
  if (!amount || amount === 0) return `${CURRENCY_SYMBOL}0`;
  if (amount >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = amount / 10000000;
    return `${CURRENCY_SYMBOL}${cr.toFixed(cr % 1 === 0 ? 0 : 2)} Cr`;
  }
  if (amount >= 100000) {
    // 1 Lakh = 100,000
    const lakh = amount / 100000;
    return `${CURRENCY_SYMBOL}${lakh.toFixed(lakh % 1 === 0 ? 0 : 1)} Lakh`;
  }
  if (amount >= 1000) {
    return `${CURRENCY_SYMBOL}${(amount / 1000).toFixed(0)}k`;
  }
  return formatPKR(amount);
};

export const formatCompactRupees = formatCompactPKR;

/**
 * Formats in Millions format with PKR prefix for high-level dashboard charts (e.g., PKR 9.8M)
 */
export const formatMillionPKR = (amount: number): string => {
  if (!amount || amount === 0) return `${CURRENCY_SYMBOL}0M`;
  return `${CURRENCY_SYMBOL}${(amount / 1000000).toFixed(1)}M`;
};

export const formatMillionRupees = formatMillionPKR;

