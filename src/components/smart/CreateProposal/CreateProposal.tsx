import { Input } from 'antd';
import { useEffect, useState } from 'react';
import ActionModal from '../ActionModal/ActionModal';
import { CloseOutlined } from '@ant-design/icons';
import useNewContractMsg from '@client/hooks/useNewContractMsg';
import { StdFee } from '@cosmjs/stargate';
import { unsafelyGetDefaultExecuteFee } from '@client/utils/fees';
import {
  DEFAULT_FEE_NUM,
  PROPOSAL_CONTRACT_ADDRESS,
} from '@client/utils/constants';
import { faChevronLeft, faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useChain } from '@cosmos-kit/react';
import { getActionMessages, getProposalId } from './msgHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSetRecoilState } from 'recoil';
import { priceKeyIndexState } from '@client/queries/app';
import { getAction, verifyActions } from './getActionHelper';
import ProposalInfoSection from '@client/components/presentational/ProposalInfoSection/ProposalInfoSection';
import OpenToast from '@client/components/presentational/Toaster/Toast';
import Spin from '@client/components/presentational/Spin/Spin';
import { useQueryProposalConfig } from '@client/queries/proposalInfo';
import { useNavigate } from 'react-router';
import { getAllSelectedActions } from '../ActionDetails/actionDetailHelper';
import './CreateProposal.scss';
import { chainName } from '@client/App';
import PublishButton, {
  ProposalError,
} from '@client/components/presentational/PublishProposalBtn/PublishButton';
import TextFormatter from '@client/components/presentational/TextFormatter';
import { EditorState } from 'draft-js';

const CreateProposal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actions, setActions] = useState([]);
  const newContractMsg = useNewContractMsg();
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee();
  const { getSigningCosmWasmClient, address } = useChain(chainName);
  const [loading, setLoading] = useState(false);
  const serPriceKeyIndexStateState = useSetRecoilState(priceKeyIndexState);
  const [transactionStatus, setTransactionStatus] = useState({});
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const navigate = useNavigate();
  const prefillValues = window.location.search
    ? JSON.parse(
        decodeURIComponent(
          window.location.search.substring(
            window.location.search.indexOf('=') + 1,
          ),
        ),
      )
    : null;
  const [finalMsg, setFinalMsg] = useState({
    title: prefillValues?.proposal?.title ? prefillValues.proposal.title : '',
    description: prefillValues?.proposal?.title
      ? prefillValues.proposal.description
      : '',
    tokenBalanceAction: {
      tokenAddress: '',
      status: '',
    },
    smartContract: {
      message: '',
      address: '',
      fundCount: '0',
      fundToken: '',
      status: '',
    },
    instantiateSmartContract: {
      message: '',
      codeId: '0',
      contractLabel: '',
      fundCount: 0,
      fundToken: '',
      admin: null,
      status: '',
    },
    migrateSmartContract: {
      message: '',
      codeId: '0',
      contractAddress: '',
      status: '',
    },
    spendTokens: {
      treasuryAddress: '',
      fundCount: 0,
      fundToken: '',
      status: '',
    },
  });

  const appendFinalMsg = (key: string, value: any) =>
    setFinalMsg({ ...finalMsg, [key]: value });

  const reset = () => {
    setFinalMsg({
      title: '',
      description: '',
      tokenBalanceAction: {
        tokenAddress: '',
        status: '',
      },
      smartContract: {
        message: '',
        address: '',
        fundCount: '0',
        fundToken: '',
        status: '',
      },
      instantiateSmartContract: {
        message: '',
        codeId: '0',
        contractLabel: '',
        fundCount: 0,
        fundToken: '',
        admin: null,
        status: '',
      },
      migrateSmartContract: {
        message: '',
        codeId: '0',
        contractAddress: '',
        status: '',
      },
      spendTokens: {
        treasuryAddress: '',
        fundCount: 0,
        fundToken: '',
        status: '',
      },
    });
    setSelectedAction(null);
    setActions([]);
  };

  useEffect(() => {
    if (prefillValues && !actions.length) {
      setActions((prev) => [
        ...prev,
        ...getAllSelectedActions(prefillValues?.proposal?.msgs, appendFinalMsg),
      ]);
    }
    if (selectedAction && !actions.find((item) => item.key == selectedAction)) {
      setActions((prev) => [
        ...prev,
        getAction(selectedAction, appendFinalMsg),
      ]);
    }
  }, [selectedAction]);

  const removeItem = (value) => {
    const tempArray = actions.filter((item) => item.key != value);
    setActions([...tempArray]);
    setSelectedAction(null);
    appendFinalMsg(value, {});
  };

  const responseFunc = (result: any) => {
    const txLogs = JSON.parse(result?.rawLog);
    const proposalId = getProposalId(txLogs);
    serPriceKeyIndexStateState((n) => n + 1);
    setTransactionStatus({
      result: result,
      error: null,
      transactionStatus: null,
    });
    proposalId ? navigate(`/details/${proposalId}`) : '';
  };

  const submit = async () => {
    try {
      setTransactionStatus({
        transactionStatus: 'started',
      });
      setLoading(true);
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error('stargateClient undefined or address undefined.');
        return;
      }
      const fee: StdFee = {
        amount: defaultExecuteFee.amount,
        gas: (Number(defaultExecuteFee.gas) * DEFAULT_FEE_NUM).toString(),
      };
      let result: any;
      if (typeof window['obiSignAndBroadcast'] === 'function') {
        result = await window['obiSignAndBroadcast'](
          PROPOSAL_CONTRACT_ADDRESS,
          [
            ...getActionMessages(
              newContractMsg,
              finalMsg,
              daoInfo?.max_voting_period?.time,
            ),
          ],
        );
        responseFunc(result);
      } else {
        result = await cosmwasmClient.signAndBroadcast(
          address,
          [
            ...getActionMessages(
              newContractMsg,
              finalMsg,
              daoInfo?.max_voting_period?.time,
            ),
          ],
          // 'auto',
          fee,
        );
        responseFunc(result);
      }
    } catch (error) {
      console.log('error', error);
      setTransactionStatus({
        result: null,
        error: error,
        transactionStatus: null,
      });
    } finally {
      setLoading(false);
    }
  };

	const goBack = () => {
		navigate(-1);
	}

  return (
    <>
      <ActionModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        setSelectedAction={setSelectedAction}
      />
      <OpenToast
        transactionStatusData={transactionStatus}
        resetFunction={reset}
      />
      <div className='create-wrapper'>
        <div 
          className='back-btn'
          onClick={goBack}
        >
          <span>
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="main_icons"
            />
          </span>
          Back
        </div>
        <div className="wrapper">
          <div className="createForm">
            <div className="heading">
              <h2>
                Single Choice Proposal
                <FontAwesomeIcon icon={faInfoCircle} className="info_icon" />
              </h2>
            </div>
            <div className="inputField">
              <label>Proposal title</label>
              <Input
                value={finalMsg.title}
                onChange={(e) =>
                  setFinalMsg({ ...finalMsg, title: e.target.value })
                }
              />
            </div>
            <div className="inputField">
              <label>Proposal description</label>
              {/* <TextFormatter
                editorState={editorState}
                setEditorState={setEditorState}
                setContent={appendFinalMsg}
                htmlText={
                  // finalMsg.description?.length
                  //   ? JSON.parse(finalMsg.description)
                  //   : 
                    ''
                }
              /> */}
              <Input.TextArea
                value={finalMsg.description}
                onChange={(e) => appendFinalMsg('description', e.target.value)}
                rows={4}
              />
            </div>
            <div className="actionsWrapper">
              {actions.length ? (
                actions.map((item) => {
                  return (
                    <div className="action-item-wrapper">
                      <div className="action-item">{item.Component}</div>
                      <span
                        className="closeIcon"
                        onClick={() => removeItem(item.key)}
                      >
                        <CloseOutlined
                          style={{
                            color: '#fff',
                          }}
                        />
                      </span>
                    </div>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            <div className="actions-btn-addresses">
              <div onClick={() => setIsModalOpen(true)} className="action-btn">
                <span>
                  <FontAwesomeIcon icon={faPlus} className="plus_icon" />
                  Add an action
                </span>
              </div>
              <PublishButton
                finalMsg={finalMsg}
                isLoading={loading}
                submitFun={submit}
              />
            </div>
            <ProposalError />
          </div>
          <ProposalInfoSection />
        </div>
      </div>
    </>
  );
};

export default CreateProposal;
