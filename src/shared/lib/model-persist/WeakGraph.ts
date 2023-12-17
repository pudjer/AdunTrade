type setTripletArg<T, L> = { parent: T; child: T; link?: L; };
type getTripletRes<T, L> =  { parent: T; child: T; link: L; }[];


export class WeakGraph<T extends WeakKey = WeakKey, L = undefined> {
  private readonly NodeChilds = new WeakMap<T, Map<L, Set<T>>>();
  private readonly NodeParents = new WeakMap<T, Map<L, Set<T>>>();
  #setNode(node: T) {
    this.NodeChilds.set(node, new Map());
    this.NodeParents.set(node, new Map());
  }


  setTriplet({parent, child, link}: setTripletArg<T,L>) {
    if(!parent || !child) return

    let concreteChildren: Set<T> | undefined
    let parentChildrenLinks = this.NodeChilds.get(parent);
    if (!parentChildrenLinks) {
      this.#setNode(parent);
      parentChildrenLinks = this.NodeChilds.get(parent);
    }
    concreteChildren = parentChildrenLinks!.get(link!);
    if (!concreteChildren) {
      const toassign = new Set<T>();
      parentChildrenLinks!.set(link!, toassign);
      concreteChildren = toassign;
    }
    let concreteParents: Set<T> | undefined
    let childParentsLink = this.NodeParents.get(child);
    if (!childParentsLink) {
      this.#setNode(child);
      childParentsLink = this.NodeParents.get(child);
    }
    concreteParents = childParentsLink!.get(link!);
    if (!concreteParents) {
      const toassign = new Set<T>();
      childParentsLink!.set(link!, toassign);
      concreteParents = toassign;
    }
    concreteChildren.add(child);
    concreteParents.add(parent);
  }
  getTriplets(
    {parent, child, link} : Partial<setTripletArg<T,L>> & ({child: T} | {parent: T}),
  ): getTripletRes<T, L> {
    if(!parent && !child)throw Error('specify node')
    if(!("link" in arguments[0])){
      if(!child){
        const linkMap = this.NodeChilds.get(parent!)
        const res: getTripletRes<T,L> = []
        linkMap && linkMap.forEach((childSet, link) => {
          childSet && childSet.forEach(child=>res.push({child, parent: parent!, link}))
        })
        return res
      }
      if(!parent){
        const linkMap = this.NodeParents.get(child!)
        const res: getTripletRes<T,L> = []
        linkMap && linkMap.forEach((parentSet, link) => {
          parentSet && parentSet.forEach(parent=>res.push({child, parent, link}))
        })
        return res
      }
      const parentChildrenLinks = this.NodeChilds.get(parent)?.keys()
      if(!parentChildrenLinks)return []
      const childParentsLinks = this.NodeParents.get(child)
      if(!childParentsLinks)return []
      const linksBetween = new Set<L>()
      for(const parentLink of parentChildrenLinks){
        if(childParentsLinks.has(parentLink))linksBetween.add(parentLink)
      }
      const res: getTripletRes<T,L> = []
      linksBetween.forEach(link=>res.push({parent, child, link}))
      return res
    }else{
      if(!child){
        const children =  this.NodeChilds.get(parent!)?.get(link!)
        if(!children)return[]
        const res: getTripletRes<T,L> = []
        children.forEach(child=>res.push({parent: parent!, child, link: link!}))
        return res
      }
      if(!parent){
        const parents =  this.NodeParents.get(child!)?.get(link!)
        if(!parents)return[]
        const res: getTripletRes<T,L> = []
        parents.forEach(parent=>res.push({parent, child: child!, link: link!}))
        return res
      }
      const res = this.NodeChilds.get(parent!)?.get(link!)?.has(child!)
      return res ? [{parent: parent!, child: child!, link: link!}] : []
    }
  }
  deleteTriplets(
    args : Partial<setTripletArg<T,L>> & ({child: T} | {parent: T})
  ){
    this.getTriplets(args).forEach(({child, parent, link})=>{
      const childLinks = this.NodeChilds.get(parent)
      const concreteChildren = childLinks?.get(link)
      concreteChildren?.delete(child)
      if(childLinks){
        if(!concreteChildren || concreteChildren.size === 0){
          childLinks.delete(link)
        }
      }
      const parentLinks = this.NodeParents.get(child)
      const concreteParents = parentLinks?.get(link)
      concreteParents?.delete(parent)
      if(parentLinks){
        if(!concreteParents || concreteParents.size === 0){
          parentLinks.delete(link)
        }
      }
    })
  }
}

