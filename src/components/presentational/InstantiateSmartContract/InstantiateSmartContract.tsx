import { CodeMirrorInput } from '@client/components/smart/CodeMirrorInput/CodeMirrorInput';
import { div } from '@client/libs/math';
import { BabyEmoji } from '@client/utils/emoji';
import { tokens } from '@client/utils/helper';
import { Input, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import './InstantiateSmartContract.scss';

const { Option } = Select;

const InstantiateSmartContract = ({
  setFinalMsg,
  initialValues,
}: {
  setFinalMsg?: any;
  initialValues?: any;
}) => {
  const [codeId, setCodeId] = useState(initialValues?.code_id ?? '0');
  const [contractLabel, setContractLabel] = useState(
    initialValues?.label ?? '',
  );
  const [admin, setAdmin] = useState(initialValues?.admin ?? null);
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
        setFinalMsg('instantiateSmartContract', {
          message: JSON.parse(message),
          codeId: codeId,
          contractLabel: contractLabel,
          fundCount: fundCount,
          fundToken: fundToken,
          admin: admin,
          status: codeId < '0' || !contractLabel?.length ? 'error' : '',
        });
        setError('json is valid');
      }
    } catch (error) {
      setFinalMsg('instantiateSmartContract', {
        status: 'error',
      });
      setError('json is not valid');
    }
  }, [message, codeId, fundCount, contractLabel, admin, fundToken]);

  return (
    <div className="instantiate-smart-contract-action">
      <div className="headingWrap">
        <span className="text-size">
          {' '}
          <BabyEmoji />
        </span>
        <h2>Instantiate Smart Contract</h2>
      </div>
      <div className="contract-info">
        <div className="token-input code-id">
          <label>Code ID</label>
          <Input
            type={'number'}
            value={codeId}
            onChange={(e) => setCodeId(e.target.value)}
            status={codeId < '0' ? 'error' : ''}
            readOnly={initialValues ? true : false}
          />
        </div>
        <div className="token-input contract-label">
          <label>Contract Label</label>
          <Input
            value={contractLabel}
            onChange={(e) => setContractLabel(e.target.value)}
            status={contractLabel?.length > 0 ? '' : 'error'}
            readOnly={initialValues ? true : false}
          />
        </div>
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
      <div className="token-input">
        <label>Admin (optional)</label>
        <Input value={admin} onChange={(e) => setAdmin(e.target.value)} />
      </div>
    </div>
  );
};

export default InstantiateSmartContract;
