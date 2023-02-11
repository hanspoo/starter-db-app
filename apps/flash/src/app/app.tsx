import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';

import {
  LoginState,
  LoginSection,
} from '@flash-ws/components';
import { useSelector } from 'react-redux';
import { RootState } from '@flash-ws/reductor';


const { Header, Sider, Content } = Layout;

enum Modo {

  HOME = 'HOME',
  ABOUT = 'ABOUT',

}

const App = () => {
  const loggedIn = useSelector((state: RootState) => state.counter.loggedIn);
  const [modo, setModo] = useState(Modo.HOME);
  const [collapsed, setCollapsed] = useState(false);


  if (!loggedIn) return <LoginSection />;

  function onChangeMenu(args: any) {
    setModo(args.key);
  }

  return (
    <Layout id="container" role="container">
      <LoginState />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />

        <Menu
          onClick={onChangeMenu}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[Modo.HOME + '']}
          items={[
            {
              key: Modo.HOME,
              icon: <UserOutlined />,
              label: 'Home',
            },
            {
              key: Modo.ABOUT,
              icon: <UploadOutlined />,
              label: 'About',
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: 280,
          }}
        >
          {modo === Modo.HOME && <Home />}
          {modo === Modo.ABOUT && <About />}

        </Content>
      </Layout>
    </Layout>
  );
};

export default App;

function Home() {
  return <div>Home</div>;
}
function About() {
  return <div>About</div>;
}
