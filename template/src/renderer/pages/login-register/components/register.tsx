import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router';
import { useAsync } from '@fujia/hooks';

import { register } from '../service';

const Item = Form.Item;

export const Register = () => {
  const navigate = useNavigate();
  const { isLoading, run } = useAsync();

  const handleFormFinish = (values: any) => {
    run(
      register(values)
        .then(() => {
          message.success('注册成功');

          navigate('/');
        })
        .catch((err) => {
          console.log(err);
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
            message: '注册账号不能为空',
          },
        ]}
      >
        <Input type="text" placeholder="注册邮箱" />
      </Item>
      <Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入注册密码',
          },
        ]}
      >
        <Input type="password" placeholder="注册密码，由8~20位字符组成" />
      </Item>
      <Button block loading={isLoading} type="primary" htmlType="submit" style={{ marginTop: 8 }}>
        立即注册
      </Button>
    </Form>
  );
};
