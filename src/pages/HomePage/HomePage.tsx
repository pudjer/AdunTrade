import { ReactObserver } from "@/shared/lib/model-persist/ReactObservable";
import {makePersistend, rehidrateRoot } from "@/shared/lib/model-persist/PersistProxy";
import { makeObservable } from "@/shared/lib/model-persist/obvservable";
import { useRef } from "react";






@makePersistend('zz')
@makeObservable
class myArray extends Array{}


let myarr = new myArray()


@makePersistend('dd', true)
@makeObservable
class Rofl{
  a = myarr
  b = true
  z = 1
  x = new NeRofl()

  async wtf(){
    this.a?.push('fasf','afaaf','adfaf')
    this.b = !this.b
  }
}
@makePersistend('afafa')
@makeObservable
class NeRofl{
  a = myarr
  b = true
  wtf(){
    this.a?.push('fasf','afaaf','adfaf')
    this.b = !this.b
  }
}
let rofl: Rofl
try{
  rofl = rehidrateRoot<Rofl>('dd')
}catch(e){
  rofl = new Rofl()
} 

export const HomePage: React.FC = ReactObserver(() => {
  const ref = useRef(rofl.a)
  return(
    <>
      
      <button onClick={()=>{
        an = null
        obj = null
      }}>{'go garbage collection'}</button>
      <button onClick={()=>{
        ref.current = rofl.a
        rofl.a = new myArray()
      }}>{'new Array'}</button>
      <button onClick={()=>{
        rofl.a = ref.current
      }}>{'old Array'}</button>
      <button onClick={()=>{
        rofl.wtf()
      }}>{'+3'}</button>
       <button onClick={()=>{
        rofl.x =  new NeRofl()
      }}>{'new child'}</button>
      {rofl.a && <Child a={rofl.a}/>}
      {rofl.x ? <AnotherChild a={rofl.x}/> : 'tvar'}
    </>
  )
})
const AnotherChild = ReactObserver<React.FC<{a: NeRofl}>>(({a}) =>{
  return(
    <>
    {a.b ? 'child true' : 'child false'}
    {a.a?.map((e, i)=><div key={i}>{e}</div>)}
    <button onClick={()=>{
        a.a?.push('seks')
        a.b = !a.b
      }}>{'+seks'}</button>
      <button onClick={()=>{
        a.a = new myArray()
      }}>{'new seks'}</button>
    </>
  )
})
const Child = ReactObserver<React.FC<{a: myArray}>>(({a}) =>{
  return(
    <>
    {a.map((e, i)=> <div key={i}>{e}</div>)}
    </>
  )
})