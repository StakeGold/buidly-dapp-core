import BigNumber from 'bignumber.js';

export const toDenominated = (amount: BigNumber, decimals = 18): BigNumber => {
  const denominatedValue = amount.shiftedBy(-decimals);
  return denominatedValue;
};

export const toDenominatedString = (
  amount: BigNumber,
  decimals = 18,
  fixed = 18
): string => {
  let denominatedValue = toDenominated(amount, decimals).toFixed(
    fixed,
    BigNumber.ROUND_DOWN
  );
  if (denominatedValue.includes('.')) {
    denominatedValue = denominatedValue.replace(/0+$/g, '').replace(/\.$/g, '');
  }

  return denominatedValue;
};

export const toFixed = (amount: string, decimals = 2): string => {
  return new BigNumber(amount).toFixed(decimals);
};

export const numberDecode = (encoded: string): BigNumber => {
  const hex = Buffer.from(encoded, 'base64').toString('hex');
  return new BigNumber(hex, 16);
};
