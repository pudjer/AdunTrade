import { makePersistend } from "@/shared/lib/model-persist/PersistProxy"
import { makeObservable } from "@/shared/lib/observavle/obvservable"
import ky from "ky"
@makePersistend('item')
@makeObservable
export class Item{
    Name!: string
    MarketName!: string
    Price?: number
    BuyOrder?: number
}


const ItemFactory = (name: string, marketname: string) => {
  const res = new Item()
  res.Name = name
  res.MarketName = marketname
  return res
}

const itemsLocation = document.querySelector('#searchLocation')!.getAttribute('value')!

const ItemApi = {
  async getItem(marketname: string, itemname: string){
    const res = await ky.get(itemsLocation+'/ItemFilter', {searchParams: {marketname, itemname}}).json<Item>()
    const item = ItemFactory(res.Name, res.MarketName)
    if(res.BuyOrder)item.BuyOrder = res.BuyOrder
    if(res.Price)item.Price = res.Price
    return item
  }
}