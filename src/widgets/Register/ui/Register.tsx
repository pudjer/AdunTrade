import React, { memo, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { UserService } from '@/entities/User/model/User';
const {Text} = Typography
interface FormValue{
  username: string
  password: string
}
export const Register: React.FC<{userService: UserService}> = memo(({userService}) => {
  const [confirm, setConfirm] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formError, setFormError] = useState<Error | undefined>(undefined)

  const onFinish = async(values: FormValue & {confirmPassword: string}) => {
    setFormError(undefined)
    if(password!==confirm){
      setFormError(new Error('passwords not same'))
      return
    }
    try{
      userService.Register(values.username, values.password)
    }catch(e){
      if(e instanceof Error){
        setFormError(e)
      }
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
      {formError && <Text type='danger'>{formError.message}</Text>}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
})

