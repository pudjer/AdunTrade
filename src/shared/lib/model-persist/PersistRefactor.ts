import { WeakGraph } from "./WeakGraph"
import { v4 } from 'uuid'
interface TypeDescription{
  isStringThisType(string: string):boolean
  deserialize(string: string):PropertyDescriptor
  serialize(descriptor: PropertyDescriptor): string
  isThisType(descriptor: PropertyDescriptor): boolean
}
type myobject ={ [key: string | symbol]: any}
type TypeSet = Set<TypeDescription>

class Serializer{
  constructor(
    private readonly typeSet: TypeSet,
    private readonly observer: Observer
  ){}
  serialize(descriptor: PropertyDescriptor){
    let serialized: undefined | string
    if(typeof descriptor.value==='object'){
      const id = this.observer.getManager(descriptor.value)?.id
      if(id){
        const newDesc = {...descriptor}
        newDesc.value = id
        serialized = JSON.stringify(descriptor)
      }
    } 
    this.typeSet.forEach((description) => {
      if(description.isThisType(descriptor)){
        serialized = description.serialize(descriptor)
      }
    })
    return serialized
  }
}
const typeSet: TypeSet = new Set([
  {
    isStringThisType(string){
      return false
    },
    deserialize(string){
      return {value: 'afad'}
    },
    serialize(descriptor){
      return JSON.stringify((descriptor))
    },
    isThisType(descriptor){
      return isSerializableValue(descriptor.value)
    }
  },
  {
    isStringThisType(string){
      return false
    },
    deserialize(string){
      return {value: 'afad'}
    },
    serialize(){
      return 'undefined'
    },
    isThisType(descriptor){
      return descriptor.value==='undefined'
    }
  },

])

const ObjectGraph = new WeakGraph<myobject | InstanceManager, string | typeof instanceManagerSymbol >()
const instanceManagerSymbol = Symbol()
class Observer{
  constructor(
    private readonly objectGraph: WeakGraph<myobject | InstanceManager, string | typeof instanceManagerSymbol > = ObjectGraph,
    private readonly proxied: myobject,
    isRoot?: true
  ){
    if(isRoot)objectGraph.setTriplet({child: this.proxied, link: 'a', parent: {}})
  }
  hasParents(){
    const childParents = this.objectGraph.getTriplets({child: this.proxied})
    return childParents.length > 0
  }
  setManager(instanceManager: InstanceManager){
    this.objectGraph.setTriplet({parent: this.proxied, link: instanceManagerSymbol, child: instanceManager})
  }
  getManager(obj: myobject): InstanceManager | undefined{
    return this.objectGraph.getTriplets({parent: obj, link: instanceManagerSymbol})[0]?.child as InstanceManager
  }
  setChild(p: string, child: myobject){
    this.deleteChild(p)
    const childParents = this.objectGraph.getTriplets({child})
    if(childParents.length === 0){
      this.getManager(child)?.beingCheined()
    }
    this.objectGraph.setTriplet({parent: this.proxied, link: p, child})
  }
  updateChildren(){
    this.objectGraph.getTriplets({parent: this.proxied}).forEach(({child})=>{
        this.getManager(child)?.beingCheined()
      }
    )
  }
  deleteChild(p: string){
    this.objectGraph.getTriplets({parent: this.proxied, link: p}).forEach(({child})=>{
      if(this.objectGraph.getTriplets({child}).length===1){
        this.getManager(child)?.beingUncheined()
      }
    })
    this.objectGraph.deleteTriplets({parent: this.proxied, link: p})
  }
  clearChildren(){
    this.objectGraph.getTriplets({parent: this.proxied}).forEach(({child})=>{
      if(this.objectGraph.getTriplets({child}).length===1){
        this.getManager(child)?.beingUncheined()
      }
    })
  }
}
                 

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
    private readonly instance: myobject,
    public id: string,
    private readonly chainManager: ChainManager,
    private readonly storageManager: StorageManager,
    observer: Observer
  ){
    observer.setManager(this)
  }
  defineProperty(p: string | symbol,  descriptor: PropertyDescriptor) {
    const prev = Reflect.getOwnPropertyDescriptor(this.instance, p)
    if(!prev || checkIsDiffProperty(prev, descriptor)){
      this.deleteProperty(p)

      this.chainManager.defineProperty(p, descriptor)
      this.chainManager.isCheinded() && this.storageManager.defineProperty(p, descriptor)
    }
  }
  deleteProperty(p: string | symbol){
    this.chainManager.isCheinded() && this.storageManager.deleteProperty(p)
    this.chainManager.deleteProperty(p)
  }
  beingCheined(): void{
    this.storageManager.defineAllProperties()
    this.chainManager.beingCheined()
  }
  beingUncheined(): void{
    this.chainManager.beingUncheined()
    this.storageManager.deleteAllProperties()
  }
}

interface IStorage<T = any>{
  set(id: string, key: string, value: string): void | Promise<void>
  get(id: string, key: string): null | string | Promise<string | null>
  delete(id: string, key: string): void | Promise<void>
  onPropHydrationError?(e: any, t: T, prop: string): void
  onPropStoringError?(e: any, t: T, prop: string, descriptor: PropertyDescriptor, proxiedTarget: T,  previousValue?: PropertyDescriptor): void
  onPropDeleteError?(e: any, t: T, prop: string, proxiedTarget: T,  previousValue: PropertyDescriptor): void
}


class ChainManager{
  constructor(
    private readonly instance: myobject,
    private readonly observer: Observer
  ){}
  isCheinded(): boolean{
    return this.observer.hasParents()
  }
  beingCheined(): void{
    this.observer.updateChildren()
  }
  beingUncheined(): void{
    this.observer.clearChildren()
  }
  defineProperty(p: string | symbol , descriptor: PropertyDescriptor){
    if(typeof p !== 'string' || !('value' in descriptor) || typeof descriptor.value!=='object')return
    this.observer.deleteChild(p)
    this.observer.setChild(p, descriptor.value)
    
  }
  deleteProperty(p: string | symbol ){
    const descriptor = Reflect.getOwnPropertyDescriptor(this.instance, p)
    if(!descriptor || typeof p !== 'string' || !('value' in descriptor) || typeof descriptor.value!=='object')return
    this.observer.deleteChild(p)
  }
}


class StorageManager{
  constructor(
    private readonly storage: IStorage,
    private readonly serializer: Serializer,
    private readonly id: string,
    private readonly proxied: myobject,
    private readonly instance: myobject
  ){}
  deleteProperty(p: string | symbol ) {
    const previous = Reflect.getOwnPropertyDescriptor(this.instance,p)
    if(typeof p === 'string'){
      const res = this.storage.delete(this.id, p)
      if(res instanceof Promise){
        if(this.storage.onPropDeleteError){
          res.catch(e=>this.storage.onPropDeleteError!(e,this.instance,p, previous, this.proxied))
        }
      }
    }
  }
  defineProperty(p: string | symbol , descriptor: PropertyDescriptor){
      const previous = Reflect.getOwnPropertyDescriptor(this.instance, p)
      if(typeof p!=='string') return
      const serialized = this.serializer.serialize(descriptor)
      const res = serialized && this.storage.set(this.id,p,serialized)
      if(res instanceof Promise){
        if(this.storage.onPropStoringError){
          res.catch(e=>this.storage.onPropStoringError!(e,this.instance,p,descriptor, this.proxied, previous))
        }
      }
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

type InstanceManagerFactory = ( target: myobject, proxied: myobject, id: string, namescope: NameScope, isRoot?: true)=>InstanceManager

type Serializable = number | null | string | bigint | boolean 
const makePersistendClass = ( name: Serializable, scope: NameScope, isRoot?: true, instanceManagerFactory?: InstanceManagerFactory ) => (target: any) => {
  scope.registerObject(name)(target)
  return new Proxy(target, {
    construct(t, a, n){
      return PersistProxy(Reflect.construct(t,a,n), scope,undefined,  instanceManagerFactory, isRoot)
    }
  })
  
}

const PersistProxy = (target: object, scope: NameScope, id: string = v4(), instanceManagerFactory: InstanceManagerFactory = instanceManagerFactoryDefault, isRoot?: true) => {
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
  const instanceManager = instanceManagerFactory(target,res, id, scope, isRoot)
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
    default:
      return false
  }
}

export const checkIsDiffProperty = (prev: PropertyDescriptor, cur: PropertyDescriptor) => {
  return !prev ||
   cur.value!==prev.value ||
  cur.configurable!==prev.configurable ||
  cur.writable!==prev.writable ||
  cur.enumerable!==prev.enumerable 
}




const instanceManagerFactoryDefault: InstanceManagerFactory = (target, proxied, id, namescope, isRoot) => {
  const observer = new Observer(ObjectGraph, proxied, isRoot )
  const chainManager = new ChainManager(target, observer)
  const serializer = new Serializer(typeSet, observer)
  const storage: IStorage = {get:localStorage.getItem, set:localStorage.setItem, delete:localStorage.removeItem}
  const storageManager = new StorageManager(storage, serializer, id, proxied, target)
  return new InstanceManager(target, id, chainManager, storageManager, observer)
}