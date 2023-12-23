import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { ReactObserver } from '@/shared/lib/observavle/ReactObservable';
import { UserService } from '@/entities/User/model/User';
import { useState } from 'react';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
const {Text} = Typography
interface FormValue{
  username: string
  password: string
}
interface FormValue{
  username: string
  password: string
}
export const Login: React.FC<{userService: UserService}> = ReactObserver(({userService}) => {
  const [formError, setFormError] = useState<Error | undefined>(undefined)
  const {toggleQuery, error} = useQuery(userService.Login.bind(userService))

  const onFinish = async(values: FormValue & {confirmPassword: string}) => {
    setFormError(undefined)
    try{
      toggleQuery && toggleQuery(values.username, values.password)
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
      {formError && <Text type='danger'>{formError.message}</Text>}
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
      {error && <Text type='danger'>{error.message}</Text>}
      <Form.Item>
        <Button type="primary" htmlType="submit" >
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
})

