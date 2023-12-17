import { ItemT } from "@/entities/Item/model/types/TItem"


export interface ITab {
  label: string
  key: string
  items: ItemT[]
}


export interface ITabs {
  selectedTab: string
  keySet: string[]
  tabs: ITab[] 
}
