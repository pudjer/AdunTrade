import React from 'react';
import { Tabs } from 'antd';
import { Tab as AntTab } from 'rc-tabs/lib/interface'
import { ReactObserver } from '@/shared/lib/observavle/ReactObservable';
import { Tab } from '@/entities/Tab/model/Tab';
import { ItemTab } from '@/widgets/ItemTab/ui/ItemTab';
import { store } from '@/entities/Store/model/Store';
import style from './ItemPage.module.scss'
import { Search } from '@/widgets/Search/Search';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;


export const ItemPage = ReactObserver(() => {
  const tabService = store.tabService
  const tabsDisplay: AntTab[] = tabService.tabs.map(tab=>( 
    {
      label: tab.label,
      key: tab.key,
      children: <ItemTab items={tab.items}/> 
    }
  ))

  if(tabService.selectedTab==='newtab'){
    tabsDisplay.push({
      key: 'newtab',
      label: 'new tab',
      closable: false,
      children: <Search/>
    })
  }
  const add = () => {
    tabService.selectedTab = 'newtab'
  }

  const remove = (targetKey: string) =>{ 
    tabService.deleteTab(targetKey)
  }
  const onEdit = (
    targetKey: TargetKey,
    action: 'add' | 'remove',
  ) => {
    if(action==='add'){
      add()
    }else{
      if(typeof targetKey !== 'string') return
      remove(targetKey)
    }
  }
  const onChange = (targetKey: TargetKey) => {
    if(typeof targetKey !== 'string') return
    tabService.selectedTab = targetKey
  }

  return (
    <Tabs
      className={style.tabs}
      type="editable-card"
      onChange={onChange}
      activeKey={tabService.selectedTab}
      onEdit={onEdit}
      items={tabsDisplay}
    />
  );
})
