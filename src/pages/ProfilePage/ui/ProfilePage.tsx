import { store } from "@/entities/Store/model/Store"
import { ReactObserver } from "@/shared/lib/observavle/ReactObservable"
import { Profile } from "@/widgets/Profile/Profile"
import { SignUpIn } from "@/widgets/SignUpIn/SignUpIn"



export const ProfilePage = ReactObserver(() => {
  const userService = store.userService

  return (
    <div>
      {userService.user
        ? <Profile userService={userService}/>
        : <SignUpIn userService={userService}/>
      }
    </div>
  )
})