import { walletState } from '@client/services/state/walletAtoms';
import { atom, selector, selectorFamily } from 'recoil';
import { iterateAllPage, priceKeyIndexState } from './app';
import contracts from '../../contracts.json';
import { useStore } from './loadable';
import CHAIN from '../../chain_info.json';
import { plus } from '@client/libs/math';

export const chainId = CHAIN['chainId'];
export const CHAIN_INFO = CHAIN[chainId];

export const stakeConfigQuery = selector({
  key: 'stakeConfigQuery',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].staking ?? '', {
        query_config: {},
      });
    } catch (error) {
      console.error('stakeConfigQuery ' + error);
      return [];
    }
  },
});

export const durationsStakedQuery = selector({
  key: 'durationsStakedQuery',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    try {
      const data = get(stakeConfigQuery);
      return (
        data?.duration_values_vector.filter((item) =>
          [1, 3, 6, 12].includes(item),
        ) ?? []
      );
    } catch (error) {
      console.error('durationsStakedQuery ' + error);
      return [];
    }
  },
});

export const totalLockedStakedQuery = selector({
  key: 'totalLockedStakedQuery',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const durations = get(durationsStakedQuery);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      let list = {};
      await Promise.all(
        durations?.map(async (duration) => {
          const data = await client.queryContractSmart(
            contracts[chainId].staking ?? '',
            {
              total_balance: {
                duration: duration,
              },
            },
          );
          list[duration] = data;
        }),
      );
      const totalCount: any =
        list &&
        Object.values(list).reduce((a: any, b: any) => plus(a, b.balance), 0);
      return totalCount;
    } catch (error) {
      console.error('totalLockedStakedQuery ' + error);
      return {};
    }
  },
});

export const totalStakedByUserQuery = selector({
  key: 'totalStakedByUserQuery',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const durations = get(durationsStakedQuery);
    const { client, address } = get(walletState);
    if (!client) {
      return;
    }
    try {
      let list = {};
      await Promise.all(
        durations?.map(async (duration) => {
          const data = await client.queryContractSmart(
            contracts[chainId].staking ?? '',
            {
              query_staked_by_user: {
                wallet: address,
                duration: duration,
              },
            },
          );
          list[duration] = data;
        }),
      );
      const totalCount: any =
        list && Object.values(list).reduce((a: any, b: any) => plus(a, b), 0);
      return totalCount;
    } catch (error) {
      console.error('totalStakedByUserQuery ' + error);
      return {};
    }
  },
});

export const queryUserPower = selector({
  key: 'queryUserPower',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client, address } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].staking ?? '', {
        balance: {
          address: address,
        },
      });
    } catch (error) {
      console.error('queryUserPower ' + error);
      return {};
    }
  },
});

export const queryProposalConfig = selector({
  key: 'queryProposalConfig',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].proposal ?? '', {
        config: {},
      });
    } catch (error) {
      console.error('queryProposalConfig ' + error);
      return {};
    }
  },
});

export const queryUserHoldAmount = selector({
  key: 'queryUserHoldAmount',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client, address } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].proposal ?? '', {
        hold_amount: {
          address: address,
        },
      });
    } catch (error) {
      console.error('queryUserHoldAmount ' + error);
      return {};
    }
  },
});

export const queryUserVote = selectorFamily({
  key: 'queryUserVote',
  get:
    (id: any) =>
    async ({ get }) => {
      get(priceKeyIndexState);
      const { client, address } = get(walletState);
      if (!client) {
        return;
      }
      try {
        return await client.queryContractSmart(contracts[chainId].proposal ?? '', {
          get_vote: {
            proposal_id: Number(id),
            voter: address,
          },
        });
      } catch (error) {
        console.error('queryUserVote ' + error);
        return {};
      }
    },
});

export const listAllProposals = selector({
  key: 'listAllProposals',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client } = get(walletState);
    if (!client) {
      return;
    }
    try {
      const query = async (offset?: any[]) => {
        const data: any = await client.queryContractSmart(
          contracts[chainId].proposal ?? '',
          {
            list_proposals: {
              limit: 30,
              start_after: offset,
            },
          },
        );
        return data.proposals ?? [];
      };
      return await iterateAllPage(query, (data: any) => data?.id, 30);
    } catch (error) {
      console.log('error', error);
      return error;
    }
  },
});

export const getProposalDetail = selectorFamily({
  key: 'getProposalDetail',
  get:
    (id: any) =>
    async ({ get }) => {
      get(priceKeyIndexState);
      const { client } = get(walletState);
      if (!client) {
        return;
      }
      try {
        const data = await client.queryContractSmart(
          contracts[chainId].proposal ?? '',
          {
            proposal: {
              proposal_id: Number(id),
            },
          },
        );
        return data;
      } catch (error) {
        return error;
      }
    },
});

export const getProposalVotesList = selectorFamily({
  key: 'getProposalVotesList',
  get:
    (id: any) =>
    async ({ get }) => {
      get(priceKeyIndexState);
      const { client } = get(walletState);
      if (!client) {
        return;
      }
      try {
        const query = async (offset?: any[]) => {
          const data = await client.queryContractSmart(
            contracts[chainId].proposal ?? '',
            {
              list_votes: {
                proposal_id: Number(id),
                limit: 30,
                start_after: offset,
              },
            },
          );
          return data?.votes ?? [];
        };
        return await iterateAllPage(query, (data: any) => data?.voter, 30);
      } catch (error) {
        return error;
      }
    },
});

export const lopoTokenInfo = selector({
  key: 'lopoTokenInfo',
  get: async ({ get }) => {
    get(priceKeyIndexState);
    const { client, address } = get(walletState);
    if (!client) {
      return;
    }
    try {
      return await client.queryContractSmart(contracts[chainId].staking ?? '', {
        token_info: {},
      });
    } catch (error) {
      console.error('lopoTokenInfo ' + error);
      return {};
    }
  },
});

const getLopoTokenInfo = atom<any>({
  key: 'getLopoTokenInfo',
  default: {},
});

export const useLopoTokenInfo = () => {
  return useStore(lopoTokenInfo, getLopoTokenInfo);
};

const getQueryUserHoldAmount = atom<any>({
  key: 'getQueryUserHoldAmount',
  default: {},
});

export const useQueryUserHoldAmount = () => {
  return useStore(queryUserHoldAmount, getQueryUserHoldAmount);
};

const getQueryProposalConfig = atom<any>({
  key: 'getQueryProposalConfig',
  default: {},
});

export const useQueryProposalConfig = () => {
  return useStore(queryProposalConfig, getQueryProposalConfig);
};

const getQueryUserVote = atom<any>({
  key: 'getQueryUserVote',
  default: {},
});

export const useGetQueryUserVote = (id) => {
  return useStore(queryUserVote(id), getQueryUserVote);
};

const getQueryUserStakedState = atom<any>({
  key: 'getQueryUserStakedState',
  default: {},
});

export const useGetQueryTotalStakedByUser = () => {
  return useStore(totalStakedByUserQuery, getQueryUserStakedState);
};

const getQueryUserPowerState = atom<any>({
  key: 'getQueryUserPowerState',
  default: {},
});

export const useGetQueryTotalUserPower = () => {
  return useStore(queryUserPower, getQueryUserPowerState);
};

const getProposalVotesListState = atom<any>({
  key: 'getProposalVotesListState',
  default: {},
});

export const useGetProposalVotesList = (id) => {
  return useStore(getProposalVotesList(id), getProposalVotesListState);
};

const gettotalStakedState = atom<any>({
  key: 'gettotalStakedState',
  default: {},
});

export const useGetTotalStaked = () => {
  return useStore(totalLockedStakedQuery, gettotalStakedState);
};

const getProposalsState = atom<any>({
  key: 'getProposalsState',
  default: {},
});

export const useGetProposalDetails = (id) => {
  return useStore(getProposalDetail(id), getProposalsState);
};

const listAllProposalsState = atom<any>({
  key: 'listAllProposalsState',
  default: {},
});

export const useAllProposals = () => {
  return useStore(listAllProposals, listAllProposalsState);
};

export const junoRPCURL = selector({
  key: 'junoRPCURL',
  get: ({ get }) => {
    return CHAIN_INFO?.rpc;
  },
});
