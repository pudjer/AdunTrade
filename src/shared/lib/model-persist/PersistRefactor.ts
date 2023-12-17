import { WeakGraph } from "./WeakGraph"
import { v4 } from 'uuid'
interface TypeDescription{
  isStringThisType(string: string):boolean
  deserialize(string: string):PropertyDescriptor
  serialize(descriptor: PropertyDescriptor, id?: string): string
  isThisType(descriptor: PropertyDescriptor, id?: string): boolean
}
type myobject ={ [key: string | symbol]: any}
type TypeSet = Set<TypeDescription>
const typeSet: TypeSet = new Set([
  {
    isStringThisType(string){
      return false
    },
    deserialize(string){
      return {value: 'afad'}
    },
    serialize(descriptor, id){
      return JSON.stringify({...descriptor, value: id})
    },
    isThisType(descriptor, id){
      return (typeof descriptor.value === 'object') && Boolean(id)
    }
  },
  {
    isStringThisType(string){
      return false
    },
    deserialize(string){
      return {value: 'afad'}
    },
    serialize(descriptor, id){
      return JSON.stringify({...descriptor})
    },
    isThisType(descriptor, id){
      return (isSerializableValue(descriptor.value))
    }
  },

])

const ObjectGraph = new WeakGraph<myobject | InstanceManager, string | typeof instanceManagerSymbol >()
const instanceManagerSymbol = Symbol()
class Observer{
  constructor(
    private readonly objectGraph: WeakGraph<myobject | InstanceManager, string | typeof instanceManagerSymbol > = ObjectGraph,
    private readonly proxied: myobject,
    instanceManager: InstanceManager
  ){
    this.objectGraph.setTriplet({parent: this.proxied, link: instanceManagerSymbol, child: instanceManager})
  }

  setChild(p: string, child: myobject){
    this.deleteChild(p)
    const childParents = this.objectGraph.getTriplets({child})
    if(childParents.length === 0){
      this.objectGraph.getTriplets({parent: child})[0]?.child.beingCheined()
    }
    this.objectGraph.deleteTriplets({parent: this.proxied, link: p})
    this.objectGraph.setTriplet({parent: this.proxied, link: p, child})
  }
  updateChildren(){
    this.objectGraph.getTriplets({parent: this.proxied}).forEach(({child})=>{
        this.objectGraph.getTriplets({parent: child})[0]?.child.beingCheined()
      }
    )
  }
  deleteChild(p: string){
    this.objectGraph.getTriplets({parent: this.proxied, link: p}).forEach(({child})=>{
      if(this.objectGraph.getTriplets({child}).length===1){
        this.objectGraph.getTriplets({parent: child, link: instanceManagerSymbol})[0]?.child.beingUncheined()
      }
    })
    this.objectGraph.deleteTriplets({parent: this.proxied, link: p})
  }
  clearChildren(){
    this.objectGraph.getTriplets({parent: this.proxied}).forEach(({child})=>{
      if(this.objectGraph.getTriplets({child}).length===1){
        this.objectGraph.getTriplets({parent: child, link: instanceManagerSymbol})[0]?.child.beingUncheined()
      }
    })
  }
}
`   `                           

class NameScope{
  private readonly registeredObjects = new Map<Serializable,any>()

  getObjectByName(name: Serializable){
    return this.registeredObjects.get(name)
  }
  registerObject(name: Serializable){
    return (obj: any)=>{
      this.registeredObjects.set(name, obj)
      return obj
    }
  }
}

class InstanceManager{
  constructor(
    private readonly chainManager: ChainManager,
    private readonly propertyManager: StorageManager,
    private readonly instance: myobject
  ){}
  defineProperty(p: string | symbol,  descriptor: PropertyDescriptor) {
    if( ('value' in descriptor && checkIsDiffProperty(this.instance, p, descriptor)) && typeof p === 'string'){
      this.propertyManager.deleteProperty(p)
      this.chainManager.deleteProperty(p)

      this.propertyManager.defineProperty(p, descriptor)
      typeof descriptor.value==='object' && this.chainManager.defineProperty(p, descriptor.value)
    }
    
  }
  deleteProperty(p: string | symbol){
    if(typeof p === 'string'){
      this.propertyManager.deleteProperty(p)
      this.chainManager.deleteProperty(p)
    }
  }
  beingCheined(): void{
    this.propertyManager.defineAllProperties()
    this.chainManager.beingCheined()
  }
  beingUncheined(): void{
    this.chainManager.beingUncheined()
    this.propertyManager.deleteAllProperties()
  }
}

interface IStorage<T = any>{
  set(id: string, key: string, value: string): void | Promise<void>,
  get(id: string, key: string): string | null | Promise<string | null>,
  delete(id: string, key: string): void | Promise<void>
  onPropHydrationError?(e: any,t:T, prop: string): void,
  onPropStoringError?(e: any, t: T, prop: string, descriptor: PropertyDescriptor,proxiedTarget: T,  previousValue?: PropertyDescriptor): void
  onPropDeleteError?(e: any, t: T, prop: string, proxiedTarget: T,  previousValue: PropertyDescriptor): void
}


class ChainManager{
  constructor(
    private readonly proxied: myobject,
    private readonly observer: Observer
  ){}
  beingCheined(): void{
    this.observer.updateChildren()
  }
  beingUncheined(): void{
    this.observer.clearChildren()
  }
  defineProperty(p: string , value: myobject){
      this.observer.deleteChild(p)
      this.observer.setChild(p, value)
    
  }
  deleteProperty(p: string ){
    this.observer.deleteChild(p)
  }
}


class StorageManager{
  constructor(
    private readonly storage: IStorage,
    private readonly typeMap: TypeSet,
    private readonly id: string,
    private readonly proxied: myobject,
    private readonly instance: myobject
  ){}
  deleteProperty(p: string ) {
    const previous = Reflect.getOwnPropertyDescriptor(this.instance,p)
    if(previous && ('value' in previous) && typeof p === 'string'){
      const res = this.storage.delete(this.id, p)
      if(res instanceof Promise){
        if(this.storage.onPropStoringError){
          res.catch(e=>this.storage.onPropDeleteError!(e,this.instance,p, previous, this.proxied))
        }
      }
    }
  }
  defineProperty(p: string , descriptor: PropertyDescriptor, id?: string){
   
      this.typeMap.forEach((description) => {
        if(description.isThisType(descriptor)){
          const serialized = description.serialize(descriptor, id)//TODO
          const res = this.storage.set(this.id,p,serialized)
          const previous = Reflect.getOwnPropertyDescriptor(this.instance, p)
          if(res instanceof Promise){
            if(this.storage.onPropDeleteError){
              res.catch(e=>this.storage.onPropStoringError!(e,this.instance,p,descriptor, this.proxied, previous))
            }
          }
        }
      }, this)
    
  }
  defineAllProperties(){
    const props = Object.getOwnPropertyDescriptors(this.instance)
    for(const key in props){
      this.defineProperty(key, props[key])
    }
  }
  deleteAllProperties(){
    const props = Object.getOwnPropertyDescriptors(this.instance)
    for(const key in props){
      this.deleteProperty(key)
    }
  }
}

type InstanceManagerFactory = ( target: myobject, proxied: myobject, id: string, namescope: NameScope, observer: Observer)=>InstanceManager

type Serializable = number | null | undefined | string | bigint | boolean 
const makePersistendClass = (name: Serializable, scope: NameScope, instanceManagerFactory: InstanceManagerFactory, observer: Observer ) => (target: any) => {
  scope.registerObject(name)(target)
  return new Proxy(target, {
    construct(t, a, n){
      return PersistProxy(Reflect.construct(t,a,n), scope,undefined,  instanceManagerFactory, observer)
    }
  })
  
}

const PersistProxy = (target: object, scope: NameScope, id: string = v4(), instanceManagerFactory: InstanceManagerFactory, observer: Observer) => {
  const res = new Proxy(target, {
    defineProperty(t, p, a){
      instanceManager.defineProperty(p, a)
      return Reflect.defineProperty(t,p,a)
    },
    deleteProperty(t,p){
      instanceManager.deleteProperty(p)
      return Reflect.deleteProperty(t,p)
    }
  })
  const instanceManager = instanceManagerFactory(target,res, id, scope, observer)
  return res
}


const isSerializableValue = (value: any): value is Serializable => {
  if(value===null) return true
  const type = typeof value
  switch(type){
    case 'bigint':
      return true
    case 'boolean':
      return true
    case 'number':
      return true
    case 'string':
      return true
    case 'undefined':
      return true
    default:
      return false
  }
}

export const checkIsDiffProperty = (t: object, p: string|symbol, a: PropertyDescriptor) => {
  const prep = Object.getOwnPropertyDescriptor(t,p)
  return !prep ||
   a.value!==prep.value ||
  a.configurable!==prep.configurable ||
  a.writable!==prep.writable ||
  a.enumerable!==prep.enumerable 
}


