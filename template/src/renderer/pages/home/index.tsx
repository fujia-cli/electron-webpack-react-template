import { useNavigate, useLocation, Outlet } from 'react-router-dom';
// import { shell } from 'electron';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { useDocumentTitle, useMounted } from '@fujia/hooks';
import { LogoutOutlined } from '@ant-design/icons';

import { Logo, UserOperate } from './styles';
import { bootstrapUser } from './service';
import { useAppDispatch } from '@store/hooks';
import { setUserInfo } from '@store/global.slice';
import { logout } from '@pages/login-register/service';

import { useAppSelector } from '@store/hooks';
import { selectUser } from '@store/global.slice';
import { User } from '@pages/login-register/service';
import { myNotification } from '@utils/index';
import { Link } from 'react-router-dom';
// import { getAppPath } from '@utils/appPath';

const { Header, Content, Footer } = Layout;

const NAVIGATION_LIST = [
  {
    key: '/',
    label: <Link to="/">开发</Link>,
  },
  {
    key: '/tools',
    label: <Link to="/tools">工具</Link>,
  },
  {
    key: '/services',
    label: <Link to="/services">服务</Link>,
  },
  {
    key: '/apps',
    label: <Link to="/apps">应用</Link>,
  },
];

export const Home = () => {
  const curUser = useAppSelector<User | null>(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // const [appPath, setAppPath] = useState('');
  useDocumentTitle('<%= packageName %> | All From Love');

  useMounted(() => {
    if (curUser) return;

    bootstrapUser().then((data) => {
      if (data) {
        dispatch(setUserInfo(data));
      }
    });
  });

  useMounted(() => {
    window.electron.ipcRenderer.once('ipc-example', (arg) => {
      console.log('once:', arg);
    });

    window.electron.ipcRenderer.myPing();
  });

  const handleLink = (routeName: string) => {
    return () => {
      if (routeName === 'login') {
        navigate('/login');
      } else if (routeName === 'register') {
        navigate('/register');
      }
      // else if (routeName === 'github') {
      //   shell.openExternal('https://github.com/fushenguang/marathon');
      // }
    };
  };

  const handleLogoClick = () => {};

  const handleLogout = () => {
    logout().then(() => {
      dispatch(setUserInfo(null));
      myNotification({ message: '退出成功', type: 'success' });
    });
  };

  const renderAvatarMenu = () => (
    <Menu
      style={{ width: 128 }}
      items={[
        {
          label: (
            <a onClick={handleLogout} style={{ display: 'block' }}>
              <LogoutOutlined style={{ paddingRight: 6 }} />
              退出
            </a>
          ),
          type: 'group',
        },
      ]}
    />
  );

  return (
    <Layout>
      <Header className="home-header" style={{ position: 'fixed' }}>
        <Logo onClick={handleLogoClick} />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['develop']}
          selectedKeys={[location.pathname]}
          items={NAVIGATION_LIST}
          style={{ outline: 'none' }}
        />
        {!curUser ? (
          <UserOperate>
            <span className="login" onClick={handleLink('login')}>
              登录
            </span>
            <span className="separator">/</span>
            <span className="register" onClick={handleLink('register')}>
              注册
            </span>
          </UserOperate>
        ) : (
          <Dropdown overlay={renderAvatarMenu()}>
            <Avatar size={40} src={curUser.avatar || ''} />
          </Dropdown>
        )}
      </Header>
      <Content className="home-main">
        <Outlet />
      </Content>
      <Footer className="home-footer"><%= packageName %> ©2022 Created by Fujia.site</Footer>
    </Layout>
  );
};
