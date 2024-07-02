import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import useAddress from '../hooks/useAddress';
import { coin } from '@cosmjs/stargate';
import { insertIf } from '@client/utils/helper';
import { number } from '@client/libs/math';

interface CoinProp {
  amount?: string;
  denom?: string;
}

export const parseCoin = (coins?: CoinProp[]) => {
  return coins?.map((coinData: CoinProp) => {
    return coin(number(coinData?.amount) ?? 0, coinData?.denom ?? '');
  });
};

export default () => {
  const sender = useAddress();

  return (
    contract: string,
    msg: object,
    coins?: CoinProp,
    coins2?: CoinProp,
  ) => {
    const coin = [
      ...insertIf(coins?.amount !== undefined, coins),
      ...insertIf(coins2?.amount !== undefined, coins2),
    ];
    return {
      typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      value: MsgExecuteContract.fromPartial({
        sender: sender,
        contract: contract,
        msg: toUtf8(JSON.stringify(msg)),
        funds: coin ? parseCoin(coin) : [],
      }),
    } as MsgExecuteContractEncodeObject;
  };
};
