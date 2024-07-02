import CHAIN from '../../chain_info.json';
import contracts from '../../contracts.json';

/* syne:unit */
export const SMALLEST = 1e6;
export const SYNE = 'SYNE';
export const WYND = 'WYND';
export const LOOP = 'LOOP';
export const hour = '24h';
export const LP = 'LP';
export const LUV = 'LUV';
export const JUNOX = 'JUNOX';
export const UJUNO = 'ujuno';
export const UJUNOX = 'ujunox';
export const JUNO = 'JUNO';
export const SYNEPO = 'veSYNE';

/* mirror:configs */
export const GENESIS = 1607022000000;
export const MAX_SPREAD = 0.01;
export const MAX_MSG_LENGTH = 4096;
export const COMMISSION = 0.003;

export const DEFAULT_FEE_NUM = 5.0;
export const DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL = 1500;
export const DEFAULT_REFETCH_ON_WINDOW_FOCUS_STALE_TIME = 60000; // 1 minute
export const chainId = CHAIN.chainId;
export const CHAIN_INFO = CHAIN[chainId];
export const nativeDenom = {
  'uni-6': 'ujunox',
  'juno-1': 'ujuno',
}[chainId];
export const PROPOSAL_CONTRACT_ADDRESS = contracts[chainId].proposal;
