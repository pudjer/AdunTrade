import React, { useCallback, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { Tab as AntTab } from 'rc-tabs/lib/interface'
import { useStore } from '@/app/providers/Store';
import { ItemTab } from '@/widgets/ItemTab/ui/ItemTab';
import { ITab } from '@/entities/Tab/model/Tab';
import { NewItemTab } from '@/widgets/NewItemTab/ui/NewItemTab';
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;


export const ItemPage: React.FC = () => {
  // const store = useStore()
  // const [activeKey, setActiveKey] = useState<string>(store.tabs.selectedTab)
  // const tabs: AntTab[] = store.tabs._tabs.map(tab=>( 
  //   {
  //     label: tab.label,
  //     key: tab.key,
  //     children: <ItemTab items={tab.items}/> 
  //   }
  // ))
  // const createCB = useCallback((tab: ITab)=>{store.tabs.pushTab(tab); setActiveKey(tab.key)}, [store.tabs])

  // if(activeKey==='newtab'){
  //   tabs.push({
  //     key: 'newtab',
  //     label: 'new tab',
  //     children: <NewItemTab createCB={createCB}/>
  //   })
  // }
  // const add = () => {
  //   setActiveKey('newtab')
  // }

  // const remove = (targetKey: string) =>{ 
  //   if(targetKey===activeKey) setActiveKey('newtab')
  //   store.tabs.deleteTab(targetKey)
  // }
  // const onEdit = (
  //   targetKey: TargetKey,
  //   action: 'add' | 'remove',
  // ) => {
  //   if(action==='add'){
  //     add()
  //   }else{
  //     if(typeof targetKey !== 'string') return
  //     remove(targetKey)
  //   }
  // }
  // const onChange = (targetKey: TargetKey) => {
  //   if(typeof targetKey !== 'string') return
  //   setActiveKey(targetKey)
  // }

  return (
    <Tabs
      type="editable-card"
      // onChange={onChange}
      // activeKey={activeKey}
      // onEdit={onEdit}
      // items={tabs}
    />
  );
}
