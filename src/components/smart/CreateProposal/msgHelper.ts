import { chainId } from '@client/App';
import { toAmount } from '@client/libs/parse';
import { nativeDenom } from '@client/utils/constants';
import { insertIf } from '@client/utils/helper';
import contracts from '../../../../contracts.json';
const { coin } = require('@cosmjs/stargate');

export const getActionMessages = (newContractMsg, finalMsg, voting_period) => {
  const msgs = [
    newContractMsg(contracts[chainId].proposal, {
      propose: {
        title: finalMsg.title,
        description: finalMsg.description,
        voting_period: {
          time: voting_period,
        },
        msgs: [
          ...insertIf(finalMsg.tokenBalanceAction.tokenAddress?.length, {
            wasm: {
              execute: {
                contract_addr: finalMsg.tokenBalanceAction.tokenAddress,
                msg: Buffer.from(
                  JSON.stringify({
                    balance: {
                      address: '',
                    },
                  }),
                ).toString('base64'),
                funds: [],
              },
            },
          }),
          ...insertIf(Object.keys(finalMsg.smartContract?.message).length, {
            wasm: {
              execute: {
                contract_addr: finalMsg.smartContract.address,
                msg: Buffer.from(
                  JSON.stringify({
                    ...finalMsg.smartContract.message,
                  }),
                ).toString('base64'),
                funds:
                  finalMsg.smartContract?.fundCount > 0 &&
                  finalMsg.smartContract?.fundToken?.length
                    ? [
                        coin(
                          toAmount(finalMsg.smartContract?.fundCount),
                          finalMsg.smartContract?.fundToken,
                        ),
                      ]
                    : [],
              },
            },
          }),
          ...insertIf(
            Object.keys(finalMsg?.instantiateSmartContract?.message).length,
            {
              wasm: {
                instantiate: {
                  code_id: Number(finalMsg.instantiateSmartContract.codeId),
                  label: finalMsg.instantiateSmartContract.contractLabel,
                  admin: finalMsg.instantiateSmartContract.admin || '',
                  msg: Buffer.from(
                    JSON.stringify({
                      ...finalMsg.instantiateSmartContract.message,
                    }),
                  ).toString('base64'),
                  funds:
                    finalMsg.instantiateSmartContract?.fundCount > 0 &&
                    finalMsg.instantiateSmartContract?.fundToken?.length
                      ? [
                          coin(
                            toAmount(
                              finalMsg.instantiateSmartContract?.fundCount,
                            ),
                            finalMsg.instantiateSmartContract?.fundToken,
                          ),
                        ]
                      : [],
                },
              },
            },
          ),
          ...insertIf(finalMsg?.migrateSmartContract?.contractAddress?.length, {
            wasm: {
              migrate: {
                contract_addr: finalMsg.migrateSmartContract.contractAddress,
                new_code_id: Number(finalMsg.migrateSmartContract.codeId),
                msg: Buffer.from(
                  JSON.stringify({
                    ...finalMsg.migrateSmartContract.message,
                  }),
                ).toString('base64'),
                funds: [],
              },
            },
          }),
          ...insertIf(
            finalMsg?.spendTokens?.treasuryAddress?.length,
            finalMsg?.spendTokens?.fundToken == nativeDenom ||
              finalMsg?.spendTokens?.fundToken.startsWith('ibc/')
              ? {
                  bank: {
                    send: {
                      amount: [
                        {
                          amount: toAmount(
                            finalMsg.spendTokens?.fundCount.toString(),
                          ),
                          denom: finalMsg?.spendTokens?.fundToken,
                        },
                      ],
                      to_address: finalMsg?.spendTokens?.treasuryAddress,
                    },
                  },
                }
              : {
                  wasm: {
                    execute: {
                      contract_addr: finalMsg?.spendTokens?.fundToken,
                      funds: [],
                      msg: Buffer.from(
                        JSON.stringify({
                          transfer: {
                            recipient: finalMsg?.spendTokens?.treasuryAddress,
                            amount: toAmount(finalMsg.spendTokens?.fundCount),
                          },
                        }),
                      ).toString('base64'),
                    },
                  },
                },
          ),
        ],
      },
    }),
  ];
  return msgs;
};

export const findValue =
  (logs: any[]) =>
  (key: string, index = 0) => {
    const attribute = logs[0]?.events.find(
      (e) => e.type === 'wasm',
    )?.attributes;

    return attribute?.find((attr) => attr.key === key)?.value ?? '';
  };

export const getProposalId = (logs) => {
  const val = findValue(logs);
  return val('proposal_id');
};
