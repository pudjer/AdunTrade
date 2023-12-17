import { Items } from "@/entities/Item/model/Item";
import { FC } from "react";

export const ItemTab : FC<{items: Items}> = ({items}) =>{
  return (
    items._items.map((item)=>{return <div>{item.name}</div>})
  )
}