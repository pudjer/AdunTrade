import React, { memo, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
import { UserService } from '@/entities/User/model/User';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
import { useTranslation } from 'react-i18next';
const {Text} = Typography
interface FormValue{
  username: string
  password: string
}
export const Register: React.FC<{userService: UserService}> = memo(({userService}) => {
  const [confirm, setConfirm] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [formError, setFormError] = useState<Error | undefined>(undefined)
  const {toggleQuery, error} = useQuery(userService.Register.bind(userService))
  const {t} = useTranslation()
  const onFinish = async(values: FormValue & {confirmPassword: string}) => {
    setFormError(undefined)
    if(password!==confirm){
      setFormError(new Error('passwords not same'))
      return
    }
    try{
      toggleQuery && toggleQuery(values. username, values.password)
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
        rules={[{ required: true, message: t('Пожалуйста введите ваш ник') }]}
      >
        <Input prefix={<UserOutlined />} placeholder={t('Введите ник')}/>
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: t('Пожалуйста введите ваш пароль') }]}
      >
        <Input.Password onChange={e=>setPassword(e.target.value)} value={password} prefix={<LockOutlined/>} placeholder={t('Введите пароль')}/>
      </Form.Item>
       <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: t('Пожалуйста подтвердите ваш пароль') }]}
      >
        <Input.Password onChange={e=>setConfirm(e.target.value)} value={confirm} prefix={<LockOutlined/>} placeholder={t('Подтвердите пароль')} />
      </Form.Item>
      {formError && <Text type='danger'>{formError.message}</Text>}
      {error && <Text type='danger'>{error.message}</Text>}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('Зарегистрироваться')}
        </Button>
      </Form.Item>
    </Form>
  );
})

