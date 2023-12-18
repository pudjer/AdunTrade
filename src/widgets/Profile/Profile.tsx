import { ReactObserver } from "@/shared/lib/model-persist/ReactObservable";
import { FC, useState } from "react";
import Title from "antd/es/typography/Title";
import { UserService } from "@/entities/User/model/User";
import { Button, Typography } from "antd";
const { Text } = Typography;

export const Profile: FC<{userService: UserService}> = ReactObserver(({userService})=>{
  const [error, setError] = useState<Error>()
  const user = userService.user!
  console.log('rerender')
  const onSubscribe = () => {
    try{
      userService.Subscribe()
    }catch(e){
      if(e instanceof Error){
        setError(e)
      }
    }
  } 
  const onUnsubscribe = () => {
    try{
      userService.Unsubscribe()
    }catch(e){
      if(e instanceof Error){
        setError(e)
      }
    }
  } 
  return(
    <div>
      {error && <Text type="warning">{error.message}</Text>}
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