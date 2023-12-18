import { TabService } from "@/entities/Tab/model/Tab"
import { UserService } from "@/entities/User/model/User"
import { makePersistend, rehidrateRoot } from "@/shared/lib/model-persist/PersistProxy"
import { makeObservable } from "@/shared/lib/model-persist/obvservable"


@makePersistend('store', true)
@makeObservable
export class Store{
  userService = new UserService()
  tabs: TabService = new TabService()
}


export let store: Store 
try{
  store = rehidrateRoot<Store>('store')
}catch(e){
  console.log(e)
  store = new Store()
} 