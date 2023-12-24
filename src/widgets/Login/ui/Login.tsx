import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { ReactObserver } from '@/shared/lib/observavle/ReactObservable';
import { UserService } from '@/entities/User/model/User';
import { useState } from 'react';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
import { useTranslation } from 'react-i18next';
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
  const {t} = useTranslation()
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
        rules={[{ required: true, message: t('Пожалуйста введите ваш ник') }]}
      >
        <Input prefix={<UserOutlined />} placeholder={t('Введите ник')}/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: t('Пожалуйста введите ваш пароль') }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('Введите пароль')}
        />
      </Form.Item>
      {error && <Text type='danger'>{error.message}</Text>}
      <Form.Item>
        <Button type="primary" htmlType="submit" >
          {t('Войти')}
        </Button>
      </Form.Item>
    </Form>
  );
})

