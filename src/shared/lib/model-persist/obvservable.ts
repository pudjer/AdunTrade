import { addHandlers } from "./Global"
import { addReactions, checkIsDiffProperty, ReactionMap, skipObserving, withoutInvokingReactions } from "./Global"


type decorator = <T extends Function>(cl: T) => T
export const makeObservable: decorator = (target) =>{
  const res = new Proxy(target, {
    construct(t, a, n){
      return ObservableProxy(Reflect.construct(t, a, n))
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
        const res = skipObserving(()=>Reflect.defineProperty(t, p, a))
        isDiff && addReactions(PropertyReactionsMap, p) 
        skipObserving(()=>!Reflect.has(t, p)) && addReactions(PropertyReactionsMap, ownKeysSymbol)
        return res
      },
      set(t, p, n, a){
        const isDiff = t[p]!==n
        const res = skipObserving(()=>Reflect.set(t, p,n, a))
        isDiff && addReactions(PropertyReactionsMap, p)
        return res
      },
      deleteProperty(t, p){
        const res = skipObserving(()=>Reflect.deleteProperty(t, p))
        addReactions(PropertyReactionsMap, p)
        addReactions(PropertyReactionsMap, ownKeysSymbol)
        return res
      },
      getOwnPropertyDescriptor(t, p){
        const res = skipObserving(()=>Reflect.getOwnPropertyDescriptor(t,p))
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      get(t, p, r){
        const res = skipObserving(()=>Reflect.get(t, p, r))
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      getPrototypeOf(t){
        const res = skipObserving(()=>Reflect.getPrototypeOf(t))
        addHandlers(protoSymbol, PropertyReactionsMap)
        return res
      },
      setPrototypeOf(t, v){
        const res = skipObserving(()=>Reflect.setPrototypeOf(t, v))
        Reflect.getPrototypeOf(t)!==v && addReactions(PropertyReactionsMap, protoSymbol)
        return res
      },
      has(t, p){
        const res = skipObserving(()=>Reflect.get(t, p))
        addHandlers(p, PropertyReactionsMap)
        return res
      },
      isExtensible(t){
        const res = skipObserving(()=>Reflect.isExtensible(t))
        addHandlers(extensSymbol, PropertyReactionsMap)
        return res
      },
      preventExtensions(t){
        const res = skipObserving(()=>Reflect.preventExtensions(t))
        addReactions(PropertyReactionsMap, extensSymbol)
        return res
      },
      ownKeys(t){
        const res = skipObserving(()=>Reflect.ownKeys(t))
        addReactions(PropertyReactionsMap, ownKeysSymbol)
        return res
      }

    }
  )
}



