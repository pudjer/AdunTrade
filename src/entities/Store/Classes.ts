import { makePersistend } from "@/shared/lib/model-persist/PersistProxy";
import { makeObservable } from "@/shared/lib/observavle/obvservable";
import { SearchResponse } from "@/widgets/Search/Search";
@makePersistend('myarray')
@makeObservable
export class MyArray<T> extends Array<T>{}


@makePersistend('search')
@makeObservable
export class SearchState{
  options = new MyArray<SearchResponse['hits']['hits'][number]['_source']>()
  value = ''
  error?: string

}

@makePersistend('option')
@makeObservable
export class Coption{
  name!: string
  linktoimg!: string
}
export const optionFactory = (name: string, linktoimg: string) => {
  const res = new Coption()
  res.name = name
  res.linktoimg = linktoimg
  return res
}