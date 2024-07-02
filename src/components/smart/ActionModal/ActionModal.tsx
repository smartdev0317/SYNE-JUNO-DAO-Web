import React, { useState } from 'react';
import { Button, Modal, Input } from 'antd';
import './ActionModal.scss';
import { SearchOutlined } from '@ant-design/icons';
import {
  MoneyEmoji,
  DepositEmoji,
  TokenEmoji,
  SwordsEmoji,
  BabyEmoji,
  WhaleEmoji,
  XEmoji,
} from '@client/utils/emoji';

const emojis = {
  tokenBalanceAction: TokenEmoji,
  transfer: MoneyEmoji,
  // DepositEmoji: DepositEmoji,
  smartContract: SwordsEmoji,
  instantiateSmartContract: BabyEmoji,
  migrateSmartContract: WhaleEmoji,
  // XEmoji: XEmoji,
};

const allActions = [
  // {
  //   title: 'Display Token Balance in Treasury',
  //   description:
  //     "Display the DAO's balance of a CW20 token in the treasury view.",
  //   type: 'tokenBalanceAction',
  // },
  {
    title: 'Execute Smart Contract',
    description: 'Execute a message on a smart contract.',
    type: 'smartContract',
  },
  {
    title: 'Instantiate Smart Contract',
    description: 'Instantiate a smart contract.',
    type: 'instantiateSmartContract',
  },
  {
    title: 'Migrate Smart Contract',
    description: 'InsMigrate a CosmWasm contract to a new code ID.',
    type: 'migrateSmartContract',
  },
  // {
  //   title: 'Remove Token Balance from Treasury',
  //   description:
  //     "Stop displaying the DAO's balance of a CW20 token in the treasury view.",
  //   type: 'XEmoji',
  // },
  {
    title: 'Spend',
    description: 'Spend native or cw20 tokens from the treasury.',
    type: 'transfer',
  },
  // {
  //   title: 'Stake',
  //   description: 'Manage native token staking.',
  //   type: 'DepositEmoji',
  // },
];

const ProposalAction = ({ type, title, desctiption }) => {
  const SelectedEmoji = emojis[type];
  return (
    <div className="proposalAction">
      <span className="emoji">
        <SelectedEmoji />
      </span>
      <div className="text">
        <span className="primary-text">{title}</span>
        <span className="secondary-text">{desctiption}</span>
      </div>
    </div>
  );
};

const ActionModal = ({ visible, setVisible, setSelectedAction }) => {
  const [searchedValue, setSearchedValue] = useState('');
  const handleOk = () => {
    setVisible(false);
    setSearchedValue('');
    setSelectedAction(null);
  };

  const handleCancel = () => {
    setVisible(false);
    setSearchedValue('');
    setSelectedAction(null);
  };

  const filterActions = (data) => {
    if (
      data?.title?.toLowerCase()?.includes(searchedValue?.toLowerCase()) ||
      data?.description_long
        ?.toLowerCase()
        ?.includes(searchedValue?.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={<></>}
      style={{ top: 20 }}
      className="actionModal"
    >
      <Input
        placeholder="Proposal actions"
        prefix={<SearchOutlined className="site-form-item-icon" />}
        style={{ width: '100%' }}
        className="searchInput"
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
      />
      {allActions.filter(filterActions).map((item) => {
        return (
          <div
            onClick={() => {
              handleOk();
              setSelectedAction(item.type);
            }}
            key={item.type}
          >
            <ProposalAction
              type={item.type}
              title={item.title}
              desctiption={item.description}
            />
          </div>
        );
      })}
    </Modal>
  );
};

export default ActionModal;
