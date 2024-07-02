import { walletState } from '@client/services/state/walletAtoms';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilValue,
} from 'recoil';
import { useStore } from './loadable';
import contracts from '../../contracts.json';
import { nativeDenom } from '@client/utils/constants';
import { priceKeyIndexState } from './app';
import { chainId } from '@client/App';

export const getTokenInfo = selectorFamily({
  key: 'getTokenInfo',
  get:
    (token_addr: any) =>
    async ({ get }) => {
      const { client } = get(walletState);
      if (!client) {
        return;
      }
      try {
        const data = await client.queryContractSmart(token_addr ?? '', {
          token_info: {},
        });
        return 'success';
      } catch (error) {
        return 'error';
      }
    },
});

const getTokenInfoState = atom<any>({
  key: 'getTokenInfoState',
  default: null,
});

export const useTokenInfo = (tokenAddress) => {
  return useStore(getTokenInfo(tokenAddress), getTokenInfoState);
};

export const treasuasryJunoBalance = selector({
  key: 'treasuasryJunoBalance',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      const data = await client.getBalance(
        contracts[chainId].proposal,
        nativeDenom ?? 'ujuno',
      );
      return data;
    } catch (error) {
      return 'error' + error;
    }
  },
});

const getTreasuasryJunoBalance = atom<any>({
  key: 'getTreasuasryJunoBalance',
  default: null,
});

export const useTreasuasryJunoBalance = () => {
  return useStore(treasuasryJunoBalance, getTreasuasryJunoBalance);
};

export const treasuarySyneBalance = selector({
  key: 'treasuarySyneBalance',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].syne_addr ?? '', {
        balance: {
          address: contracts[chainId].proposal,
        },
      });
    } catch (error) {
      console.error('treasuarySyneBalance ' + error);
      return {};
    }
  },
});

const getTreasuarySyneBalance = atom<any>({
  key: 'getTreasuarySyneBalance',
  default: {},
});

export const useTreasurySyneBalance = () => {
  return useStore(treasuarySyneBalance, getTreasuarySyneBalance);
};
