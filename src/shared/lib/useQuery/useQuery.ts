import { useCallback, useState } from "react"
type Overwrite<T, U> = Omit<T, keyof U> & U;
type TResult<T extends (...args: any[])=>Promise<any>, ST extends Status> = StatusExtend<ST, T>
type TBaseRes<T extends Status, F extends (...args: any[])=>Promise<any>>  = {
  status: T, 
  result: undefined, 
  toggleQuery: F, 
  error: undefined, 
  isPending: false, 
  isDefault: false,
  isSuccess: false,
  isError: false,
} 
type StatusExtend<T extends Status, F extends (...args: any[])=>Promise<any>> = 
T extends Status.default ? Overwrite<TBaseRes<T,F>,{isDefault: true}> :
T extends Status.error ? Overwrite<TBaseRes<T,F>,{isError: true, error: Error}> :
T extends Status.pending ? Overwrite<TBaseRes<T,F>,{toggleQuery: undefined, isPending: true}> :
T extends Status.success ? Overwrite<TBaseRes<T,F>,{isSuccess: true, result: TResp<F> }> : never

type TResp<T extends (...args: any[])=>Promise<any>> = Awaited<ReturnType<T>> 
export enum Status{
  pending = 'pending',
  error = 'error',
  success = 'success',
  default = 'default',
}
type aa<K extends string> = K extends `is${infer _}` | 'toggleQuery' ? K : never
type TState<T extends (...args: any[])=>Promise<any>>  = Omit<StatusExtend<Status, T>, aa<keyof StatusExtend<Status, T>>>


export const useQuery = <T extends (...args: any[])=>Promise<any>>(query: T) => {
  const [{status, error, result}, setState] = useState<TState<T>>({error: undefined, result: undefined, status: Status.default})
  //@ts-ignore
  const toggleQuery = useCallback<T>((...args) => {
      setState({status: Status.pending, error: undefined, result: undefined})
      return query(...args)
        .then(
          res=>{
            setState({status: Status.success, error: undefined, result: res});
            return res
          },
          e=>{
            setState({status: Status.error, error: e, result: undefined});
            throw e
          }
        )
  }, [query, setState]) as T
  const res = {
    error,
    status,
    result,
    toggleQuery: status===Status.pending ? undefined : toggleQuery,
    isPending: status===Status.pending,
    isSuccess: status===Status.success,
    isDefault: status===Status.default,
    isError: status===Status.error
  } as TResult<T, Status>
  return res
}