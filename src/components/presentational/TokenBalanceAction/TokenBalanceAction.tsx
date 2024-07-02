import { useTokenInfo } from '@client/queries/tokenInfo';
import { TokenEmoji } from '@client/utils/emoji';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import './TokenBalanceAction.scss';

const TokenBalanceAction = ({
  setFinalMsg,
  initialValues,
  contractAddress,
}: {
  setFinalMsg?: any;
  initialValues?: any;
  contractAddress?: string;
}) => {
  const [tokenAddress, setTokenAddress] = useState(contractAddress ?? '');
  const { contents } = useTokenInfo(tokenAddress);
  useEffect(() => {
    if (setFinalMsg) {
      if (contents == 'success') {
        setFinalMsg('tokenBalanceAction', {
          tokenAddress: tokenAddress,
          status: '',
        });
      } else {
        setFinalMsg('tokenBalanceAction', {
          status: 'error',
        });
      }
    }
  }, [tokenAddress, contents]);
  return (
    <div className="token-balance-action">
      <div className="headingWrap">
        <span className="text-size">
          {' '}
          <TokenEmoji />
        </span>
        <h2>Display Token Balance in Treasury</h2>
      </div>
      <div className="token-input">
        <label>Token Address</label>
        <Input
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          status={tokenAddress?.length && contents}
          readOnly={contractAddress ? true : false}
        />
        {tokenAddress?.length && contents === 'error' ? (
          <span className="error">Invalid Token Address</span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TokenBalanceAction;
