import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.scss';
import Header from './Header/Header';
import TopBar from './topBar/TopBar';

const DashBoardLayout = () => {
  const [collapsed, setCollapsed] = useState(
    // window.innerWidth < 921 ? true : false,
    false
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  const toggle = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="DashBoardLayout">
      <Header collapsed={collapsed} toggle={toggle} />
      <div
        className="site-layout">
        {window.innerWidth < 921 ? (
          <TopBar toggle={toggle} collapsed={collapsed} />
        ) : (
          <></>
        )}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashBoardLayout;
