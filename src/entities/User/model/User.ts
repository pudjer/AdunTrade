import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { login } from "../api/UserApi"
import { makeObservable } from "@/shared/lib/model-persist/obvservable"
import { makePersistend } from "@/shared/lib/model-persist/PersistProxy"


export interface IUser{
  id: string
  isAdmin: boolean,
  isSubscribed: boolean,
  username: string,
}

@makePersistend('user')
@makeObservable
export class User implements IUser{
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
export class UserApi{
  user?: User
  token?: string
  
}
