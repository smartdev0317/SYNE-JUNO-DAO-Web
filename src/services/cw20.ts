import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { Coin } from '@cosmjs/launchpad';

export type Expiration =
  | { readonly at_height: number }
  | { readonly at_time: number }
  | { readonly never: unknown };

export interface AllowanceResponse {
  readonly allowance: string; // integer as string
  readonly expires: Expiration;
}

export interface AllowanceInfo {
  readonly allowance: string; // integer as string
  readonly spender: string; // bech32 address
  readonly expires: Expiration;
}

export interface AllAllowancesResponse {
  readonly allowances: readonly AllowanceInfo[];
}

export interface CW20TokenInfo {
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly total_supply: string;
}

export interface Investment {
  readonly exit_tax: string;
  readonly min_withdrawal: string;
  readonly nominal_value: string;
  readonly owner: string;
  readonly staked_tokens: Coin;
  readonly token_supply: string;
  readonly validator: string;
}

export interface Claim {
  readonly amount: string;
  readonly release_at: { readonly at_time: number };
}

export interface Claims {
  readonly claims: readonly Claim[];
}

export interface AllAccountsResponse {
  // list of bech32 address that have a balance
  readonly accounts: readonly string[];
}

export interface CW20Instance {
  readonly contractAddress: string;

  // queries
  balance: (address: string) => Promise<string>;
  allowance: (owner: string, spender: string) => Promise<AllowanceResponse>;
  allAllowances: (
    owner: string,
    startAfter?: string,
    limit?: number,
  ) => Promise<AllAllowancesResponse>;
  allAccounts: (
    startAfter?: string,
    limit?: number,
  ) => Promise<readonly string[]>;
  tokenInfo: () => Promise<CW20TokenInfo>;
  investment: () => Promise<Investment>;
  claims: (address: string) => Promise<Claims>;
  minter: (sender: string) => Promise<any>;
}

export interface CW20Contract {
  use: (contractAddress: string) => CW20Instance;
}

export const CW20 = (client: SigningCosmWasmClient): CW20Contract => {
  const use = (contractAddress: string): CW20Instance => {
    const balance = async (address: string): Promise<string> => {
      const result = await client.queryContractSmart(contractAddress, {
        balance: { address },
      });
      return result.balance;
    };

    const allowance = async (
      owner: string,
      spender: string,
    ): Promise<AllowanceResponse> => {
      return client.queryContractSmart(contractAddress, {
        allowance: { owner, spender },
      });
    };

    const allAllowances = async (
      owner: string,
      startAfter?: string,
      limit?: number,
    ): Promise<AllAllowancesResponse> => {
      return client.queryContractSmart(contractAddress, {
        all_allowances: { owner, start_after: startAfter, limit },
      });
    };

    const allAccounts = async (
      startAfter?: string,
      limit?: number,
    ): Promise<readonly string[]> => {
      const accounts: AllAccountsResponse = await client.queryContractSmart(
        contractAddress,
        {
          all_accounts: { start_after: startAfter, limit },
        },
      );
      return accounts.accounts;
    };

    const tokenInfo = async (): Promise<CW20TokenInfo> => {
      return client.queryContractSmart(contractAddress, { token_info: {} });
    };

    const investment = async (): Promise<Investment> => {
      return client.queryContractSmart(contractAddress, { investment: {} });
    };

    const claims = async (address: string): Promise<Claims> => {
      return client.queryContractSmart(contractAddress, {
        claims: { address },
      });
    };

    const minter = async (): Promise<any> => {
      return client.queryContractSmart(contractAddress, { minter: {} });
    };

    return {
      contractAddress,
      balance,
      allowance,
      allAllowances,
      allAccounts,
      tokenInfo,
      investment,
      claims,
      minter,
    };
  };
  return { use };
};
