import { Items } from "@/entities/Item/model/Item";
import { ITab } from "@/entities/Tab/model/Tab";
import { Button, Input } from "antd";
import { FC, useState } from "react";

export const NewItemTab: FC<{createCB: (tab: ITab)=>void}> = ({createCB}) => {
  const [name, setName] = useState<string>('azimov')
  return (
    <>
      <Input onChange={e => setName(e.target.value)} value={name}/>
      <Button onClick={()=>createCB({label: name, key: name, items:new Items()})}>
        create
      </Button>
    </>
    
  )
}