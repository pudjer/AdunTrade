import ky from "ky";
import {baseLocation, Locations} from './locations'
import { RefreshResponse } from "./types/Refresh";
import { LoginRequest, LoginResponse } from "./types/Login";
import { MeResponse } from "./types/Me";
import { SubscribeResponse } from "./types/Subscribe";
import { UnsubscribeResponse } from "./types/Unsubscribe";
import { RegisterRequest, RegisterResponse } from "./types/Register";


export const api = ky.create({
  prefixUrl: baseLocation,
})

export const refreshTokens = () => api.post(Locations.refresh).json<RefreshResponse>()

export const login = (json: LoginRequest) => api.post(Locations.login, {json}).json<LoginResponse>()

export const getMe = () => api.post(Locations.me).json<MeResponse>()

export const subscribe = () => api.post(Locations.subscribe).json<SubscribeResponse>()

export const unsubscribe = () => api.post(Locations.unsubscribe).json<UnsubscribeResponse>()

export const register = (json: RegisterRequest) => api.post(Locations.register, {json}).json<RegisterResponse>()