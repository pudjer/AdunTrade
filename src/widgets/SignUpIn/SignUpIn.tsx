import { UserService } from "@/entities/User/model/User"
import { ReactObserver } from "@/shared/lib/observavle/ReactObservable"
import { FC, useState } from "react"
import { Register } from "../Register/ui/Register"
import { Login } from "../Login/ui/Login"
import { Button } from "antd"
import { classNames } from "@/shared/lib/classNames/classNames"
import styles from "./SignUpIn.module.scss"
import { useTranslation } from "react-i18next"

export const SignUpIn: FC<{userService: UserService}> = ReactObserver(({userService}) => {
  const [isLogin, set] = useState<boolean>(false)
  const {t} = useTranslation()
  return (
    <div className={classNames(styles.signupin)}>
      <Button onClick={()=>set(s=>!s)} className={classNames(styles.switch)}>
        {!isLogin ? t('Я еще не зарегистрировался!(') : t('Я уже зарегистрировался!(')}
      </Button>
      {isLogin
        ? <Register userService={userService}/>
        : <Login userService={userService}/>
      }
    </div>
  )
})