import { ReactObserver } from "@/shared/lib/observavle/ReactObservable";
import { FC, useState } from "react";
import Title from "antd/es/typography/Title";
import { UserService } from "@/entities/User/model/User";
import { Button, Typography } from "antd";
import { useQuery } from "@/shared/lib/useQuery/useQuery";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export const Profile: FC<{userService: UserService}> = ReactObserver(({userService})=>{
  
  const {toggleQuery: onSubscribe, error: suberror} = useQuery(()=>userService.Subscribe())
  const {toggleQuery: onUnsubscribe, error: unsuberror} = useQuery(()=>userService.Unsubscribe())
  const user = userService.user!
  const {t} = useTranslation()
  return(
    <div>
      {suberror && <Text type="warning">{suberror.message}</Text>}
      {unsuberror && <Text type="warning">{unsuberror.message}</Text>}

      <Title>{t('Ваш ник')}: {user.username}</Title>
      {
        user.isSubscribed
        ? 
        <Button onClick={onUnsubscribe}>{t("Закончить подписку")}</Button>
        :
        <Button onClick={onSubscribe}>{t("Подписаться")}</Button>
      }
      <Button onClick={()=>userService.Logout()}>{t("Выйти")}</Button>
    </div>
  )
})