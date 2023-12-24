import { Item, ItemApi } from "@/entities/Item/model/Item"
import { Coption, MyArray, optionFactory } from "@/entities/Store/Classes"
import { store } from "@/entities/Store/model/Store"
import { TabFactory } from "@/entities/Tab/model/Tab"
import { ReactObserver } from "@/shared/lib/observavle/ReactObservable"
import { useQuery } from "@/shared/lib/useQuery/useQuery"
import { SearchResponse } from "@/widgets/Search/Search"
import { Button, Card, Typography } from "antd"
import Meta from "antd/es/card/Meta"
import ky from "ky"
import { makeObservable } from "mobx"
import { useEffect, useState } from "react"



const searchLocation = document.querySelector('#searchLocation')!.getAttribute('value')!
const search = (query: string) => ky.get(searchLocation, {searchParams:{q: query, size: 1}}).json<SearchResponse>()
const Option: React.FC<{item: Item}> = ({item}) => {
  const [img, setImg]= useState<undefined | string>()
  useEffect( ()=>{
    search(item.Name).then(res=>setImg(res?.hits?.hits?.[0]?._source?.linktoimg))
  }, [])
  return <Card
    cover={
      img && <img
        src={img+'1x'}
      />
    }
    style={{ width: 300, margin: 30 }}
    actions={[
      <Button onClick={()=>{
        const tab = TabFactory(item.Name, item.Name)

        store.tabService.pushTab(tab)

        ItemApi.getItem(item.Name, 'CsMarket').then((item)=>{item && tab.items.push(item)})
        ItemApi.getItem(item.Name, 'LisSkins').then((item)=>{item && tab.items.push(item)})
        store.tabService.selectedTab = tab.key
        
      }}>Add to tabs</Button>
    ]}
  >
    <Meta
      title={item.Name}
      description={
        <div >
          <div><Typography.Text >{item.MarketName && 'MarketName: ' + item.MarketName}</Typography.Text></div>
          <div><Typography.Text >{item.Price && 'Price: ' + item.Price+' rub'}</Typography.Text></div>
          <div><Typography.Text >{item.BuyOrder && 'BuyOrder: ' + item.BuyOrder+' rub'}</Typography.Text></div>
        </div>
      }
    />
  </Card>
}

@makeObservable
export class SearchState{
  options = new MyArray<Item>()
  value = ''
  error?: string
  from = 1
}
const searchState = new SearchState()

export const HomePage: React.FC = ReactObserver(() => {
  const {toggleQuery, error} = useQuery(getAddItems)
  useEffect(()=>{
    toggleQuery && toggleQuery(searchState.from)
    return ()=>{searchState.options = new MyArray()}
  }, [])
  return <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
    {error && <Typography.Text type="danger">{error.message}</Typography.Text>}
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {searchState.options.map((e,i)=><Option key={i} item={e}/>)}
    </div>
      {searchState.options.length!==0 && <Button onClick={(e)=>{searchState.from++;toggleQuery && toggleQuery(searchState.from); }}>\/\/\/\/\/\/</Button>}
  </div>
})

const getAddItems = async (n: number) => {
  try{
    const res = await ItemApi.getItems('LisSkins', n, 30)
    
    searchState.options.push(...res)
  }catch(e){
    if(e instanceof Error){
      searchState.error = e.message
    }
    throw e
  }
}