import { CBobj, GLOBAL, addReactions } from "./Global";







export const autorun = (cb: ((dispose: CBobj['onDelete']) => void)) => {
  const closure: CBobj = {
    toDelete: new Set(),
    cb: () => { },
    onDelete: ()=>{}
  };
  closure.onDelete = function (this: CBobj) {
    this!.toDelete.forEach(f => f());
    this!.toDelete.clear();
  }.bind(closure);
  const toInvoke = () => {
    closure.onDelete && closure.onDelete();
    const prev = GLOBAL.currentClosure;
    GLOBAL.currentClosure = closure;
    try {
      cb(closure.onDelete);
    } catch (e) {
    } finally {
      GLOBAL.currentClosure = prev;
      GLOBAL.reactions.delete(toInvoke)
      addReactions()
    }
  };
  closure.cb = toInvoke;
  toInvoke();
  return closure.onDelete;

};
