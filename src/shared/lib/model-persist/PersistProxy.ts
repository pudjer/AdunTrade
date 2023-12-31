import { v4 as uuidv4 } from 'uuid';
import 'reflect-metadata'
const uuidSymbol = Symbol()
const deleteParentSymbol = Symbol()
const addParentSymbol = Symbol()
const classNames = new Map<string,Function>()
const ObjectsMap = new Map<string, object>()
let uuidStart = '##UUID##'
const propNamesEnd = '##PROPS##'
const simpleValueStart = '##SIMPLE##'

let CONSTRUCTION = false


const simpleValueMap = new Map<string, any>()
const reverseSimpleValueMap = new Map<any, string>()

export const registerSimpleValue = (value: any, key: string) => {
  simpleValueMap.set(simpleValueStart+key, value)
  reverseSimpleValueMap.set(value, simpleValueStart+key)
}


const rehidrate = (uuid: string, isRoot?: true) => {
  if(!uuid.startsWith(uuidStart)) return JSON.parse(uuid)
  if(uuid.startsWith(simpleValueStart)) return simpleValueMap.get(uuid)
  const classname = localStorage.getItem(uuid)
  if(!classname) throw Error('not classname in localstorage')
  const Class = classNames.get(classname)
  if(!Class) throw Error('class not registered')
  const propString = localStorage.getItem(uuid+propNamesEnd)
  if(!propString)throw Error('no propstring in localstrorage')
  const propList = JSON.parse(propString) 
  // нужно покрыть объект проксей перед вызовом конструктора
  const instance = Reflect.construct(Class, [], Class)
  const res  = PersistProxy(instance, classname, isRoot ? {} : undefined, uuid)
  ObjectsMap.set(uuid, res)
  for(const propName of propList){
    const propUUID = localStorage.getItem(uuid+propName)
    if(propUUID===null)continue
    const rehidratedProp = ObjectsMap.get(propUUID) || rehidrate(propUUID)
    Reflect.set(res, propName, rehidratedProp)
  }
  return  res
}
export const rehidrateRoot = <T>(className: string): T => {
  return rehidrate(uuidStart+className, true)
}

export const makePersistend = (className: string, isRoot?: true): (<T extends new (...args: [])=>any>(cl: T) => T) => (target) => {
  classNames.set(className, target)
  return new Proxy(target, {
    construct(t, a, n){
      const instance = Reflect.construct(t, a, n)
      const constructedProps = Object.getOwnPropertyDescriptors(instance)
      const res =  PersistProxy(instance, className, isRoot ? {} : undefined, isRoot ? uuidStart + className : undefined)
      for(const i in constructedProps){
        const pre = CONSTRUCTION
        CONSTRUCTION=true
        try{
          Reflect.defineProperty(res, i, constructedProps[i])
        }catch(e){}finally{
          CONSTRUCTION=pre
        }
      }
      return res
    }
  })
}



const notPersistedPropertyMap = new Map<any, Set<string | symbol>>()

export const notPersistedProperty: PropertyDecorator = (t, p) => {
  const obj = notPersistedPropertyMap.get(t) 
  if(obj){
    obj.add(p)
  }else{
    const set = new Set<string | symbol>()
    notPersistedPropertyMap.set(t, set)
    set.add(p)
  }
}


const PersistProxy =  <T extends { [key: string | symbol]: any}>(instance: T, className: string, parent?: object, uid?: string): T  => {

  const id = uid || uuidStart + uuidv4()
  const parentSet = new Set<object>()
  const propertySet = new Set<string | symbol>()
  const addParent = (parent: object) => {
    parentSet.add(parent)
    if(parentSet.size===1){
      localStorage.setItem(id, className)
      propertySet.forEach(p=>{
        defineProp(instance, p)
      })
      refreshPropsList(id, propertySet)
    }
  }
  const deleteParentFunction = (parent: object) => {
    parentSet.delete(parent)
    if(parentSet.size===0){
      localStorage.removeItem(id)
      propertySet.forEach(p=>{
        removeProp(instance, p)
      })
      deletePropsList(id)
    }
  }
  Reflect.defineProperty(instance, uuidSymbol, {value: id, configurable: false, writable: false, enumerable: false})
  Reflect.defineProperty(instance, addParentSymbol, {value: addParent, configurable: false, writable: false, enumerable: false})
  Reflect.defineProperty(instance, deleteParentSymbol, {value: deleteParentFunction, configurable: false, writable: false, enumerable: false})
  if(parent)addParent(parent) 
  return new Proxy(instance, {
    defineProperty(t, p, a){
      if(notPersistedPropertyMap.get(t)?.has(p)) return Reflect.defineProperty(t, p, a)
      if(!propertySet.has(p)){
        propertySet.add(p)
        parentSet.size && refreshPropsList(id, propertySet)
      }
      const oldV = Reflect.getOwnPropertyDescriptor(t,p)?.value
      const newV = a.value
      let res
      if(parentSet.size>0){
        if(oldV!==newV || CONSTRUCTION){
          removeProp(t, p)
          res = Reflect.defineProperty(t, p, a)
          defineProp(t, p)
        }
      }
      return res || Reflect.defineProperty(t, p, a)
    },
    deleteProperty(t, p){
      if(notPersistedPropertyMap.get(t)?.has(p)) return Reflect.deleteProperty(t, p)
      propertySet.delete(p)
      if(parentSet.size>0){
        removeProp(t,p)
        refreshPropsList(id, propertySet)
      }
      return Reflect.deleteProperty(t, p)
    }
  })
}


const isSerializableValue = (value: any): value is string => {
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

const refreshPropsList = (id: string, propSet: Set<string | symbol>)=>{
  const propList = []
  for(const propName of propSet){
    if(typeof propName==='string'){
      propList.push(propName)
    }
  }
  localStorage.setItem(id+propNamesEnd, JSON.stringify(propList))
}
const deletePropsList = (id: string)=>{
  localStorage.removeItem(id+propNamesEnd)
}

const removeProp = (t: any, p: string | symbol) => {
  if(notPersistedPropertyMap.get(t)?.has(p)) return 
  if(typeof p!=='string') return
  const descriptor = Reflect.getOwnPropertyDescriptor(t, p)
  if(!descriptor || !Reflect.has(descriptor, 'value')) return
  const prop = descriptor.value
  localStorage.removeItem(t[uuidSymbol]+p)
  if(isSerializableValue(prop)) return
  const oldValueDeleteParent = typeof prop==='object'? prop[deleteParentSymbol] : undefined
  oldValueDeleteParent && oldValueDeleteParent(t)
}
const defineProp = (t:any,p: string | symbol) => {
  if(notPersistedPropertyMap.get(t)?.has(p)) return 
  if(typeof p !== 'string')return
  const descriptor = Reflect.getOwnPropertyDescriptor(t, p)
  if(!descriptor || !Reflect.has(descriptor, 'value')) return
  const prop = descriptor.value
  const id = t[uuidSymbol]
  if(isSerializableValue(prop)){
    localStorage.setItem(id+p, JSON.stringify(prop))
  }else if(reverseSimpleValueMap.has(prop)){
    localStorage.setItem(id+p, reverseSimpleValueMap.get(prop)!)
  }else if(typeof prop==='object'){
    const newValueAddParent = typeof prop==='object'? prop[addParentSymbol] : undefined
    const propUUID= prop[uuidSymbol]
    propUUID && localStorage.setItem(id+p, propUUID)
    newValueAddParent && newValueAddParent(t)
  }
}
