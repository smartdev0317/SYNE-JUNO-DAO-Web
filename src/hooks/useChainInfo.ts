import { CHAIN_INFO } from '@client/queries/proposalInfo';
import { ChainInfo } from '@keplr-wallet/types';

export const unsafelyReadChainInfoCache = () => CHAIN_INFO;

export const useChainInfo = () => {
  const isLoading = false;
  const data: ChainInfo = CHAIN_INFO;

  return [data, isLoading] as const;
};
