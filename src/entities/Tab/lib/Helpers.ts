import { ITab } from "../model/Tab";


export const pushTab = (tabs: ITab[], keySet: string[], ...items: ITab[]) => {
  for (const item of items) {
    if (keySet.findIndex(e => item.key === e) === -1) {
      tabs.push(item)
      keySet.push(item.key)
    }
  }
}
export const deleteTab = (tab: ITab | number | string, tabs: ITab[], selectedTab: string, keySet: string[]): string => {
  if (typeof tab === 'object') {
    tab = tabs.indexOf(tab)
  } else if (typeof tab === 'string') {
    if (tab === selectedTab) selectedTab = 'newtab'
    tab = tabs.findIndex(el => el.key === tab)
  }
  if (tab < 0 || tab > tabs.length - 1) return selectedTab
  const ind = keySet.indexOf(tabs[tab as number].key)
  keySet.splice(ind, 1)
  tabs.splice(tab, 1)
  tabs.pop()
  return selectedTab
}


export function replaceTab(tab1: ITab | number, tab2: ITab | number, tabs: ITab[]) {
  const firstInd = typeof tab1 === 'object' ? tabs.indexOf(tab1) : tab1
  const secondInd = typeof tab2 === 'object' ? tabs.indexOf(tab2) : tab2
  const first = tabs[firstInd]
  tabs.splice(firstInd, 1)
  tabs[secondInd] = first
}
