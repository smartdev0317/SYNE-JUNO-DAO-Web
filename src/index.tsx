import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from '@client/App';
import { BrowserRouter } from 'react-router-dom';
import Boundary from './components/presentational/Boundary/Boundary';
import { queryClient } from './services/queryClient';
import { GasPrice } from '@cosmjs/stargate';
import { QueryClientProvider } from 'react-query';
import { chains, assets } from 'chain-registry';
import { wallets as keplrWallet } from '@cosmos-kit/keplr';
import { wallets as leapwallets } from '@cosmos-kit/leap';
import { ChainProvider, defaultTheme } from '@cosmos-kit/react';
import { ChakraProvider } from '@chakra-ui/react';
import { nativeDenom } from './utils/constants';
import './index.scss';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <BrowserRouter>
    <Boundary>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={defaultTheme}>
            <ChainProvider
              chains={chains}
              assetLists={assets}
              wallets={[...keplrWallet, ...leapwallets]}
              walletConnectOptions={{signClient:{projectId:"d9a975912124eee658b019dbb4bfd615"}}}
              signerOptions={{
                signingCosmwasm(chain) {
                  switch (chain.chain_name) {
                    case 'juno':
                      return {
                        gasPrice: GasPrice.fromString('0.0025' + nativeDenom),
                      };
                    default:
                      return void 0;
                  }
                },
              }}
              sessionOptions={{
                duration: 604800000,
              }}
            >
              <App />
            </ChainProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </Boundary>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
