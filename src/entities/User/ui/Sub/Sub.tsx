import { useQuery } from "@/shared/lib/useQuery/useQuery"
import { Button } from "antd"
import { FC, memo, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { subscribe, unsubscribe } from "../../api/UserApi"
import Title from "antd/es/typography/Title"
import { SubscribeResponse } from "../../api/types/Subscribe"
import { UnsubscribeResponse } from "../../api/types/Unsubscribe"
import { IUser } from "../../model/User"

interface SubProps{
  user: IUser
  subscribe: ()=>Promise<SubscribeResponse>
  unsubscribe: ()=>Promise<UnsubscribeResponse>
}
export const Sub : FC<SubProps> = memo(({user, subscribe, unsubscribe}) => {
  const {t} = useTranslation()
  const {toggleQuery:sub, isPending: isPendingSub} = useQuery(subscribe)
  const {toggleQuery:unsub, isPending: isPendingUnSub} = useQuery(unsubscribe)
  const onSub = useCallback(()=>{
    if(sub){
      sub().then(user=>{user.isSubscribed=user.isSubscribed})
    }
  }, [sub, user])
  const onUnSub = useCallback(()=>{
    if(unsub){
      unsub().then(user=>{user.isSubscribed=user.isSubscribed})
    }
  }, [unsub, user])
  return (
    <div>
      {
      user?.isSubscribed ?
        <Button type="primary"
        disabled={isPendingSub}
        onClick={onSub}>
          {t('Подписаться')}</Button>
        : 
        <Button type="default"
        disabled={isPendingUnSub}
        onClick={onUnSub}>
          {t('Отписаться')}</Button>
      }
    </div>
  )
})