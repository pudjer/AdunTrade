import { ReactObserver } from "@/shared/lib/observavle/ReactObservable";
import { FC, useState } from "react";
import Title from "antd/es/typography/Title";
import { UserService } from "@/entities/User/model/User";
import { Button, Typography } from "antd";
import { useQuery } from "@/shared/lib/useQuery/useQuery";
const { Text } = Typography;

export const Profile: FC<{userService: UserService}> = ReactObserver(({userService})=>{
  
  const {toggleQuery: onSubscribe, error: suberror} = useQuery(()=>userService.Subscribe())
  const {toggleQuery: onUnsubscribe, error: unsuberror} = useQuery(()=>userService.Unsubscribe())
  const user = userService.user!
  
  return(
    <div>
      {suberror && <Text type="warning">{suberror.message}</Text>}
      {unsuberror && <Text type="warning">{unsuberror.message}</Text>}

      <Title>Username: {user.username}</Title>
      {
        user.isSubscribed
        ? 
        <Button onClick={onUnsubscribe}>End Subscribtion</Button>
        :
        <Button onClick={onSubscribe}>Subscribe</Button>
      }
      <Button onClick={()=>userService.Logout()}>Logout</Button>
    </div>
  )
})