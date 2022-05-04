import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router';
import { useAsync } from '@fujia/hooks';

import { login } from '../service';

const Item = Form.Item;

export const Login = () => {
  const navigate = useNavigate();
  const { isLoading, run } = useAsync();

  const handleFormFinish = (values: any) => {
    run(
      login(values)
        .then(() => {
          message.success('登录成功');

          navigate('/');
        })
        .catch((err) => {
          message.error(err?.msg);
        })
    );
  };

  const handleFormFailed = (errInfo: any) => {
    console.log(errInfo);
  };

  return (
    <Form layout="vertical" onFinish={handleFormFinish} onFinishFailed={handleFormFailed}>
      <Item
        label="账号"
        name="username"
        rules={[
          {
            required: true,
            message: '用户名',
          },
        ]}
      >
        <Input type="text" placeholder="登录用户名" />
      </Item>
      <Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入登录密码',
          },
        ]}
      >
        <Input type="password" placeholder="登录密码，由8~20位字符组成" />
      </Item>
      <Button loading={isLoading} block type="primary" htmlType="submit" style={{ marginTop: 8 }}>
        立即登录
      </Button>
    </Form>
  );
};
