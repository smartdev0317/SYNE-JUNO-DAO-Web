import { useEffect, useState } from 'react';
import './TokenPrices.scss';
import { SYNE, WYND, LOOP } from '@client/utils/constants';
import syne from '@client/assets/syne.png';
import wynd from '@client/assets/wynd.png';
import loop from '@client/assets/loop.png';
import { Img } from '@chakra-ui/react';

const TokenPrices = ({ isMobile }) => {
    const [tokenPrices, setTokenPrices] = useState([]);

    useEffect(() => {
        fetch('https://middlewareapi.loop.markets/v1/juno/tokenInfo')
        .then((res) => res.json())
        .then((data) => {
            setTokenPrices(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    }, []);

  return (
    <div className={`${isMobile ? 'token-prices mobile-version' : 'token-prices'}`}>
        <div className="token-price">
        <Img src={syne} alt="SYNE" />
        {/* <p  className='ml-2'>{`SYNE ${synePrice}`}</p> */}
        <p  className='ml-2'>{`SYNE ${"TBD"}`}</p>
        </div>
        <div className="token-price">
        <Img src={wynd} alt="WYMD" />
        {/* <p  className='ml-2'>{`WYND ${wyndPrice}`}</p> */}
        <p  className='ml-2'>{`WYND ${Number(tokenPrices && tokenPrices.find(each => each.symbol === WYND)?.unitPrice).toFixed(4)}`}</p>
        </div>
        <div className="token-price">
        <Img src={loop} alt="LOOP" />
        {/* <p  className='ml-2'>{`LOOP ${loopPrice}`}</p> */}
        <p  className='ml-2'>{`LOOP ${Number(tokenPrices && tokenPrices.find(each => each.symbol === LOOP)?.unitPrice).toFixed(4)}`}</p>
        </div>
    </div>
  );
};

export default TokenPrices;
