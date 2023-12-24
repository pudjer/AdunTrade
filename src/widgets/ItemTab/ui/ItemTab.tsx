import { Item } from "@/entities/Item/model/Item";
import { ReactObserver } from "@/shared/lib/observavle/ReactObservable";
import { SearchResponse } from "@/widgets/Search/Search";
import { Card, Typography } from "antd";
import Meta from "antd/es/card/Meta";
import ky from "ky";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";



const searchLocation = document.querySelector('#searchLocation')!.getAttribute('value')!
const search = (query: string) => ky.get(searchLocation, {searchParams:{q: query, size: 1}}).json<SearchResponse>()

const Option: React.FC<{item: Item}> = ({item}) => {
  const {t} = useTranslation()
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
  >
    <Meta
      title={item.Name}
      description={
        <div >
          <div><Typography.Text >{item.MarketName && t('Магазин')+': ' + item.MarketName}</Typography.Text></div>
          <div><Typography.Text >{item.Price && t('Цена')+': ' + item.Price+' '+t('руб')}</Typography.Text></div>
          <div><Typography.Text >{item.BuyOrder && t('Заявка на покупку')+': ' + item.BuyOrder+' '+t('руб')}</Typography.Text></div>
        </div>
      }
    />
  </Card>
}


export const ItemTab : FC<{items: Item[]}> = ReactObserver(({items}) =>{
  const {t} = useTranslation()
  return <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
    <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
      {items.map(e=><Option key={e.Name+e.Price} item={e}/>)}
    </div>
    {items.length===0 && t('Извините нет в магазинах')}
  </div>
})


