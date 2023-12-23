
export type ReactionMap = Map<string | symbol, Set<CBobj['cb']>>


export type CBobj = { 
  cb: (() => void)
  onDelete: () => void
  toDelete: Set<(()=>void)>
} 

type GLOBALT = {
  currentClosure: CBobj | null
  allowInvokeReactions: boolean
  reactions: Set<(() => void)>
  goReactions: () => void
}
export const GLOBAL: GLOBALT = {
  currentClosure: null,
  allowInvokeReactions: true,
  reactions: new Set(),
  goReactions() {
    this.reactions.forEach(f => {
      try{
        f()
      }catch(e){}
    })

  },
}
const withoutAddingTriggers = (cb: () => any) => {
  const perp = GLOBAL.currentClosure
  GLOBAL.currentClosure = null
  let res
  try{
    res = cb()
  }catch(e){
    throw e
  }finally{
    GLOBAL.currentClosure = perp
  }
  return res
}
export const withoutInvokingReactions = (cb: () => any) => {
  const perp = GLOBAL.allowInvokeReactions
  GLOBAL.allowInvokeReactions = false
  let res
  try{
    res = cb()
  }catch(e){
    throw e
  }finally{
    GLOBAL.allowInvokeReactions = perp
  }
  return res
}


export const addReactions = (map?: ReactionMap, p?: string | symbol) => {
  p && map?.get(p)?.forEach(f => GLOBAL.reactions.add(f))
  if (GLOBAL.currentClosure === null && GLOBAL.allowInvokeReactions) {
    GLOBAL.goReactions()
  }
}

export const skipObserving = (cb: () => any) => {
  return withoutInvokingReactions(() => withoutAddingTriggers(cb))
}


export const checkIsDiffProperty = (t: object, p: string|symbol, a: PropertyDescriptor) => {
  const prep = Object.getOwnPropertyDescriptor(t,p)
  return !prep ||
   a.value!==prep.value ||
  a.configurable!==prep.configurable ||
  a.writable!==prep.writable ||
  a.enumerable!==prep.enumerable ||
  a.get!==prep.get ||
  a.set!==prep.set
}

export const addHandlers = (p: string | symbol, map: ReactionMap) => {
  if (GLOBAL.currentClosure) {
    let propSet = map.get(p)
    if (!propSet) {
      propSet = new Set<() => void>()
      map.set(p, propSet)
    }
    const foo = GLOBAL.currentClosure.cb
    propSet.add(foo)
    GLOBAL.currentClosure!.toDelete.add(() => { propSet!.delete(foo); GLOBAL.reactions.delete(foo) })
  }
}

