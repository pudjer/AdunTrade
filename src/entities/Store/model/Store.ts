import { TabService } from "@/entities/Tab/model/Tab"
import { UserService } from "@/entities/User/model/User"
import { makePersistend, rehidrateRoot } from "@/shared/lib/model-persist/PersistProxy"
import { makeObservable } from "@/shared/lib/observavle/obvservable"
import { SearchState } from "../Classes"


@makePersistend('store', true)
@makeObservable
export class Store{
  userService = new UserService()
  tabService = new TabService()
  searchState = new SearchState()
}


export let store: Store 
try{
  store = rehidrateRoot<Store>('store')
}catch(e){
  console.log(e)
  localStorage.clear()
  store = new Store()
} 