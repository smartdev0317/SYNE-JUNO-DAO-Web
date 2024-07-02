import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin as Spinner } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Spin: React.FC = () => <Spinner indicator={antIcon} />;

export default Spin;