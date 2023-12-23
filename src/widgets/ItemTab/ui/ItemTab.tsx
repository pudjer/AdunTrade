import { Item } from "@/entities/Item/model/Item";
import { FC } from "react";

export const ItemTab : FC<{items: Item[]}> = ({items}) =>{
  return (
    items.map((item)=>{return <div>{item.Name}</div>})
  )
}