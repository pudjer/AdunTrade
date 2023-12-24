import React, { ChangeEvent, ReactElement, useState } from 'react';
import { Button, Card, Input, Select, Typography } from 'antd';
import { debounce } from 'lodash';
import ky from 'ky';
import { store } from '@/entities/Store/model/Store';
import { Coption, MyArray, optionFactory } from '@/entities/Store/Classes';
import { ReactObserver } from '@/shared/lib/observavle/ReactObservable';
import Meta from 'antd/es/card/Meta';
import styles from './Search.module.scss'
import { Tab, TabFactory } from '@/entities/Tab/model/Tab';
import { useQuery } from '@/shared/lib/useQuery/useQuery';
import { ItemApi } from '@/entities/Item/model/Item';


const searchLocation = document.querySelector('#searchLocation')!.getAttribute('value')!
const search =(query: string, n: number = 0) => ky.get(searchLocation, {searchParams:{q: query, size: 30, from: n*30}}).json<SearchResponse>()
export type SearchResponse = {
  hits:{
    hits: {
      _source: Coption
    }[]
  }
}

const searchState = store.searchState

const onChange = debounce(async (e: ChangeEvent<HTMLInputElement>) => {
  try{
    delete searchState.error
    const val = e.target.value
    searchState.value = val
    const res = await search(val)
    const opts = res?.hits.hits
    const newArr = new MyArray<SearchResponse['hits']['hits'][number]['_source']>()
    newArr.push(...opts.map(e=>optionFactory(e._source.name, e._source.linktoimg)))
    searchState.options = newArr
  }catch(e){
    if(e instanceof Error){
      searchState.error = e.message
    }
  }
 
}, 1000)



const Option: React.FC<Coption> = ({linktoimg, name}) => (
  <Card
    style={{ width: 300, margin: 30 }}
    cover={
      <img
        src={linktoimg+'1x'}
      />
    }
    actions={[
      <Button onClick={()=>{
        const tab = TabFactory(name, name)

        store.tabService.pushTab(tab)

        ItemApi.getItem(name, 'CsMarket').then((item)=>{item && tab.items.push(item)})
        ItemApi.getItem(name, 'LisSkins').then((item)=>{item && tab.items.push(item)})
        store.tabService.selectedTab = tab.key

        
      }}>Add to tabs</Button>
    ]}
  >
    <Meta
      title={name}
    />
  </Card>
);

const getAddItems = async (n: number) => {
  try{
    delete searchState.error
    const res = await search(searchState.value, n)
    const opts = res?.hits.hits
    
    searchState.options.push(...opts.map(e=>optionFactory(e._source.name, e._source.linktoimg)))
  }catch(e){
    if(e instanceof Error){
      searchState.error = e.message
    }
  }
}



export const Search: React.FC = ReactObserver(() => {
  const [from, setFrom] = useState<number>(0)
  const {toggleQuery, error} = useQuery(getAddItems)
  const {toggleQuery: rilOnChange, error: error2} = useQuery(async (e: ChangeEvent<HTMLInputElement>)=>{searchState.value = e.target.value;return await onChange(e)})
  return <div className={styles.search}>
    <Input
      placeholder='Search Items'
      onChange={async (e)=>{rilOnChange && await rilOnChange(e); setFrom(0)}}
      value={searchState.value}
      style={{maxWidth:300}}
    />
    {error && <Typography.Text type='danger'>{error.message}</Typography.Text>}
    {error2 && <Typography.Text type='danger'>{error2.message}</Typography.Text>}
    {searchState.error && <Typography.Text type='danger'>{searchState.error}</Typography.Text>}


    <div className={styles.rescontainer}>
      {searchState.options.map(e=><Option key={e.name} linktoimg={e.linktoimg} name={e.name}/>)}
    </div>
    {searchState.options.length!==0 && <Button onClick={async (e)=>{toggleQuery && await toggleQuery(from+1); setFrom(from+1)}}>\/\/\/\/\/\/</Button>}
  </div>
})


