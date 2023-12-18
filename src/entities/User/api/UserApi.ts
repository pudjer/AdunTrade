import ky from "ky";
import {baseLocation, Locations} from './locations'
import { LoginRequest, LoginResponse } from "./types/Login";
import { MeResponse } from "./types/Me";
import { SubscribeResponse } from "./types/Subscribe";
import { UnsubscribeResponse } from "./types/Unsubscribe";
import { RegisterRequest, RegisterResponse } from "./types/Register";
import { LOCAL_STORAGE_TOKEN_KEY } from "@/shared/const/localstorage";


export const api = ky.create({
  prefixUrl: baseLocation,
})
const getHeaders = ()=>({Authorization: 'Bearer '+localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)})

export const login = (json: LoginRequest) => api.post(Locations.login, {json}).json<LoginResponse>()

export const getMe = () => api.get(Locations.me, {headers:getHeaders()}).json<MeResponse>()

export const subscribe = () => api.post(Locations.subscribe, {headers:getHeaders()}).json<SubscribeResponse>()

export const unsubscribe = () => api.post(Locations.unsubscribe, {headers:getHeaders()}).json<UnsubscribeResponse>()

export const register = (json: RegisterRequest) => api.post(Locations.register, {json}).json<RegisterResponse>()