import { MyArray } from "@/entities/Store/Classes"
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
    linktoimg!: string
}


const ItemFactory = (name: string, marketname: string, linktoimg?: string) => {
  const res = new Item()
  res.Name = name
  res.MarketName = marketname
  if(linktoimg) res.linktoimg = linktoimg
  return res
}

const itemsLocation = document.querySelector('#itemsLocation')!.getAttribute('value')!

export const ItemApi = {
  async getItem(itemname: string, marketname: string){
    const res = await ky.get(itemsLocation+'ItemFilter', {searchParams: {marketname, itemname}}).json<Item | undefined>()
    if(!res || !res.MarketName || !res.Name)return undefined
    const item = ItemFactory(res.Name, res.MarketName)
    if(res.BuyOrder)item.BuyOrder = res.BuyOrder
    if(res.Price)item.Price = res.Price
    console.log(item)
    return item
  },
  async getItems(marketname: string, pageNumber: number, pageSize: number){
    const Allres = await ky.get(itemsLocation+'JsonController', {searchParams: {marketname, pageNumber, pageSize}}).json<Item[] | undefined>()
    const arr = new MyArray<Item>()
    if(!Allres) return arr
    for(const res of Allres){
      if(!res || !res.MarketName || !res.Name) continue
      const item = ItemFactory(res.Name, res.MarketName)
      if(res.BuyOrder)item.BuyOrder = res.BuyOrder
      if(res.Price)item.Price = res.Price
      arr.push( item)
    }
    return arr
  }
}