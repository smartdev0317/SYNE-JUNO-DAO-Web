import { CodeMirrorInput } from '@client/components/smart/CodeMirrorInput/CodeMirrorInput';
import { div } from '@client/libs/math';
import { SwordsEmoji } from '@client/utils/emoji';
import { tokens } from '@client/utils/helper';
import { Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import './ExecuteSmartContract.scss';

const { Option } = Select;

const ExecuteSmartContract = ({
  setFinalMsg,
  initialValues,
}: {
  setFinalMsg?: any;
  initialValues?: any;
}) => {
  const [smartContractAddress, setSmartContractAddress] = useState(
    initialValues?.contract_addr ?? '',
  );
  const [error, setError] = useState('');
  const [message, setMessage] = useState(
    initialValues?.msg
      ? Buffer.from(initialValues?.msg, 'base64')?.toString('ascii')
      : '{}',
  );
  const [fundCount, setFundCount] = useState(
    div(initialValues?.funds[0]?.amount, '1000000') ?? '1',
  );
  const [showFunds, setShowFunds] = useState(
    initialValues?.funds?.length ? true : false,
  );
  const [fundToken, setFundToken] = useState(
    initialValues?.funds[0]['denom'] ?? '',
  );
  useEffect(() => {
    try {
      if (setFinalMsg) {
        JSON.parse(message);
        setFinalMsg('smartContract', {
          message: JSON.parse(message),
          address: smartContractAddress,
          fundCount: fundCount,
          fundToken: fundToken,
          status:
            smartContractAddress?.length != 63 ||
            !smartContractAddress.startsWith('juno')
              ? 'error'
              : '',
        });
        setError('json is valid');
      }
    } catch (error) {
      setFinalMsg('smartContract', {
        status: 'error',
      });
      setError('json is not valid');
    }
  }, [message, smartContractAddress, fundCount, fundToken]);
  return (
    <div className="execute-smart-contract-action">
      <div className="headingWrap">
        <span className="text-size">
          {' '}
          <SwordsEmoji />
        </span>
        <h2>Execute Smart Contract</h2>
      </div>
      <div className="token-input">
        <label>Smart Contract Address</label>
        <Input
          value={smartContractAddress}
          onChange={(e) => setSmartContractAddress(e.target.value)}
          status={
            smartContractAddress?.length > 0
              ? smartContractAddress?.length != 63 ||
                !smartContractAddress.startsWith('juno')
                ? 'error'
                : ''
              : ''
          }
          readOnly={initialValues ? true : false}
        />
      </div>
      <div className="token-input">
        <label>Message</label>
        <CodeMirrorInput
          message={message}
          setMessage={setMessage}
          isReadOnly={initialValues ? true : false}
        />
        <span className="text-white">{error}</span>
      </div>
      {showFunds && (
        <div className="show-funds">
          <label>Funds</label>
          <div className="fund-wrapper">
            <Input
              min={1}
              value={fundCount}
              onChange={(e) => setFundCount(e.target.value)}
              className="fund-input"
              type={'number'}
              readOnly={initialValues ? true : false}
            />
            <Select
              defaultValue={initialValues ? fundToken : null}
              onChange={(value) => setFundToken(value)}
              className="fund-dropdown"
              placeholder="Select Token"
              disabled={initialValues ? true : false}
            >
              {tokens?.map(({ value, text }, key) => (
                <Option value={value} key={key}>
                  {text}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      )}
      <div className="addFunds" onClick={() => setShowFunds(true)}>
        Add Payment
      </div>
    </div>
  );
};

export default ExecuteSmartContract;
