import { useTokenBalance } from '@client/hooks/useTokenBalance';
import { walletState } from '@client/services/state/walletAtoms';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useChain } from '@cosmos-kit/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faLink, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';
import { chainName } from '@client/App';
import { nativeDenom } from '@client/utils/constants';
import './WalletConnect.scss';
import CopyToClip from '@client/components/presentational/CopyToClip/CopyToClip';
import { truncateTitle, truncateWalletName } from '@client/libs/parse';

const WalletConnect = ({ collapsed }: { collapsed?: boolean }) => {
  const { disconnect, connect, address, status, username } = useChain(chainName);
  const [showIcons, setShowIcons] = useState(false);
  const { balance, refetch } = useTokenBalance(nativeDenom);
  const setWalletState = useSetRecoilState(walletState);
  async function resetWalletConnection() {
    await disconnect();
    setWalletState({
      status: status,
      address: '',
      key: null,
      client: null,
    });
  }
  useEffect(() => {
    address && !balance && refetch();
  }, [address]);

  return (
    <div
      className="connect-wallet-wrapper p-relative"
      onMouseEnter={() => setShowIcons(address ? true : false)}
      onMouseLeave={() => setShowIcons(address ? false : false)}
    >
      {collapsed ? (
        <FontAwesomeIcon icon={faWallet} className="wallet-icon" />
      ) : (
        <div
          className={address ? 'd-flex' : 'd-flex btn-wrapper'}
          onClick={() => connect()}
        >
          <FontAwesomeIcon
            icon={faWallet}
            className={address ? 'wallet-icon' : 'wallet-icon-black'}
          />
          <div className="add-wrapper">
            <div className="label">{!address && 'Connect'}</div>
            {username && (
              <span className="acc-name">{truncateWalletName(username)}</span>
            )}
            {address && <span className="balance">{balance} JUNO </span>}
          </div>
        </div>
      )}
      {showIcons ? (
        <div className="p-absolute">
          <CopyToClip value={address}>
            <Tooltip title={'Copy Wallet Address'} placement="bottomLeft">
              <span>
                <FontAwesomeIcon icon={faLink} className="copy_icon" />
              </span>
            </Tooltip>
          </CopyToClip>
          <Tooltip title={'Disconnect'} placement="bottomLeft">
            <span onClick={() => resetWalletConnection()}>
              <FontAwesomeIcon icon={faSignOut} className="logout_icon" />
            </span>
          </Tooltip>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WalletConnect;
