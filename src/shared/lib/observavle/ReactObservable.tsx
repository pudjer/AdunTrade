import {  ReactNode, useEffect, useRef, useState } from "react";
import { autorun } from "./autorun";

export const ReactObserver = <T extends React.FC<any>>(Component: T): T => {

  const Wrapper: React.FC= (props, context) => {
    const [_, toggleState] = useState<symbol>(Symbol())
    let element: null | ReactNode = null
    const dispose = autorun(()=>{
      if(element){
        toggleState(Symbol())
        dispose()
      }else{
        element = Component(props, context)
      }
    })
    useEffect(()=>dispose)
    return element
  }
  return Wrapper as T
}

