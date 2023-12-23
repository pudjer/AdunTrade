import { addHandlers } from "./Global"
import { addReactions, checkIsDiffProperty, ReactionMap, skipObserving, withoutInvokingReactions } from "./Global"


type decorator = <T extends Function>(cl: T) => T
export const makeObservable: decorator = (target) =>{
  const res = new Proxy(target, {
    construct(t, a, n){
      const res = Reflect.construct(t, a, n)
      if(res instanceof Array)res.length = res.length
      return ObservableProxy(res)
    }
  })
  return res
}




const ownKeysSymbol = Symbol()
const protoSymbol = Symbol()
const extensSymbol = Symbol()
const ObservableProxy = <T extends {[key: string | symbol]: any}>(obj: T): T  => {
  const PropertyReactionsMap: ReactionMap = new Map()
  
  return new Proxy(obj, {
      defineProperty(t, p, a){
        const isDiff = checkIsDiffProperty(t,p,a)
        const res = Reflect.defineProperty(t, p, a)
        !Reflect.has(t, p) && withoutInvokingReactions(()=>addReactions(PropertyReactionsMap, ownKeysSymbol))
        isDiff && addReactions(PropertyReactionsMap, p)
        return res
      },
      deleteProperty(t, p){
        const res = Reflect.deleteProperty(t, p)
        withoutInvokingReactions(()=>addReactions(PropertyReactionsMap, p))
        addReactions(PropertyReactionsMap, ownKeysSymbol)
        return res
      },
      getOwnPropertyDescriptor(t, p){
        const res = Reflect.getOwnPropertyDescriptor(t,p)
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      get(t, p, r){
        const res = Reflect.get(t, p, r)
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      getPrototypeOf(t){
        const res = Reflect.getPrototypeOf(t)
        addHandlers(protoSymbol, PropertyReactionsMap)
        return res
      },
      setPrototypeOf(t, v){
        const isDiff = Reflect.getPrototypeOf(t)!==v
        const res = Reflect.setPrototypeOf(t, v)
        isDiff && addReactions(PropertyReactionsMap, protoSymbol)
        return res
      },
      has(t, p){
        const res = Reflect.get(t, p)
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      isExtensible(t){
        const res = Reflect.isExtensible(t)
        addHandlers(extensSymbol, PropertyReactionsMap)
        return res
      },
      preventExtensions(t){
        const res = Reflect.preventExtensions(t)
        addReactions(PropertyReactionsMap, extensSymbol)
        return res
      },
      ownKeys(t){
        const res = Reflect.ownKeys(t)
        addReactions(PropertyReactionsMap, ownKeysSymbol)
        return res
      }

    }
  )
}



