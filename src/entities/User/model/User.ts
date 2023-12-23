import { LOCAL_STORAGE_TOKEN_KEY } from "@/shared/const/localstorage"
import { getMe, login, register, subscribe, unsubscribe } from "../api/UserApi"
import { makeObservable } from "@/shared/lib/observavle/obvservable"
import { makePersistend, notPersistedProperty } from "@/shared/lib/model-persist/PersistProxy"


@makePersistend('user')
@makeObservable
export class User{
  id!: string
  isAdmin!: boolean
  isSubscribed!: boolean
  username!: string
}

export const UserFactory = (
  id: string,
  isAdmin: boolean,
  isSubscribed: boolean,
  username: string
) => {
  const user = new User()
  user.id = id
  user.isAdmin = isAdmin
  user.isSubscribed = isSubscribed
  user.username = username
  return user
}

@makePersistend('userService')
@makeObservable
export class UserService{
  user?: User
  _token?: string
  error?: Error | string

  get token(){
    return this._token
  }
  set token(value: string | undefined){
    this._token = value
    if(value){
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, value)
    }else{
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
    }
  }

  
  async Login(username: string, password: string){
    const res = await login({username, password})
    const token = res.token
    this.token = token
    const user = await getMe()
    this.user = UserFactory(user.id, user.isAdmin, user.isSubscribed, user.username)
  }
  async Register(username: string, password: string){
    const res = await register({username, password})
    const token = res.token
    this.token = token
    const user = await getMe()
    this.user = UserFactory(user.id, user.isAdmin, user.isSubscribed, user.username)
  }
  async Subscribe(){
    if(!this.token) throw Error('not auth')
    const user = await subscribe()
    this.user = UserFactory(user.id, user.isAdmin, user.isSubscribed, user.username)
  }
  async Unsubscribe(){
    if(!this.token) throw Error('not auth')
    const user = await unsubscribe()
    this.user = UserFactory(user.id, user.isAdmin, user.isSubscribed, user.username)   
  }
  async Logout(){
    this.user = undefined
    this.token = undefined
  }
}
