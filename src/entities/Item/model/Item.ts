import { makePersistend } from "@/shared/lib/model-persist/PersistProxy"
import { makeObservable } from "@/shared/lib/model-persist/obvservable"
@makePersistend('item')
@makeObservable
export class Item{
    Name!: string
    MarketName!: string
    Price?: number
    BuyOrder?: number
  }
  
