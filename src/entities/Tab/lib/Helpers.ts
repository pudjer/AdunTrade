import { Tab } from "../model/Tab";


export const pushTab = (tabs: Tab[], keySet: string[], ...items: Tab[]) => {
  for (const item of items) {
    if (keySet.findIndex(e => item.key === e) === -1) {
      tabs.push(item)
      keySet.push(item.key)
    }
  }
}
export const deleteTab = (tab: Tab | number | string, tabs: Tab[], selectedTab: string, keySet: string[]): string => {
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


export function replaceTab(tab1: Tab | number, tab2: Tab | number, tabs: Tab[]) {
  const firstInd = typeof tab1 === 'object' ? tabs.indexOf(tab1) : tab1
  const secondInd = typeof tab2 === 'object' ? tabs.indexOf(tab2) : tab2
  if (firstInd < 0 || secondInd > tabs.length - 1) return
  const first = tabs[firstInd]
  tabs.splice(firstInd, 1)
  tabs[secondInd] = first
}
