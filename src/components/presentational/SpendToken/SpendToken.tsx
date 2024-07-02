import { MoneyEmoji } from '@client/utils/emoji';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { div } from '@client/libs/math';
import { WalletOutlined } from '@ant-design/icons';
import { tokens } from '@client/utils/helper';
import './SpendTokens.scss';
import {
  useTreasurySyneBalance,
  useTreasuasryJunoBalance,
} from '@client/queries/tokenInfo';
import { nativeDenom, SMALLEST } from '@client/utils/constants';
import contracts from '../../../../contracts.json';
import { chainId } from '@client/App';

const { Option } = Select;

const SpendTokens = ({
  setFinalMsg,
  initialValues,
  contractAddress,
}: {
  setFinalMsg?: any;
  initialValues?: any;
  contractAddress?: string;
}) => {
  const [treasuryAddress, setTreasuryAddress] = useState(
    initialValues?.recipient ?? '',
  );
  const [fundCount, setFundCount] = useState(
    initialValues?.amount ? div(initialValues?.amount, '1000000') : '1',
  );
  const [fundToken, setFundToken] = useState(
    contractAddress ? contractAddress : '',
  );
  const { contents: treasurySyneBalance } = useTreasurySyneBalance();
  const { contents: treausaryJunoBalance } = useTreasuasryJunoBalance();

  const tresuaryTokenBalances = {
    [contracts[chainId].syne_addr]: div(treasurySyneBalance?.balance, SMALLEST),
    [nativeDenom]: div(treausaryJunoBalance?.amount, SMALLEST),
  };
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      setFinalMsg('spendTokens', {
        treasuryAddress: treasuryAddress,
        fundCount: fundCount,
        fundToken: fundToken,
        status:
          treasuryAddress?.length != 43 || !treasuryAddress.startsWith('juno')
            ? 'error'
            : tresuaryTokenBalances[fundToken] < fundCount
            ? 'error'
            : fundCount < '0' || fundToken?.length == 0
            ? 'error'
            : '',
      });
    } catch (error) {}
  }, [treasuryAddress, fundCount, fundToken]);

  useEffect(() => {
    if (!initialValues) {
      if (Number(tresuaryTokenBalances[fundToken]) < Number(fundCount)) {
        setErrorMsg('Insufficient token balance');
      } else {
        setErrorMsg('');
      }
    }
  }, [fundToken, fundCount]);

  return (
    <div className="spend-tokens">
      <div className="headingWrap">
        <span className="text-size">
          {' '}
          <MoneyEmoji />
        </span>
        <h2>Spend</h2>
      </div>
      <div className="contract-info">
        <div className="token-input code-id">
          <div className="show-funds">
            <div className="fund-wrapper">
              <Input
                min={1}
                value={fundCount}
                onChange={(e) => setFundCount(e.target.value)}
                className="fund-input"
                type={'number'}
                status={
                  !initialValues
                    ? fundCount < '0' ||
                      Number(tresuaryTokenBalances[fundToken]) <
                        Number(fundCount)
                      ? 'error'
                      : ''
                    : ''
                }
                readOnly={initialValues && !setFinalMsg ? true : false}
              />
              <Select
                defaultValue={initialValues ? fundToken : null}
                onChange={(value) => setFundToken(value)}
                className="fund-dropdown"
                placeholder={'Select Token'}
                disabled={initialValues && !setFinalMsg ? true : false}
              >
                {tokens?.map(({ value, text }, key) => (
                  <Option value={value} key={key}>
                    {text}
                  </Option>
                ))}
              </Select>
              <FontAwesomeIcon icon={faArrowRight} color={'#fff'} />
            </div>
          </div>
        </div>
        <div className="token-input contract-label">
          <Input
            value={treasuryAddress}
            onChange={(e) => setTreasuryAddress(e.target.value)}
            status={
              treasuryAddress?.length > 0
                ? treasuryAddress?.length != 43 ||
                  !treasuryAddress.startsWith('juno')
                  ? 'error'
                  : ''
                : ''
            }
            placeholder="wallet Address"
            readOnly={initialValues && !setFinalMsg ? true : false}
            prefix={<WalletOutlined />}
          />
        </div>
      </div>
      {errorMsg?.length && <span className="error">{errorMsg}</span>}
    </div>
  );
};

export default SpendTokens;
