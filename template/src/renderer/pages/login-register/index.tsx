import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';

import { Container } from './styles';
import { Login } from './components/login';
import { Register } from './components/register';

export const LoginAndRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleBack = () => {
    navigate(-1);
  };

  const isRegister = location.pathname === '/register';

  const handleTogglePanel = () => {
    if (isRegister) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <Container>
      <ArrowLeftOutlined
        onClick={handleBack}
        title="返回"
        style={{ position: 'absolute', top: 24, left: 24, fontSize: 18 }}
      />
      <Card style={{ width: 360, margin: '0 auto', boxShadow: '4px 4px 8px #ccc' }}>
        {isRegister ? <Register /> : <Login />}
        <Button block type="link" onClick={handleTogglePanel} style={{ marginTop: 4, fontSize: '1.2rem' }}>
          {isRegister ? '已有账号，去登录' : '没有账号，去注册'}
        </Button>
      </Card>
    </Container>
  );
};
