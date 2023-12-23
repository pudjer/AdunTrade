import { Item } from "@/entities/Item/model/Item"
import { MyArray } from "@/entities/Store/Classes"
import { makePersistend } from "@/shared/lib/model-persist/PersistProxy"
import { makeObservable } from "@/shared/lib/observavle/obvservable"
import { deleteTab, pushTab, replaceTab } from "../lib/Helpers"


@makePersistend('tab')
@makeObservable
export class Tab {
  label!: string
  key!: string
  items = new MyArray<Item>()
}

export const TabFactory = (label: string, key: string) => {
  const res = new Tab()
  res.key = key
  res.label = label 
  return res
}


@makePersistend('tabservice')
@makeObservable
export class TabService {
  selectedTab: string = 'newtab'
  keySet = new MyArray<string>()
  tabs = new MyArray<Tab>()
  pushTab(...tabs: Tab[]){
    pushTab(this.tabs, this.keySet, ...tabs)
  }
  deleteTab(tab: string | number | Tab){
    this.selectedTab = deleteTab(tab, this.tabs, this.selectedTab, this.keySet)
  }
  replaceTab(tab1: number | Tab, tab2: number | Tab){
    replaceTab(tab1, tab2, this.tabs)
  }
}
