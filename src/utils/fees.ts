import { unsafelyReadChainInfoCache } from '@client/hooks/useChainInfo';
import { coins } from '@cosmjs/stargate';
import { ChainInfo } from '@keplr-wallet/types';

export const getDefaultExecuteFee = (
  feeCurrency: ChainInfo['feeCurrencies'],
) => ({
  amount: coins(400000, feeCurrency[0].coinDenom),
  gas: '400000',
});

export const unsafelyGetDefaultExecuteFee = () => {
  const chainInfo = unsafelyReadChainInfoCache();
  if (!chainInfo) {
    throw new Error(
      'No chain info was presented in the cache. Seem to be an architectural issue. Contact developers.',
    );
  }
  return getDefaultExecuteFee(chainInfo.feeCurrencies);
};
