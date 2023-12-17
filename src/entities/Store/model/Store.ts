import { ITabs } from "@/entities/Tab/model/Tab"
import { IUser } from "@/entities/User/model/User"
import { configureStore } from "@reduxjs/toolkit"


export interface IStore{
  user?: IUser
  tabs: ITabs
}


