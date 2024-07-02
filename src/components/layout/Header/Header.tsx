import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import './Header.scss';
import WalletConnect from '@client/components/smart/WalletConnectSection/WalletConnect';
//@ts-ignore
// import logo from '@client/assets/loop_icon.svg';
import Logo from '../../LogoIcon';
//@ts-ignore
import ajeeb_icon from '@client/assets/ajeeb_icon.png';
import syne from '@client/assets/syne.png';
import wynd from '@client/assets/wynd.png';
import loop from '@client/assets/loop.png';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Img } from '@chakra-ui/react';
import TokenPrices from './TokenPrices';

const SidebarRoutes = [
  {
    path: '/gauges',
    name: 'Gauges',
    Icon: HomeOutlined,
  },
];

const Header = ({ collapsed, toggle }) => {
  const generateLinks = () => {
    const links = SidebarRoutes.map((route) => {
      const { Icon } = route;
      return (
        <Menu.Item
          key={`${route.path}`}
          icon={<Icon style={{ fontSize: '19px' }} />}
        >
          <Link to={`${route.path}`}>{route.name}</Link>
        </Menu.Item>
      );
    });
    return links;
  };
  return (
    <>
      <div className='header p-6'>
        <div className="topSectionWrap">
          <Link to={'/'}>
            <div className="logo">
              {/* <Avatar src={logo} /> */}
              <Logo />
              <h1>Synergistic</h1>
            </div>
          </Link>
        </div>
        <TokenPrices isMobile={false} />
        <WalletConnect collapsed={collapsed} />
      </div>
      <TokenPrices isMobile={true} />
    </>
  );
};

export default Header;
