import { atom } from 'recoil';

export const walletState = atom<any>({
  key: 'internal-wallet',
  default: {
    key: null,
  },
});

export const refetchProChart = atom<any>({
  key: 'refetchProChart',
  default: {
    key: null,
  },
});
