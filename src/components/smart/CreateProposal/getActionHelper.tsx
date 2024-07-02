import ExecuteSmartContract from '@client/components/presentational/ExecuteSmartContract/ExecuteSmartContract';
import InstantiateSmartContract from '@client/components/presentational/InstantiateSmartContract/InstantiateSmartContract';
import MigrateSmartContract from '@client/components/presentational/MigrateSmartContract/MigrateSmartContract';
import SpendTokens from '@client/components/presentational/SpendToken/SpendToken';
import TokenBalanceAction from '@client/components/presentational/TokenBalanceAction/TokenBalanceAction';

export const getAction = (selectedAction, appendFinalMsg) => {
  switch (selectedAction) {
    case 'tokenBalanceAction':
      return {
        key: 'tokenBalanceAction',
        Component: <TokenBalanceAction setFinalMsg={appendFinalMsg} />,
      };
    case 'smartContract':
      return {
        key: 'smartContract',
        Component: <ExecuteSmartContract setFinalMsg={appendFinalMsg} />,
      };
    case 'instantiateSmartContract':
      return {
        key: 'instantiateSmartContract',
        Component: <InstantiateSmartContract setFinalMsg={appendFinalMsg} />,
      };
    case 'migrateSmartContract':
      return {
        key: 'migrateSmartContract',
        Component: <MigrateSmartContract setFinalMsg={appendFinalMsg} />,
      };
    case 'transfer':
      return {
        key: 'transfer',
        Component: <SpendTokens setFinalMsg={appendFinalMsg} />,
      };
  }
};

export const getSelectedAction = (
  selectedActionKey: any,
  initialValues: any,
  contract_addr: any,
  appendFinalMsg?: any,
) => {
  switch (selectedActionKey) {
    case 'balance':
      return {
        key: 'tokenBalanceAction',
        Component: (
          <TokenBalanceAction
            initialValues={initialValues}
            contractAddress={contract_addr}
            setFinalMsg={appendFinalMsg ? appendFinalMsg : null}
          />
        ),
      };
    case 'execute':
      return {
        key: 'smartContract',
        Component: (
          <ExecuteSmartContract
            initialValues={initialValues}
            setFinalMsg={appendFinalMsg ? appendFinalMsg : null}
          />
        ),
      };
    case 'instantiate':
      return {
        key: 'instantiateSmartContract',
        Component: (
          <InstantiateSmartContract
            initialValues={initialValues}
            setFinalMsg={appendFinalMsg ? appendFinalMsg : null}
          />
        ),
      };
    case 'migrate':
      return {
        key: 'migrateSmartContract',
        Component: (
          <MigrateSmartContract
            initialValues={initialValues}
            setFinalMsg={appendFinalMsg ? appendFinalMsg : null}
          />
        ),
      };
    case 'transfer':
      return {
        key: 'transfer',
        Component: (
          <SpendTokens
            initialValues={initialValues}
            contractAddress={contract_addr}
            setFinalMsg={appendFinalMsg ? appendFinalMsg : null}
          />
        ),
      };
  }
};

export const verifyActions = (actions) => {
  const allActionKeys = Object.keys(actions);
  let isOk = true;
  for (let i = 0; i < allActionKeys.length; i++) {
    if (
      actions[allActionKeys[i]].status &&
      actions[allActionKeys[i]].status == 'error'
    ) {
      isOk = false;
    }
  }
  return isOk;
};
