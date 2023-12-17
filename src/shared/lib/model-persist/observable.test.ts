import { describe, it, expect, vitest, beforeEach,  } from "vitest";
import { makePersistend } from "./PersistProxy";
import { makeObservable } from "./obvservable";
import { autorun } from "./autorun";



@makeObservable
class MyArray extends Array{}

@makeObservable
class Child{
  constructor(
    public b: string,
    public arr: MyArray = (()=>{const arr = new MyArray(); arr.length; return arr})()
    ){
      
    }
  }

@makeObservable
class Parent{
  constructor(
    public a: string,
    public child: Child = new Child('dfddfdf')
    ){}
  }
  



describe('autorun | innerautorun | object | innerobject (deleted)?',  function(){
  let par: Parent
  let child: Child

  beforeEach(()=>{
    par = new Parent('aff')
    child = new Child('afad')
    par.child = child
  })

  it('1(deleted after) | 0 | 1 | 0', async function(){
    const testFn = vitest.fn(()=>par.child.arr)
    const dispose = autorun(testFn)
    for(let i = 0; i<10; i++){
      par.child = new Child('ssss')
      par.a = 's'
    }
    dispose()
    for(let i = 0; i<10; i++){
      par.child = new Child('ssss')
      par.a = 's'
    }
    expect(testFn).toBeCalledTimes(11)
    expect(par.a).toBe('s')
  })

  it('1(deleted after) | 1 | 1 | 0', ()=>{
    const innerDisposes = []
    const testFn1 = vitest.fn(()=>par.child)
    const testFn2 = vitest.fn(()=>{
      par.child
      innerDisposes.push(autorun(testFn1))
    })
    const disposeOuter = autorun(testFn2)


    for(let i = 0; i<10; i++){
      par.child = new Child('ssss')
    }


    expect(testFn1).toBeCalledTimes(66)
    expect(testFn2).toBeCalledTimes(11)
    
    disposeOuter()

    for(let i = 0; i<10; i++){
      par.child = new Child('ssss')
    }
    expect(testFn1).toBeCalledTimes(176)
    expect(testFn2).toBeCalledTimes(11)

  })



  it('1(deleted after) | 0 | 1 | 1(deleted after)', ()=>{
    const testFn1 = vitest.fn(()=>{
      par.child
      par.child.b
      par.a
    })
    autorun(testFn1)


    for(let i = 0; i<10; i++){
      par.child.b = par.child.b + 'd'
    }
    expect(testFn1).toBeCalledTimes(11)
    const preChild = par.child
    for(let i = 0; i<10; i++){
      par.child = new Child('dd')
      par.child.b = par.child.b + 'zz'
    }
    expect(testFn1).toBeCalledTimes(31)
    for(let i = 0; i<10; i++){
      preChild.b = preChild.b + 'aaa'
    }
    expect(testFn1).toBeCalledTimes(31)


  })
  it('1 | 0 | 1 | 0 inner update', ()=>{
    const testFn1 = vitest.fn(()=>{
      par.child.b = par.child.b + 'd' 
    })
    autorun(testFn1)


    for(let i = 0; i<10; i++){

      par.child.b = par.child.b + 'd'

    }
    expect(testFn1).toBeCalledTimes(11)

  })
  it('1 | 1 | 1 | 0 inner update', ()=>{
    const testFn1 = vitest.fn(()=>{
      par.child = new Child('j'); par.child 
    })
    const testFn2 = vitest.fn(()=>{
      par.child
      autorun(testFn1)()
    })
    autorun(testFn2)


    for(let i = 0; i<10; i++){
      par.child = new Child('j')
    }
    expect(testFn1).toBeCalledTimes(11)
    expect(testFn2).toBeCalledTimes(11)


  })

})

