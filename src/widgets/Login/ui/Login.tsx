import React, { memo } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { LoginRequest, LoginResponse } from '@/entities/User/api/types/Login';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
import { Store } from '@/app/providers/Store';
import { MeResponse } from '@/entities/User/api/types/Me';
interface LoginProps{
  getMe: ()=>Promise<MeResponse>
  login: (json: LoginRequest) => Promise<LoginResponse>
  store: Store
}

interface FormValue{
  username: string
  password: string
}
export const Login: React.FC<LoginProps> = memo(({login, store, getMe}) => {
  const {toggleQuery, isPending} = useQuery(login)
  const {toggleQuery: tQ, isPending: iP} = useQuery(getMe)
  const onFinish = async(values: FormValue) => {
    if(toggleQuery && tQ){
      const loginRes = await toggleQuery(values)
      const user = await tQ()
    }
  };

  return (
    <Form
      name="normal_login"
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
})

