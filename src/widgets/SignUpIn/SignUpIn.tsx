import { UserService } from "@/entities/User/model/User"
import { ReactObserver } from "@/shared/lib/model-persist/ReactObservable"
import { FC, useState } from "react"
import { Register } from "../Register/ui/Register"
import { Login } from "../Login/ui/Login"
import { Button } from "antd"
import { classNames } from "@/shared/lib/classNames/classNames"
import styles from "./SignUpIn.module.scss"

export const SignUpIn: FC<{userService: UserService}> = ReactObserver(({userService}) => {
  const [isLogin, set] = useState<boolean>(true)
  return (
    <div className={classNames(styles.signupin)}>
      <Button onClick={()=>set(s=>!s)} className={classNames(styles.switch)}>
        {!isLogin ? 'im not registered!(' : 'im already registered!('}
      </Button>
      {isLogin
        ? <Register userService={userService}/>
        : <Login userService={userService}/>
      }
    </div>
  )
})