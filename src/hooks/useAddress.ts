import { walletState } from '@client/services/state/walletAtoms';
import { useRecoilValue } from 'recoil';

const useAddress = () => {
  const { address } = useRecoilValue(walletState);
  return address;
};

export default useAddress;
