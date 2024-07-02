import React, { useEffect, useState } from 'react';
import { getSelectedAction } from '../CreateProposal/getActionHelper';
import { getAllSelectedActions } from './actionDetailHelper';
import './ActionDetails.scss';

const ActionDetails = ({ details }) => {
  const [selectedActions, setSelectedActions] = useState([]);

  useEffect(() => {
    const msgs = details?.proposal?.msgs;
    const getAction = getAllSelectedActions(msgs);
    setSelectedActions(getAction);
  }, [details]);
  return (
    <div className="selectedaActionsWrapper">
      <h1 className="action-heading"> Actions</h1>
      {selectedActions.length ? (
        selectedActions.map((item) => {
          return (
            <div className="action-item-wrapper">
              <div className="action-item">{item.Component}</div>
            </div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default ActionDetails;
