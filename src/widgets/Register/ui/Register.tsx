import React, { memo, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
import { Store } from '@/app/providers/Store';
import { MeResponse } from '@/entities/User/api/types/Me';
import { UserFactory } from '@/entities/User/lib/UserFactory';
import { RegisterRequest, RegisterResponse } from '@/entities/User/api/types/Register';
interface RegisterProps{
  getMe: ()=>Promise<MeResponse>
  register: (json: RegisterRequest) => Promise<RegisterResponse>
  store: Store
}

interface FormValue{
  username: string
  password: string
}
export const Register: React.FC<RegisterProps> = memo(({register, store, getMe}) => {
  const [confirm, setConfirm] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formError, setFormError] = useState<string>('')
  const {toggleQuery} = useQuery(register)
  const {toggleQuery: tQ} = useQuery(getMe)
  const onFinish = async(values: FormValue & {confirmPassword: string}) => {
    if(password!==confirm){
      setFormError('passwords not same')
      return
    }
    if(toggleQuery && tQ){
      const loginRes = await toggleQuery(values)
      const user = await tQ()
      store.user = UserFactory(user)
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
        <Input.Password onChange={e=>setPassword(e.target.value)} value={password} prefix={<LockOutlined/>} placeholder="input password" />
      </Form.Item>
       <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: 'Please confirm your Password!' }]}
      >
        <Input.Password onChange={e=>setConfirm(e.target.value)} value={confirm} prefix={<LockOutlined/>} placeholder="confirm password" />
      </Form.Item>
      <div>{formError}</div>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
})

