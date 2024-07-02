import { getSelectedAction } from '../CreateProposal/getActionHelper';

export const getAllSelectedActions = (msgs: any[], appendFinalMsg?: any) => {
  let allSelectedAction: any = [];
  for (let i = 0; i < msgs?.length; i++) {
    if (msgs[i].wasm) {
      const objKeys = Object.keys(msgs[i].wasm);
      if (
        Object.keys(
          JSON.parse(
            Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString(
              'ascii',
            ),
          ),
        )[0] == 'balance'
      ) {
        const key = Object.keys(
          JSON.parse(
            Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString(
              'ascii',
            ),
          ),
        );
        const value = JSON.parse(
          Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString('ascii'),
        );
        const action = getSelectedAction(
          key[0],
          value[key[0]],
          msgs[i].wasm[objKeys[0]].contract_addr,
          appendFinalMsg,
        );
        allSelectedAction.push(action);
      }
      if (
        Object.keys(
          JSON.parse(
            Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString(
              'ascii',
            ),
          ),
        )[0] != 'balance'
      ) {
        if (
          Object.keys(
            JSON.parse(
              Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString(
                'ascii',
              ),
            ),
          )[0] == 'transfer'
        ) {
          const transfer_object = JSON.parse(
            Buffer.from(msgs[i].wasm[objKeys[0]].msg, 'base64').toString(
              'ascii',
            ),
          );
          const initialValues = {
            recipient: transfer_object.transfer.recipient,
            amount: transfer_object.transfer.amount,
            token: msgs[i].wasm[objKeys[0]].contract_addr,
          };
          const action = getSelectedAction(
            'transfer',
            initialValues,
            initialValues.token,
            appendFinalMsg,
          );
          allSelectedAction.push(action);
        } else {
          const action = getSelectedAction(
            Object.keys(msgs[i].wasm)[0],
            msgs[i].wasm[objKeys[0]],
            '',
            appendFinalMsg,
          );
          allSelectedAction.push(action);
        }
      }
    }
    if (msgs[i].bank) {
      const initialValues = {
        recipient: msgs[i].bank.send.to_address,
        amount: msgs[i].bank.send.amount[0].amount,
        token: msgs[i].bank.send.amount[0].denom,
      };
      const action = getSelectedAction(
        'transfer',
        initialValues,
        initialValues.token,
        appendFinalMsg,
      );
      allSelectedAction.push(action);
    }
  }
  return allSelectedAction;
};
