import { CodeMirrorInput } from '@client/components/smart/CodeMirrorInput/CodeMirrorInput';
import { WhaleEmoji } from '@client/utils/emoji';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import './MigrateSmartContract.scss';

const MigrateSmartContract = ({
  setFinalMsg,
  initialValues,
}: {
  setFinalMsg?: any;
  initialValues?: any;
}) => {
  const [codeId, setCodeId] = useState(initialValues?.new_code_id ?? '0');
  const [contractAddress, setContractAddress] = useState(
    initialValues?.contract_addr ?? '',
  );
  const [error, setError] = useState('');
  const [message, setMessage] = useState(
    initialValues?.msg
      ? Buffer.from(initialValues?.msg, 'base64')?.toString('ascii')
      : '{}',
  );
  useEffect(() => {
    try {
      if (setFinalMsg) {
        JSON.parse(message);
        setFinalMsg('migrateSmartContract', {
          message: JSON.parse(message),
          codeId: codeId,
          contractAddress: contractAddress,
          status:
            contractAddress?.length != 63 || !contractAddress.startsWith('juno')
              ? 'error'
              : '',
        });
        setError('json is valid');
      }
    } catch (error) {
      setFinalMsg('migrateSmartContract', {
        status: 'error',
      });
      setError('json is not valid');
    }
  }, [message, codeId, contractAddress]);

  return (
    <div className="migrate-smart-contract-action">
      <div className="headingWrap">
        <span className="text-size">
          {' '}
          <WhaleEmoji />
        </span>
        <h2>Migrate Smart Contract</h2>
      </div>
      <div className="contract-info">
        <div className="token-input contract-label">
          <label>Contract Address</label>
          <Input
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            status={
              contractAddress?.length > 0
                ? contractAddress?.length != 63 ||
                  !contractAddress.startsWith('juno')
                  ? 'error'
                  : ''
                : ''
            }
            readOnly={initialValues ? true : false}
          />
        </div>
        <div className="token-input code-id">
          <label>Code ID</label>
          <Input
            type={'number'}
            value={codeId}
            onChange={(e) => setCodeId(e.target.value)}
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
    </div>
  );
};

export default MigrateSmartContract;
