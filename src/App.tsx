import { useEffect, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import '@client/App.scss';
import 'antd/dist/reset.css';
import { ToastContainer } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import 'react-toastify/dist/ReactToastify.css';
import { walletState } from './services/state/walletAtoms';
import Overview from './components/smart/Overview/Overview';
import { useChain } from '@cosmos-kit/react';
import CreateProposal from './components/smart/CreateProposal/CreateProposal';
import ProposalDetails from './components/smart/ProposalDetails/ProposalDetails';
import Gauges from './components/smart/Gauges/Gauges';
import CHAIN from '../chain_info.json';

const DashBoardLayout = lazy(
  async () =>
    import(
      /* webpackChunkName: "DashBoardLayout" */ '@client/components/layout/Layout'
    ),
);
export const chainName = CHAIN['chainId'] == "juno-1" ? "juno" : "junotestnet";
export const chainId = CHAIN['chainId'];

function App() {
  const setWalletState = useSetRecoilState(walletState);
  const { status, getCosmWasmClient, address } = useChain(chainName);
  useEffect(() => {
    const setWalletStateFunc = async () => {
      status &&
        address &&
        setWalletState({
          status: status,
          address: address,
          client: await getCosmWasmClient(),
        });
    };
    setWalletStateFunc();
  }, [status, address]);

  return (
    <>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<DashBoardLayout />}>
            <Route index element={<Overview />} />
            <Route path="/details/:id" element={<ProposalDetails />} />
            <Route path="/create" element={<CreateProposal />} />
            <Route path="/gauges" element={<Gauges />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
