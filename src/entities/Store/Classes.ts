import { makePersistend } from "@/shared/lib/model-persist/PersistProxy";
import { makeObservable } from "@/shared/lib/model-persist/obvservable";
@makePersistend('myarray')
@makeObservable
export class MyArray<T> extends Array<T>{}