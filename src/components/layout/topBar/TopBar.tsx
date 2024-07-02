import { Layout } from 'antd';
import './TopBar.scss';
import { MenuFoldOutlined } from '@ant-design/icons';
const { Header } = Layout;
interface TopBarProps {
  toggle: () => void;
  collapsed: boolean;
}
const TopBar = ({ toggle, collapsed }: TopBarProps) => {
  return (
    <Header className="site-layout-background">
      <div className="toggleWrapper" onClick={toggle}>
        {collapsed && (
          <MenuFoldOutlined
            className="trigger"
            style={{ marginLeft: '5px', color: '#fff' }}
          />
        )}
      </div>
    </Header>
  );
};

export default TopBar;
